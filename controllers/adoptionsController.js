const express = require("express");
const sequelize = require('sequelize');
const picture = require("../models/picture");
const SendEmail = require("../classes/sendEmail");
const e = require("express");
const router = express.Router();

$iLike = sequelize.Op.iLike;
$notIn = sequelize.Op.notIn;
$nE = sequelize.Op.ne;
$iN = sequelize.Op.in;
$oR = sequelize.Op.or;

const Pet = require("../models").Pet;
const Picture = require("../models").Picture;
const User = require("../models").User;
const Adoption = require("../models").Adoption;
const Status = require("../models").Status;

router.get("/", (req,res) =>{
    const own = (req.query.own!=""&&req.query.own!==undefined)?req.query.own:"";
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
    }).catch(err=>{
        console.log(err)
    });
});
router.get("/gallery", (req,res) =>{
    let location = req.query;
    location.own = (location.own!=""&&location.own!==undefined)?location.own:-1;
    let isMoreOne=false;
    if(location.country!=""&&location.state!=""&&location.city!=""){
            console.log('entra aqui 3')
        Pet.findAll({where: {
                            userId:{[$notIn]:[location.own]},
                            statusId:{[$notIn]:[2,3]},
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
                location.own=(location.own==-1)?"":location.own;
                console.log(isMoreOne)
                    res.render("adoptions/gallery.ejs",{pets:pets,location:location,isMore:isMoreOne});
        });
    } else if (location.country!=""&&location.state!=""&&location.city==""){
                console.log('entra aqui 2')
            Pet.findAll({where: {
                                userId:{[$notIn]:[location.own]},
                                statusId:{[$notIn]:[2,3]},
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
                    location.own=(location.own==-1)?"":location.own;
                    isMoreOne=pets.length>1?true:false;
                    console.log(isMoreOne)
                        res.render("adoptions/gallery.ejs",{pets:pets,location:location,isMore:isMoreOne});
            });
    }else if (location.country!=""&&location.state==""&&location.city==""){
                console.log('entra aqui 1')
        Pet.findAll({where: {
                            userId:{[$notIn]:[location.own]},
                            statusId:{[$notIn]:[2,3]},
                            country:{[$iLike]:location.country}},
                            include: [
                                {
                                model: Picture,
                                attributes: ["picture"],
                                },
                            ],
                            attributes: ["id","name", "country", "state","city"] 
            }).then((pets) =>{
                location.own=(location.own==-1)?"":location.own;
                isMoreOne=pets.length>1?true:false;
                console.log(isMoreOne)
                console.log(pets)
                    res.render("adoptions/gallery.ejs",{pets:pets,location:location,isMore:isMoreOne});
        });
    }else {
        console.log('entra aqui 4')
        console.log(location)
            Pet.findAll({where: {
                                userId:{[$notIn]:[location.own]},
                                statusId:{[$notIn]:[2,3]}},
                                include: [
                                {
                                    model: Picture,
                                    attributes: ["picture"],
                                },
                                ],
                                attributes: ["id","name", "country", "state","city"]
        }).then((pets) =>{
            location.own=(location.own==-1)?"":location.own;
            isMoreOne=pets.length>1?true:false;
            console.log(isMoreOne)
                res.render("adoptions/gallery.ejs",{pets:pets,location:location,isMore:isMoreOne});
            });
    }
});

router.get("/:id",(req,res)=>{
    Pet.findByPk(req.params.id,{//Pet info
        attributes: ["id","userId","name", "country", "state","city"]
    }).then((pet)=>{
        Picture.findByPk(req.query.pic).then((pic) =>{//Pet Picture
            User.findByPk(pet.userId,{ //Pet Owner info
                attributes: ["id","name","email","telephone"]
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
router.post("/",(req,res)=>{
   console.log(req.body)
   Adoption.create(req.body).then(newAdoption=>{
        Pet.update({statusId:"2"}, {where: {id: newAdoption.petId},returning: true}).then(() => {
            User.findByPk(req.body.adopterId,{attributes:["name","email","telephone"]}).then((adopter)=>{
                let mailExtras = {oName:req.body.poName,aName:adopter.name,aEmail:adopter.email,aTel:adopter.telephone,pName:req.body.petName}
                let email= new SendEmail("A",req.body.poEmail,adopter.email,req.body.message,mailExtras);
                email.send();
                res.redirect(`/users/profile/${req.body.adopterId}`);

            })
       });
    })
})
  router.put("/",async (req,res) => {
    let obj =req.body;
    let arrA =[];
    let arrR =[];
    let arrC=[];
    
    for(const prop in obj){
        if(obj[prop]=="A") 
            arrA.push(parseInt(prop))
        else if(obj[prop]=="R")
            arrR.push(parseInt(prop))
        else if (obj[prop]=="C")
            arrC.push(parseInt(prop))

    }

    console.log(arrA)
    console.log(arrR)
    console.log(arrC)

   if(arrA.length>0){
       for(let i=0;i<arrA.length;i++){
            const updAdoptedPet = await Pet.update({statusId:3},{where:{id:arrA[i]},returning: true})
            const updAdoptedStat = await Adoption.update({adoptionDate:new Date()},{where:{petId:arrA[i]},returning: true})
            const petData =  await Pet.findByPk(arrA[i],{attributes:["name"]});
            const ownerData =  await User.findByPk(req.body.oId,{attributes:["name","email","telephone"]});
            const adpId = await Adoption.findOne({where:{petId:arrA[i]},attributes:["adopterId"]}); 
            const adopterData =  await User.findByPk(adpId.adopterId,{attributes:["name","email","telephone"]});  
            let eBody = {oName:ownerData.name,oEmail:ownerData.email,oTel:ownerData.telephone,
                         aName:adopterData.name,aEmail:adopterData.email,aTel:adopterData.telephone,
                        pName:petData.name};
            let email = new SendEmail("AP",eBody.aEmail,eBody.oEmail,"",eBody);
            email.send();
       }
   }
   if(arrR.length>0){
        for(let i=0;i<arrR.length;i++){
            const updRejectPets = await Pet.update({statusId:1},{where:{id:arrR[i]},returning: true})
            const updRejectStat = await Adoption.update({rejectionDate:new Date()},{where:{petId:arrR[i]},returning: true})
            const petData =  await Pet.findByPk(arrR[i],{attributes:["name"]});
            const ownerData =  await User.findByPk(req.body.oId,{attributes:["name","email","telephone"]});
            const adpId = await Adoption.findOne({where:{petId:arrR[i]},attributes:["adopterId"]}); 
            const adopterData =  await User.findByPk(adpId.adopterId,{attributes:["name","email","telephone"]});  
            let eBody = {oName:ownerData.name,oEmail:ownerData.email,oTel:ownerData.telephone,
                         aName:adopterData.name,aEmail:adopterData.email,aTel:adopterData.telephone,
                        pName:petData.name};
            let email = new SendEmail("R",eBody.aEmail,eBody.oEmail,"",eBody);
            email.send();
        }
   }
   if(arrC.length>0){
        for(let i=0;i<arrC.length;i++){
            const updCancelPets = await Pet.update({statusId:1},{where:{id:arrC[i]},returning: true})
            const updCancelStat = await Adoption.update({cancelDate:new Date()},{where:{petId:arrC[i]},returning: true})
            const petData =  await Pet.findByPk(arrC[i],{attributes:["name"]});
            const ownerData =  await User.findByPk(req.body.oId,{attributes:["name","email","telephone"]});
            const adpId = await Adoption.findOne({where:{petId:arrC[i]},attributes:["adopterId"]}); 
            const adopterData =  await User.findByPk(adpId.adopterId,{attributes:["name","email","telephone"]});  
            let eBody = {oName:ownerData.name,oEmail:ownerData.email,oTel:ownerData.telephone,
                         aName:adopterData.name,aEmail:adopterData.email,aTel:adopterData.telephone,
                        pName:petData.name};
            let email = new SendEmail("C",eBody.aEmail,eBody.oEmail,"",eBody);
            email.send();

        }
   }
    let path = `/users/profile/${req.body.oId}`;
    res.redirect(path);
});

module.exports = router;
