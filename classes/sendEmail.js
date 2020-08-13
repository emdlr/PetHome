require('dotenv').config();
const nodemailer = require('nodemailer');
const express = require("express");
const sequelize = require('sequelize');
const { Connection } = require('pg');

const Message = require("../models").Message;

class SendEmail {
    constructor(mailType,to,cc,text,extra){
        this.from= process.env.EMAIL;
        this.fromPss= process.env.PASSWORD;
        this.to= to;
        this.cc = cc;
        this.mailType = mailType;
        this.text =text;
        this.extra = extra;
    }
    send (){
        let subj="";
        let msg="";
        switch (this.mailType){
            case "A": 
                Message.findAll({where:{
                                        msgCode:{[$in]:['C-0006','C-0002']}
                                        },
                                        attributes:["message"],
                                        order: ["msgCode"]}).then((sub =>{
                                    this.extra.aMsg=this.text;
                                    subj = sub[1].message;//Subject
                                    msg = this.repl(this.mailType,sub[0].message);//Message Body
                                    this.execute(subj,msg);
                }));
                break;
            case "R":
                Message.findAll({where:{
                                msgCode:{[$in]:['C-0008','C-0004']}
                                },
                                attributes:["message"],
                                order: ["msgCode"]}).then((sub =>{

                                subj = sub[1].message;//Subject
                                msg = this.repl(this.mailType,sub[0].message);//Message Body
                                this.execute(subj,msg);

                }));
                break;
            case "C":
                Message.findAll({where:{
                                msgCode:{[$in]:['C-0009','C-0005']}
                                },
                                attributes:["message"],
                                order: ["msgCode"]}).then((sub =>{
                                
                                subj = sub[1].message;//Subject
                                msg = this.repl(this.mailType,sub[0].message);//Message Body
                                this.execute(subj,msg);

                }));
                break;
            case "AP":
                Message.findAll({where:{
                                msgCode:{[$in]:['C-0007','C-0003']}
                                },
                                attributes:["message"],
                                order: ["msgCode"]}).then((sub =>{
                        subj = sub[1].message;//Subject
                        msg = this.repl(this.mailType,sub[0].message);//Message Body
                        this.execute(subj,msg);
 
                }));
                break;
            default:
                false; 
        }

    }
    execute (s,m){
        let transport =nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: this.from,
                pass: this.fromPss
            }
        });
        const message = {
            from: this.from,
            to: this.to,
            cc: this.cc,
            subject: s,
            html: m
        }
        transport.sendMail(message, function(err,info){
          err?console.log(err):console.log(info);  
        })
    }
    repl(type,msg){ //Replaces Extra object into Email Values
        let op=msg;
        let objet = this.extra
        let isAll = true;
        while(isAll){
            isAll=false;
            for(const prop in objet){
                op = op.replace(`[${prop}]`, objet[prop]);
                // Abajo lo comparo mayor que 1 por que no lo parte con nada ya
                (op.split(`[${prop}]`).length>1)?isAll=true:delete objet[prop]; 
            }
        }
        return op;
    }
}

module.exports = SendEmail;