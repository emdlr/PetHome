const express = require("express");
const router = express.Router();

const Pet = require("../models").Pet;
const User = require('../models').User;//Bringing object to make joins with this model
const Status = require('../models').Status;
const Picture = require('../models').Picture;

// INDEX ROUTE
router.get("/", (req, res) => {
    res.render("index.ejs")
  });

router.get("/new/:id",(req,res) =>{
  User.findByPk(req.params.id).then(user =>{
    res.render('pets/signup.ejs',{user:user})
  });
});
router.get("/profile/:id",(req,res) =>{
  let showAdopt="Y";
  console.log(req.params)
  Pet.findByPk(req.params.id).then((pet)=>{
    Picture.findOne({where:{ownerId:pet.userId,petId:pet.id}}).then((pic)=>{
      const usr = (req.query.own!=""&&req.query.own!==undefined)?req.query.own:"";

      if(pet.userId==usr)
          showAdopt="N";

      if(usr==""||pet.statusId!=1) 
         res.render('pets/viewprofile.ejs',{pet:pet,pic:pic,own:usr,showAdopt:"N"});
      else
         res.render('pets/profile.ejs',{pet:pet,pic:pic,showAdopt:showAdopt,own:usr});

    });
  });
});
router.post("/new", (req,res) =>{
    Pet.create(req.body).then((newPet)=>{
      req.body.petId =newPet.id;
      Picture.create(req.body).then((newPic)=>{
        res.redirect(`/pets/profile/${newPet.id}?own=${req.body.userId}`);
      })
    }) 
})
router.put("/profile/:id", (req, res) => {
  Pet.update(req.body, {where: {id: req.params.id },returning: true}).then((updPet) => {
        const own = updPet[1][0].userId;    
        res.redirect(`/pets/profile/${req.params.id}?own=${own}`);
  });
});
router.delete("/:id", (req, res) => {
  Pet.findByPk(req.params.id).then((petToDelete)=>{
    const userId = petToDelete.userId;
    Pet.destroy({ where: { id:req.params.id } }).then(() => {
      console.log(userId)
      res.redirect(`/users/profile/${userId}`);
    });
  });
});

module.exports = router;

