const express = require('express');
const sequelize = require('sequelize');
const user = require('../models/user');
const router = express.Router();
let isCorrect='';

$notIn = sequelize.Op.notIn;
$in = sequelize.Op.in;
$ne = sequelize.Op.ne;

const User = require("../models").User;
const Pet = require('../models').Pet;//Bringing object to make joins with this model
const Role = require("../models").Role;
const Adoption = require("../models").Adoption;
const Status = require("../models").Status;

  // GET USERS PROFILE
  router.get("/profile/:id", (req, res) => {
    User.findByPk(req.params.id,{
      include: [
        {
          model: Pet,
          where: {statusId:{[$ne]:[3]}},
          attributes: ["id","name","statusId"]
        },
        {
          model: Adoption,//Adopciones que yo solicite
          attributes: ["petId"]
        },
        {
          model: Role,
          attributes:["id"]
        }
      ]
    }).then((usrP) => {
      let myAdoptings=[];
      for(let i=0;i<usrP.Adoptions.length;i++) 
          myAdoptings.push(usrP.Adoptions[i].petId)

      let own=false;
      let adp=false;

        for(let i=0;i<usrP.Roles.length;i++)      
          if(usrP.Roles[i].id==1)
            own=true;

        for(let i=0;i<usrP.Roles.length;i++)      
          if((usrP.Roles[i].id==2)&&(myAdoptings.length>0))
             adp=true;   

        myAdoptings.length>0?true:myAdoptings.push(-1);
        Pet.findAll({where: {
                            id:{[$in]:[myAdoptings]},
                            statusId:{[$in]:[2,3]}},
                            attributes: ["id","name"]}).then(adpPets=>{
            console.log(adpPets)
             res.render("users/profile.ejs", {
              user: usrP,
              isOwner:own,
              adpingPets:adpPets,
              isAdopter:adp
        });
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
  