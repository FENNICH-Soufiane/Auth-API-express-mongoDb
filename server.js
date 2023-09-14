const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const userRoutes = require("./routes/user")
const port = 3000;

const PORT = process.env.PORT || port;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// ce code peut etre remplacer par app.user(express.json())
// app.use((req, res, next) => {
//   req.on("data", (x) => {
//     // console.log(x);// return buffer
//     // console.log(JSON.parse(x));//return original element
//     req.body = JSON.parse(x)
//     next();
//   });
// });

app.use(express.json());

app.use('/api/user', userRoutes)

app.use((req, res, next) => {
  res.status(404).json({message: "Route non trouvée"})
  next();
});

app.listen(PORT, async () => {
  try {
    const connect = await mongoose.connect(
      "mongodb+srv://authapi:authapi@cluster0.ml4xru6.mongodb.net/Auth-API?retryWrites=true&w=majority"
    );
    console.log(`Database Connected ${connect.connection.host}`);
    console.log(`Example app listening on port ${PORT}`);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
});
