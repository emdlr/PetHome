const express = require("express");
const sequelize = require('sequelize');
const picture = require("../models/picture");
const router = express.Router();
$iLike = sequelize.Op.iLike;

const Pet = require("../models").Pet;
const Picture = require("../models").Picture;
const User = require("../models").User;
const Adoption = require("../models").Adoption;

router.get("/", (req,res) =>{
    const own = (req.query.own!=""||req.query.own!=undefined)?req.query.own:"";
    console.log('Own Vale')
    console.log(own);
    Pet.findAll({attributes: ['country'],group: ['country']}).then((countries) =>{
        Pet.findAll({attributes: ['state'],group: ['state']}).then((states) =>{
            Pet.findAll({attributes: ['city'],group: ['city']}).then((cities) =>{
                res.render("adoptions/search.ejs",{
                    countries:countries,
                    states:states,
                    cities:cities,
                    own:own
                });
            });
        });
    });
});
router.get("/gallery", (req,res) =>{
    let location = req.query;
    let isMoreOne=false;
    if(location.country!=""&&location.state!=""&&location.city!=""){
            console.log('entra aqui 3')
        Pet.findAll({where: {
                            country:{[$iLike]:location.country},
                            state:{[$iLike]:location.state},
                            city:{[$iLike]:location.city}},
                            include: [
                                {
                                model: Picture,
                                attributes: ["picture"],
                                },
                            ],
                            attributes: ["id","name", "country", "state","city"] 
            }).then((pets) =>{
                console.log(pets)
                isMoreOne=pets.length>1?true:false;
                console.log(isMoreOne)
                    res.render("adoptions/gallery.ejs",{pets:pets,location:location,isMore:isMoreOne});
        });
    } else if (location.country!=""&&location.state!=""&&location.city==""){
                console.log('entra aqui 2')
            Pet.findAll({where: {
                                country:{[$iLike]:location.country},
                                state:{[$iLike]:location.state}},
                                include: [
                                    {
                                    model: Picture,
                                    attributes: ["picture"],
                                    },
                                ],
                                attributes: ["id","name", "country", "state","city"] 
                }).then((pets) =>{
                    console.log(pets)
                    isMoreOne=pets.length>1?true:false;
                    console.log(isMoreOne)
                        res.render("adoptions/gallery.ejs",{pets:pets,location:location,isMore:isMoreOne});
            });
    }else if (location.country!=""&&location.state==""&&location.city==""){
                console.log('entra aqui 1')
        Pet.findAll({where: {country:{[$iLike]:location.country}},
                            include: [
                                {
                                model: Picture,
                                attributes: ["picture"],
                                },
                            ],
                            attributes: ["id","name", "country", "state","city"] 
            }).then((pets) =>{
                console.log(pets)
                isMoreOne=pets.length>1?true:false;
                console.log(isMoreOne)
                    res.render("adoptions/gallery.ejs",{pets:pets,location:location,isMore:isMoreOne});
        });
    }else {
        console.log('entra aqui 4')
        console.log(location)
            Pet.findAll({
                include: [
                  {
                    model: Picture,
                    attributes: ["picture"],
                  },
                ],
                attributes: ["id","name", "country", "state","city"]
        }).then((pets) =>{
            isMoreOne=pets.length>1?true:false;
            console.log(isMoreOne)
                res.render("adoptions/gallery.ejs",{pets:pets,location:location,isMore:isMoreOne});
            });
    }
});

router.get("/:id",(req,res)=>{
    Pet.findByPk(req.params.id,{
        attributes: ["id","userId","name", "country", "state","city"]
    }).then((pet)=>{
        Picture.findByPk(req.query.pic).then((pic) =>{
            User.findByPk(pet.userId,{
                attributes: ["id","name","email"]
            }).then((current)=>{
                res.render("adoptions/adoption.ejs",{
                    pet:pet,
                    petowner:current,
                    pic:pic.picture,
                    adopterId:req.query.own
            })
        })
    })
  })
})
router.post("/new",(req,res)=>{
    console.log(req.body)
    Adoption.create(req.body).then(newAdoption=>{
        res.send('Animal en Proceso');
    })
  })
module.exports = router;
