const express = require('express')
const router = express.Router();

const {hashPassword, comparePassword} = require('../utils/bcrypt')
const db = require('../models/index')
const jwt = require('jsonwebtoken');
const {verifyToken} = require('../utils/jwt');


// post solved problems
router.post("/", verifyToken, async (req, res) => {
    try{
        const {user_id, problem_id} = req.body;
        const result = await db["solved"].create({
            user_id: user_id,
            solved:problem_id
        })
        console.log(result);
        return res.json({status:"OK"});
    }catch(err){
        console.log(err);
        return res.json({status:"Error"})
    }
})

// get solved problems 
router.get("/", verifyToken, async (req, res) => {
    try{
        const id = req.decoded.id;
        const result = await db["solved"].findAll({
            where:{
                user_id:id
            }
        })
        let arr = []
        if(result){
            for(let i=0; i<result.length; i++){
                arr.push(result[i]["solved"])
            }
        }
        return res.json({
            status:"OK",
            solved : arr
        })
    }catch(err){
        console.log(err);
        return res.json({status:"Error"})
    }
})

module.exports = router