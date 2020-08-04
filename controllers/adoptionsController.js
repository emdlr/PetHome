const express = require("express");
const sequelize = require('sequelize');
const picture = require("../models/picture");
const router = express.Router();
$iLike = sequelize.Op.iLike;
const Pet = require("../models").Pet;
const Picture = require("../models").Picture;

router.get("/", (req,res) =>{
    Pet.findAll({attributes: ['country'],group: ['country']}).then((countries) =>{
        Pet.findAll({attributes: ['state'],group: ['state']}).then((states) =>{
            Pet.findAll({attributes: ['city'],group: ['city']}).then((cities) =>{
                res.render("adoptions/search.ejs",{
                    countries:countries,
                    states:states,
                    cities:cities
                });
            });
        });
    });
});
router.get("/gallery", (req,res) =>{
    let location = req.query;
    if((location.country!=""&&location.country!=undefined)&&
        (location.state!=""&&location.state!=undefined)&&
        (location.city!=""&&location.city!=undefined)){
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
                    res.render("adoptions/gallery.ejs",{pets:pets,location:location});
        });
    } else if ((location.country!=""&&location.country!=undefined)&&
             (location.state!=""&&location.state!=undefined)&&
             (location.city==""||location.city==undefined)){
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
                        res.render("adoptions/gallery.ejs",{pets:pets,location:location});
            });
    }else if ((location.country!=""&&location.country!=undefined)&&
            (location.state==""&&location.state==undefined)&&
            (location.city==""||location.city==undefined)){
        Pet.findAll({where: {country:{[$iLike]:location.country}},
                            include: [
                                {
                                model: Picture,
                                attributes: ["picture"],
                                },
                            ],
                            attributes: ["id","name", "country", "state","city"] 
            }).then((pets) =>{
                    res.render("adoptions/gallery.ejs",{pets:pets,location:location});
        });
    }else {
            Pet.findAll({
                include: [
                  {
                    model: Picture,
                    attributes: ["picture"],
                  },
                ],
                attributes: ["id","name", "country", "state","city"]
        }).then((pets) =>{
                res.render("adoptions/gallery.ejs",{pets:pets,location:location});
            });
    }
});


module.exports = router;
