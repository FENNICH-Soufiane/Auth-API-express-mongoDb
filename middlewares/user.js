const { isValidObjectId } = require("mongoose");
const { sendError } = require("../utils/helper");
const User = require("../model/user");
const ResetToken = require("../model/resetToken");

exports.isResetTokenValid = async (req, res, next) => {
  const { token, id } = req.query;
  if (!token || !id) return sendError(res,400, "Invalid request!");

  if (!isValidObjectId(id)) return sendError(res,400, "Invalid user!");

  const user = await User.findById(id);
  if (!user) return sendError(res,404,  "user not found!");

  const resetToken = await ResetToken.findOne({ owner: id }); // Trouver le token associé à l'utilisateur
  if (!resetToken) return sendError(res, 404, "Reset token not found!");

  const isValid = await resetToken.compareToken(token);
  if (!isValid) return sendError(res,400, "Reset token is not valid!");

  req.user = user;

  next();
};
