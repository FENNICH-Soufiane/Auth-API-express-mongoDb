const nodemailer = require("nodemailer");

exports.generateOTP = () => {
  let otp = "";
  for (let i = 0; i <= 3; i++) {
    const randVal = Math.round(Math.random() * 9);
    otp = otp + randVal;
  }
  return otp;
};

exports.mailTransport = () =>
  nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.MAILTRAP_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });

exports.generateEmailTemplate = (code) => {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Confirmation</title>
      <style>
          /* Add your CSS styles here */
          body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
          }
  
          .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #ffffff;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
  
          h1 {
              color: #333;
          }
  
          p {
              color: #666;
          }
  
          .button {
              display: inline-block;
              padding: 10px 20px;
              background-color: #007bff;
              color: #fff;
              text-decoration: none;
              border-radius: 4px;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <h1>Email Confirmation</h1>
          <p>Thank you for signing up! This is your code verification.</p>
          <h3>${code}</h3>
          </div>
  </body>
  </html>
  `;
};

exports.plainEmailTemplate = (heading, message) => {
  return `
  `
}

exports.generatePasswordResetTemplate = url => {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Confirmation</title>
      <style>
          /* Add your CSS styles here */
          body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
          }
  
          .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #ffffff;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
  
          h1 {
              color: #333;
          }
  
          p {
              color: #666;
          }
  
          .button {
              display: inline-block;
              padding: 10px 20px;
              background-color: #007bff;
              color: #fff;
              text-decoration: none;
              border-radius: 4px;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <h1>Reset Password</h1>
          <p>Please Link Below to Reset Password.</p>
          <a class="button" href="${url}">Reset Password</a>
          </div>
  </body>
  </html>
  `;
}
