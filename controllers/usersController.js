const express = require('express');
const sequelize = require('sequelize');
const router = express.Router();
let isCorrect='';

const User = require("../models").User;
const Pet = require('../models').Pet;//Bringing object to make joins with this model
const Role = require("../models").Role;

  // GET USERS PROFILE
  router.get("/profile/:id", (req, res) => {
    User.findByPk(req.params.id,{
      include: [
        {
          model: Pet,
          attributes: ["name"]
        },
        {
          model: Role
        }
      ]
    }).then((userProfile) => {
      res.render("users/profile.ejs", {
        user: userProfile,
      });
    });
  });
  
  // EDIT PROFILE
  // router.put("/profile/:id", (req, res) => {
  //   console.log(req.body)
  //   User.update(req.body, {where: {id: req.params.id},returning: true}).then((updatedUser) => {
  //     res.redirect(`/users/profile/${req.params.id}`);
  //   });
  // });
  
  // DELETE USER
  router.delete("/:id", (req, res) => {
    User.destroy({
      where: {
        id: req.params.id,
      },
    }).then(() => {
      res.redirect("/home");
    });
  });
  
  module.exports = router;
  