const jwt = require("jsonwebtoken");
require("dotenv").config();

// exports.verifyToken = (req, res, next) => {
//   const token = req.header("Authorization");
//   console.log(token)
//   if (!token) {
//     return res.status(401).json({ error: "Unauthorized" });
//   }
//   try {
//     const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT);
//     console.log(decoded);
//     next();
//   } catch (error) {
//     console.error(error);
//     return res.status(401).json({ error: "Unauthorized" });
//   }
// };

function verifyToken(req, res, next) {
  // const token = req.header("Authorization");

  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
      // console.log(token);
      // console.log(req.headers.authorization);
    }

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT);
    // req.userId = decoded.userId;
    console.log(decoded);
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "Unauthorized" });
  }
}

module.exports = verifyToken;
