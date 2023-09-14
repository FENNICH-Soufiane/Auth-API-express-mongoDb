const { check } = require("express-validator");
const validatorMiddleware = require("./validatorMiddleware");

exports.validateUser = [
  check("name")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Name is missing")
    .isLength({ min: 3, max: 20 })
    .withMessage("Name must be 3 to 20 characters long!"),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password is missing")
    .isLength({ min: 8, max: 20 })
    .withMessage("Password must be 8 to 20 caracters long!"),
  validatorMiddleware,
];

exports.validateLogin = [
  check("email")
    .isEmail()
    .withMessage("le format de l'email est incorrect")
    .not()
    .isEmpty()
    .withMessage("Email is required"),
    validatorMiddleware,
];
