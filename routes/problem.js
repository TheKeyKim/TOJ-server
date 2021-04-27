const express = require('express')
const router = express.Router();

const db = require('../models/index')
const jwt = require('jsonwebtoken');
const {verifyToken} = require('../utils/jwt');

const child_process = require('child_process');
const { request } = require('http');

async function solving(language, code, problem_id, submit_id){ 
    const ext = [".cpp", ".java", ".py"];
    var dir = `./scoring/source/`
    var input = `./scoring/input/${problem_id}/`
    var output = `./scoring/output/${submit_id}/`
    var errlog = `./scoring/errlog/${submit_id}`

    var cmd = "";
    cmd += `echo "${code}" > ${dir}${submit_id}${ext[language]}\n`
    cmd += `mkdir ${output}\n`
    cmd += `mkdir ./scoring/result/${submit_id}\n`

    if(language == 0){
        cmd += `
        for var in {0..100}
        do 
            if [ ! -e ./scoring/input/${problem_id}/$var.txt ];then
                break
            else
                Start=$(date +%s)
                in=./scoring/input/${problem_id}/$var.txt
                out=./scoring/output/${submit_id}/$var.txt
                g++ ${dir}${submit_id}${ext[language]} -o ${dir}${submit_id} 2> ${errlog}.log && ./${dir}${submit_id} < $in > $out
                ./scoring/comparison ${problem_id} ${submit_id} $var > ./scoring/result/${submit_id}/$var.txt
                End=$(date +%s)
                echo "" >> ./scoring/result/${submit_id}/$var.txt
                echo $(($End-$Start)) >> ./scoring/result/${submit_id}/$var.txt
            fi
        done
        `
        console.log(cmd)
        //
    }else if(language == 1){
        // var tmp = `javac ${dir}${submit_id}${ext[language]} -o ${submit_id} && java `
    }else if(language == 2){
        cmd += `
        for var in {0..100}
        do 
            if [ ! -e ./scoring/input/${problem_id}/$var.txt ];then
                break
            else
                in=./scoring/input/${problem_id}/$var.txt
                out=./scoring/output/${submit_id}/$var.txt
                python3 ${dir}${submit_id}${ext[language]} < $in > $out
            fi
        done
        `
    }
    child_process.exec(cmd, function(err,stdout,stderr){
        if(err){
            console.log('child process exited with error code', err.code);
            return ;
        }else{
            console.log(stdout);
        }
    })
}

// get data POST
router.post('/submit', verifyToken, async (req, res) => {
    try{
        const data  = await db["user"].findOne({
            where : {
                id:req.decoded.id
            }
        })
        const {submit_id, language, code, problem_id} = req.body;
        solving(language, code, problem_id, submit_id);
        console.log(submit_id, language, code, problem_id)
        const result = await db["submit"].update({
            language, code
        },{
            where : {
                submit_id : submit_id
            }
        })

        return res.json({
            status:200
        })
    }catch(e){
        console.log(e);
        return res.json({status:"ERROR"});
    }
})

router.post('/submitid', verifyToken, async (req, res) => {
    try{
        // finding user_id from tokens
        var user_id  = await db["user"].findOne({
            where : {
                id:req.decoded.id
            }
        })
        user_id = user_id['id'];
        // finding Max submig_id in DB
        var submit_id = await db["submit"].findAll({
            attributes : [[db.Sequelize.fn('MAX', db.Sequelize.col('submit_id')), 'max']],
            raw : true
        });
        submit_id = submit_id[0]['max'] + 1;
        // finding problem_id from parmas
        const problem_id = req.body.problem_id;

        console.log(submit_id, problem_id, user_id);

        db["submit"].create({
            submit_id : submit_id,
            problem_id : problem_id,
            user_id : user_id,
            status : 0
        })

        return res.json({
            status:200,
            submit_id
        })
    }catch(e){
        console.log(e);
        return res.json({status:"ERROR"});
    }
})

router.get('/status/', verifyToken, async (req, res) => { 
    try{
        var user_id  = await db["user"].findOne({
            where : {
                id:req.decoded.id
            }
        })
        user_id = user_id.id;
        var data = await db["submit"].findAll({
            where : {
                user_id
            }
        })

        return res.json({
            status:200,
            data
        })

    }catch(e){
        console.log(e);
        return res.json({status:"ERROR"});
    }
})

module.exports = router