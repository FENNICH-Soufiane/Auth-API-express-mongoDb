const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { isValidObjectId } = require("mongoose");
require("dotenv").config();

const User = require("../model/user");
const VerificationToken = require("../model/verificationToken");
const ResetToken = require("../model/resetToken");

const { sendError, createRandomBytes } = require("../utils/helper");
const {
  generateOTP,
  mailTransport,
  generateEmailTemplate,
  generatePasswordResetTemplate,
} = require("../utils/mail");

exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Ce code a été deplacé dans model/user.js👈👈🏿👈🏻
    // const saltRounds = 10;
    // const salt = await bcrypt.genSalt(saltRounds);
    // console.log(salt)
    // const hashedPassword = await bcrypt.hash(password, salt);
    // const newUser = new User({ name, email, password: hashedPassword });

    const newUser = new User({ name, email, password });
    const user = await User.findOne({ email });
    // console.log(user)
    if (user) {
      // return res
      //   .status(400)
      //   .json({ success: false, error: "This email is already exist" });
      return sendError(res, 400, "This email is already exist");
    }

    const OTP = generateOTP();
    const verificationToken = new VerificationToken({
      owner: newUser._id,
      token: OTP,
    });

    await verificationToken.save();
    await newUser.save();

    mailTransport().sendMail(
      {
        from: "emailVerification@gmail.com", // sender address
        to: newUser.email, // list of receivers
        subject: "Verify your email account", // Subject line
        // text: "Hello world?", // plain text body
        // html: `<h1>${OTP}</h1>`, // html body
        html: generateEmailTemplate(OTP),
      },
      (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
        } else {
          console.log("Email sent:", info.response);
        }
      }
    );

    res.json(newUser);
  } catch (err) {
    console.log(err);
    return sendError(res, 500, "Failed to create user");
    // res.status(500).json({ error: "Failed to create user" });
  }
};

exports.signin = async (req, res) => {
  const { email, password } = req.body;
  if (!email.trim() || !password.trim()) {
    sendError(res, "email/password missing!");
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return sendError(res, "User not found");
    }
    // const isMatched = await bcrypt.compare(password, user.password);
    // console.log(comparePassword) return true or false
    // ce code ☝🏻 va etre remplacer par ce code 👇🏻 qui vient model/user.js
    const isMatched = await user.comparepassword(password);
    if (!isMatched) {
      return sendError(res, "email/password does not match");
    }
    const token = jwt.sign(
      { userId: user._id, name: user.name },
      process.env.SECRET_KEY_JWT,
      { expiresIn: "1d" }
    );
    res.json({ success: true, user, token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to login user" });
  }
};

// this is my code🤏🏻👌🏻 , à ignorer
exports.verifyEmailMy = async (req, res) => {
  const { userId, otp } = req.body;
  if (!userId.trim() || !otp.trim()) {
    return sendError(res, 404, "All fields are required");
  }
  const verificationToken = await VerificationToken.findOne({ owner: userId });
  console.log(verificationToken);
  if (!verificationToken) {
    return sendError(res, 404, "User not found");
  }
  const isTokenValid = await verificationToken.compareToken(otp);
  if (isTokenValid) {
    console.log("token is valid");
    res
      .status(200)
      .json({ success: true, message: "code of verification is correct" });
  } else {
    console.log("token is invalid");
    res
      .status(400)
      .json({ success: false, message: "code of verification is incorrect" });
  }
};

exports.verifyEmail = async (req, res) => {
  console.log("Received POST request to /api/user/verifyEmail");
  const { userId, otp } = req.body;
  if (!userId.trim() || !otp.trim()) {
    return sendError(res, "All fields are required");
  }
  if (!isValidObjectId(userId)) {
    return sendError(res, "invalid user id");
  }
  const user = await User.findById(userId);
  if (!user) return sendError(res, "Sorry, user not found!");

  if (user.verified)
    return sendError(res, 400, "This user is already verified");

  const token = await VerificationToken.findOne({ owner: user._id });
  if (!token) return sendError(res, "Sorry, user not found!");

  const isMatched = await token.compareToken(otp);
  if (!isMatched) return sendError(res, "Please provide a valid token");

  user.verified = true;
  await VerificationToken.findByIdAndDelete(token._id);

  await user.save();

  mailTransport().sendMail(
    {
      from: "emailVerification@gmail.com", // sender address
      to: user.email, // list of receivers
      subject: "Verify your email account", // Subject line
      // text: "Hello world?", // plain text body
      // html: `<h1>${OTP}</h1>`, // html body
      html: `<h3>Email verified successfuly</h3>`,
    },
    (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    }
  );
  return res.json({
    success: true,
    message: "your email is verified.",
    user,
  });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return sendError(res, 400, "please provide a valid email");

  const user = await User.findOne({ email });
  console.log(user._id.toString());
  if (!user) return sendError(res, 400, "User not found, invalid request!");

  const x = user._id.toString();

  const token = await ResetToken.findOne({ owner: x });
  console.log(token);
  if (token)
    return sendError(
      res,
      200,
      "Only after one hour you can request for another token!"
    );

  const randomBytes = await createRandomBytes();
  const resetToken = new ResetToken({ owner: user._id, token: randomBytes });
  await resetToken.save();

  mailTransport().sendMail(
    {
      from: "security@gmail.com", // sender address
      to: user.email, // list of receivers
      subject: "Paswword Reset", // Subject line
      // text: "Hello world?", // plain text body
      // html: `<h1>${OTP}</h1>`, // html body
      html: generatePasswordResetTemplate(
        `${process.env.URL}/reset-password?token=${randomBytes}&id=${user._id}`
      ),
    },
    (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    }
  );
  res.json({
    success: true,
    message: "Password reset link is sent to your email.",
  });
};

// resetPassword est preceder par un middleware qui se termine par req.user = user
exports.resetPassword = async (req, res) => {
  // const {user} = req
  const { password } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) return sendError(res, "user not found!");

  const isSamePassword = await user.comparepassword(password);
  if (isSamePassword) return sendError(res,400, "New password must be different!");

  if (password.trim().length < 8 || password.trim().length > 20) {
    return sendError(res, "New password must be 8 to 20 characters long!");
  }

  user.password = password.trim();
  await user.save();

  // await ResetToken.findByIdAndDelete({ owner: user._id.toString() });

  
    const userIdString = user._id.toString(); // Convertir user._id en chaîne si ce n'est pas déjà le cas
    console.log(userIdString)
    const x = await ResetToken.findOneAndDelete({owner: userIdString});
    if(!x) return sendError(res,400, "x");

  mailTransport().sendMail(
    {
      from: "security@gmail.com", // sender address
      to: user.email, // list of receivers
      subject: "Paswword Reset Successfully", // Subject line
      html: `<h2>Password Reset Successfully</h2><br><h2>Now you can login with new Password</h2>`,
    },
    (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    }
  );

  res.json({success: true, message: "Password Reset Successfully"})
};
