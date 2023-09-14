const crypto = require("crypto")

exports.sendError = (res, status=401, error) => {
  res
    .status(status)
    .json({ success: false, error });
};

// exports.createRandomBytes = () => {
//   new Promise((resolve, reject) => {
//     crypto.randomBytes(30, (err, buff) => {
//       if(err) reject(err)

//       const token = buff.toString('hex')
//       resolve(token)
//     })
//   })
// }
// 👇🏻
// 👇🏻
exports.createRandomBytes = async () => {
  try {
    const randomBytes = await crypto.randomBytes(30);
    const token = randomBytes.toString('hex');
    return token;
  } catch (error) {
    throw error;
  }
};
