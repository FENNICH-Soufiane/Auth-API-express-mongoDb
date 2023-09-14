const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: "",
  },
  verified: {
    type: Boolean,
    default: false,
    required: true
  }
}, { timestamps: true });

userSchema.pre("save", async function(next) {
  const user = this;
  if (!user.isModified("password")) return next();
  try {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
    next();
  } catch (err) {
    return next(err);
  }
});

// function for compare password
userSchema.methods.comparepassword =async function(password) {
  const result = await bcrypt.compare(password, this.password)
  return result
}

module.exports = mongoose.model("User", userSchema);
