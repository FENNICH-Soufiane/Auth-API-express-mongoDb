const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const verificationTokenSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  token: {
    type:String,
    required: true
  },
  createdAt: {
    type: Date,
    expires: 3600,
    default: Date.now()
  }
});

verificationTokenSchema.pre("save", async function(next) {
  
  if (!this.isModified("token")) return next();
  try {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedToken = await bcrypt.hash(this.token, salt);
    this.token = hashedToken;
    next();
  } catch (err) {
    return next(err);
  }
});

// function for compare password
verificationTokenSchema.methods.compareToken =async function(token) {
  const result = await bcrypt.compare(token, this.token)
  return result
}

module.exports = mongoose.model("VerificationToken", verificationTokenSchema);
