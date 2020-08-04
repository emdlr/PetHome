require('dotenv').config()
const express = require("express");
const router = express.Router();

const User = require("../models").User;
const Message = require("../models").Message;
const UserRole = require("../models").UserRole;
const Role = require("../models").Role;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// GET SIGNUP FORM
router.get("/signup", (req, res) => {
  Role.findAll().then((roles)=>{
    res.render("users/signup.ejs",{roles:roles});
  });
});
  
// POST - CREATE NEW USER FROM SIGNUP
router.post("/", (req, res) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) return res.status(500).json(err);
  
      bcrypt.hash(req.body.password, salt, (err, hashedPwd) => {
        if (err) return res.status(500).json(err);
        req.body.password = hashedPwd;

        User.create(req.body)
          .then((newUser) => {
            const token = jwt.sign(
              {
                username: newUser.username,
                id: newUser.id,
              },
              process.env.JWT_SECRET,
              {
                expiresIn: "30 days",
              }
            );
            console.log(token);
        res.cookie("jwt", token); // SEND A NEW COOKIE TO THE BROWSER TO STORE TOKEN
        console.log(req.body)
            if(Array.isArray(req.body.role)){
                req.body.role.forEach(element => {
                  UserRole.create({
                    userId: newUser.id,
                    roleId: element
                  })
                });
            }else{
              UserRole.create({
                userId: newUser.id,
                roleId: req.body.role
              });
            };
            res.redirect(`/users/profile/${newUser.id}`);
          })
          .catch((err) => {
            console.log(err);
            res.send(`err ${err}`);
          });
      });
    });
  });
// GET LOGIN
// router.get("/profile/:id", (req, res) => {
//     res.render("users/login.ejs");
// });

// POST LOGIN
// router.post("/login", (req, res) => {
//     User.findOne({
//       where: {
//         username: req.body.username,
//         password: req.body.password,
//       },
//     }).then((foundUser) => {
//       res.redirect(`/users/profile/${foundUser.id}`);
//     });
//   });
router.post("/login", (req, res) => {
    User.findOne({ where: {username: req.body.username}}).then((foundUser) => {
      if (foundUser) {
        bcrypt.compare(req.body.password, foundUser.password, (err, match) => {
          if (match) {
            const token = jwt.sign(
              {
                username: foundUser.username,
                id: foundUser.id,
              },
              process.env.JWT_SECRET,
              {
                expiresIn: "30 days",
              }
            );
            console.log(token);
        res.cookie("jwt", token); // SEND A NEW COOKIE TO THE BROWSER TO STORE TOKEN
            res.redirect(`/users/profile/${foundUser.id}`);
          } else {
            res.sendStatus(400);
          }
        });
      }else{
         Message.findByPk(1).then((message)=>{
            const ms = (message)?message.message:"";
            res.send(ms);
        });
      }
    })
  });
//UPDATE USER
  router.put("/profile/:id", (req, res) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) return res.status(500).json(err);
  
      User.findByPk(req.params.id).then((usr)=>{

        if(usr.password!=req.body.password){
              bcrypt.hash(req.body.password, salt, (err, hashedPwd) => {
                if (err) return res.status(500).json(err);
                    req.body.password = hashedPwd;

                User.update(req.body, {where: {id: req.params.id},returning: true}).then((updUser) => {
                    res.redirect("/home");
                }).catch((err) => {
                    console.log(err);
                    res.send(`err ${err}`);
                });
              });
          }else{
              User.update({name:req.body.name,
                          username:req.body.username,
                          lastname:req.body.lastname,
                          telephone:req.body.telephone,
                          email:req.body.email,
                          country:req.body.country,
                          state:req.body.state,
                          city:req.body.city,
                          zip:req.body.zip,
                          updatedAt:new Date()
                        }, {where: {id: req.params.id},returning: true}).then(() => {
                  res.redirect("/home");
              }).catch((err) => {
                  console.log(err);
                  res.send(`err ${err}`);
              });
            };
    });
      
    });
  });
  module.exports = router;
  