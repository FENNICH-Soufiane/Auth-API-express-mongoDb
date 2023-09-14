// const express = require("express")👇
// const router = express.Router()

const router = require("express").Router();
const {
  createUser,
  signin,
  verifyEmail,
  forgotPassword,
  resetPassword
} = require("../controllers/user");
const { validateUser, validateLogin } = require("../middlewares/validator");
const verifyToken = require("../middlewares/protectMiddelware");
const {isResetTokenValid} = require("../middlewares/user")

router.post("/create", validateUser, createUser);
router.post("/login", validateLogin, signin);

// Protected route
router.get("/protected", verifyToken, (req, res) => {
  // You can access the authenticated user's ID using req.userId
  return res.json({ message: "This route is protected!" });
});

router.post("/verifyEmail", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password",isResetTokenValid, resetPassword);


module.exports = router;
