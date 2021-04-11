const express = require('express')
const router = express.Router();

const {hashPassword, comparePassword} = require('../utils/bcrypt')
const db = require('../models/index')
const jwt = require('jsonwebtoken');
const {verifyToken} = require('../utils/jwt');


// signin   POST
router.post('/signin', async (req, res) => {
    try{
        console.log(req.body);
        const {name,email,password,login_id} = req.body;
        const hashedPassword = await hashPassword(password);
        const result = await db["user"].create({
            name : name,
            email,
            password: hashedPassword,
            login_id
        })
        console.log(result);
        return res.json({status:"OK"});
    }catch(e){
        console.log(e);
        return res.json({status:"ERROR"});
    }
})

// login    POST
router.post('/login', async (req, res) => {
    try{
        console.log(req.body);
        const {login_id, password} = req.body;
        const result = await db["user"].findOne({
            where  : {
                login_id : login_id
            }
        });
        console.log(result);
        if(comparePassword(password, result.dataValues.password)){
            const token = jwt.sign({
                id : result['id']
            }, "thekey_judge", {
                expiresIn:"6h"
            })
            return res.json({
                status : "OK",
                token : token,
                id : result['id'],
                name : result['name']
            })
        }
        else{
            return res.json({
                status : "Password Error"
            })
        }
    }catch(e){
        console.log(e);
        return res.json({status:"ERROR"});
    }
})

// get data POST
router.get('/', verifyToken, async (req, res) => {
    try{
        console.log(req.decoded.id);
        const data  = await db["user"].findOne({
            where : {
                id:req.decoded.id
            }
        })
        console.log(data);
        return res.json({
            status:200,
            name:data["name"],
            email:data["email"],
            id:data["login_id"]
        })
    }catch(e){
        console.log(e);
        return res.json({status:"ERROR"});
    }
})

module.exports = router