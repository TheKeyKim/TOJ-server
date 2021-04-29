const express = require('express')
const router = express.Router();

const db = require('../models/index')
const jwt = require('jsonwebtoken');
const {verifyToken} = require('../utils/jwt');

const child_process = require('child_process');
const { request } = require('http');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;


function readTextFile(file)
{
    try{
        var rawFile = new XMLHttpRequest();
        rawFile.open("GET", file, false);
        rawFile.onreadystatechange = function ()
        {   
            if(rawFile.readyState === 4)
            {
                if(rawFile.status === 200 || rawFile.status == 0)
                {
                    var allText = rawFile.responseText;
                }
            }
        }
        rawFile.send(null);
        if(rawFile.status === 0) return false;
        return rawFile.responseText;
    } catch(e){
        return false;
    }
}

async function update(problem_id, user_id){
    const data = await db["submit"].findAll({
        where : {
            status : 0,
            problem_id : problem_id,
            user_id : user_id
        }
    })
    for(let i=0; i<data.length; i++){
        const submit_id = data[i]['submit_id'];
        console.log(submit_id);
        var flag = true;
        for(let j=0; j<100; j++){
            var ret = await readTextFile(`file://${__dirname}/../scoring/result/${submit_id}/${j}.txt`);
            if(ret){
                ret = ret.split("\n");
                if(ret[0] != 2) {
                    flag = false;   
                    db["submit"].update({status:ret[0]}, {where:{submit_id}});
                    break;}
            }else {
                if(j == 0) flag = false
                break;
            }
        }
        if(flag) db["submit"].update({status:2}, {where:{submit_id}});
    }
}

async function solving(language, code, problem_id, submit_id){ 
    const ext = [".cpp", ".java", ".py"];
    var dir = `./scoring/source/`
    var input = `./scoring/input/${problem_id}/`
    var output = `./scoring/output/${submit_id}/`
    var errlog = `./scoring/errlog/${submit_id}`
    var runtimeerr = `./scoring/runtimeerr/${submit_id}`
    const time = "3s";

    var cmd = "";
    cmd += `echo "${code}" > ${dir}${submit_id}${ext[language]}\n`
    cmd += `mkdir ${output}\n`
    cmd += `mkdir ./scoring/result/${submit_id}\n`
    program = `timeout ${time} ./${dir}${submit_id}`;
    if(language == 0){
        cmd += `g++ ${dir}${submit_id}${ext[language]} -o ${dir}${submit_id} 2> ${errlog}.log`
        program = `./${dir}${submit_id}`;
    }else if(language == 1){
        // var tmp = `javac ${dir}${submit_id}${ext[language]} -o ${submit_id} && java `
    }else if(language == 2){
        program = `python3 ${dir}${submit_id}${ext[language]}`;
    }

    cmd += `
        for var in {0..100}
        do 
            if [ ! -e ./scoring/input/${problem_id}/$var.txt ];then
                break
            else
                Start=$(date +%s)
                in=./scoring/input/${problem_id}/$var.txt
                out=./scoring/output/${submit_id}/$var.txt
                timeout ${time} sh -c 'trap "" 11; ${program}' < $in 1> $out 2>> ${runtimeerr}.log
                t=$(echo $?)
                if [ $t == 124 ];then
                    echo "4" > ./scoring/result/${submit_id}/$var.txt
                    break
                fi
                ./scoring/comparison ${problem_id} ${submit_id} $var > ./scoring/result/${submit_id}/$var.txt
                End=$(date +%s)
                echo "" >> ./scoring/result/${submit_id}/$var.txt
                echo $(($End-$Start)) >> ./scoring/result/${submit_id}/$var.txt
            fi
        done
        `

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

router.get('/status/:id', verifyToken, async (req, res) => { 
    try{
        const problem_id = req.params.id;
        var user_id  = await db["user"].findOne({
            where : {
                id:req.decoded.id
            }
        })
        user_id = user_id.id;
        var data;
        update(problem_id, user_id);
        if(problem_id != 0)
            data = await db["submit"].findAll({
                where : {
                    user_id,
                    problem_id : problem_id,
                }
            })
        else 
            data = await db["submit"].findAll({
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