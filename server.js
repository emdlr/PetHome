require('dotenv').config();
const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const app = express(); //app is an object
const methodOverride = require("method-override");

const verifyToken = (req, res, next) => {
    let token = req.cookies.jwt; // COOKIE PARSER GIVES YOU A .cookies PROP, WE NAMED OUR TOKEN jwt
  
    console.log("Cookies: ", req.cookies.jwt);
  
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
      if (err || !decodedUser) {
        return res.status(401).json({ error: "Unauthorized Request" });
      }
      req.user = decodedUser; // ADDS A .user PROP TO REQ FOR TOKEN USER
      console.log(decodedUser);
  
      next();
    });
  };

app.use(express.static("public"));
app.use(cookieParser());
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use("/auth", require("./controllers/authController.js"));
app.use("/pets", require("./controllers/petsController.js"));
app.use("/users", verifyToken, require("./controllers/usersController.js"));
app.use("/home", require("./controllers/homeController.js"));
app.use("/adoptions", require("./controllers/adoptionsController.js"));


//INDEX
app.get("/", (req, res) => {
  res.redirect("/home")
});

app.listen(process.env.PORT, () => {
    console.log('PetHome Server Listening');
  });
  

