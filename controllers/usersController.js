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
const UserRoles = require("../models").Status;

  // GET USERS PROFILE
  router.get("/profile/:id", (req, res) => {
    User.findByPk(req.params.id,{
      include: [
        {
          model: Role,
          attributes:["id"]
        }
      ]
    }).then((usrP) => {
      let myAdoptings=[];
      let canCreate=false;
      if(usrP.Roles.length==0){
        res.send('NO ROLE ASSIGNED')
      }
      let isAdopter=false;
      let isOwner=false;
      for(let i=0;i<usrP.Roles.length;i++){
          if(usrP.Roles[i].id==1){
              isOwner=true;
              canCreate=true;
          }
          if(usrP.Roles[i].id==2){
              isAdopter=true;
          }
      }//Fin del For
      let forEpets=[];
        Pet.findAll({where: {//My Created Pets
                        userId:usrP.id,
                        statusId:{[$in]:[1,2]}},
                        attributes: ["id","name","statusId"]}).then(oPets=>{
              if(oPets.length<=0){
                  isOwner=false;//Vuelvo false la variable para que no despliegue si no 
              }

              Adoption.findAll({where:{//are you also adopter?
                                  adopterId:usrP.id},
                                  attributes:["id","petId","adopterId"]}).then(adpS=>{//Checo mis solicitudes

                  if(adpS.length<=0){
                    isAdopter=false;//Vuelvo false la variable para que no despliegue si no 
                      
                    res.render("users/profile.ejs", {
                                        user: usrP,
                                        oPets:oPets,
                                        canCreate:canCreate,
                                        isOwner:isOwner,
                                        adpingPets:forEpets,
                                        isAdopter:isAdopter
                      });
                  }else{

                      adpS.forEach(element => {
                          forEpets.push(element.petId);
                      });
                      console.log(forEpets)
                      Pet.findAll({where:{id:{[$in]:forEpets}}}).then(adpPets=>{

                                  res.render("users/profile.ejs", {
                                    user: usrP,
                                    canCreate:canCreate,
                                    oPets:oPets,
                                    isOwner:isOwner,
                                    adpingPets:adpPets,
                                    isAdopter:isAdopter
                                  });

                      })
                  }
              })
        });
    });
  });
  
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
  