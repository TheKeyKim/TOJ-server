const express = require('express')
const router = express.Router();

const db = require('../models/index')
const {verifyToken} = require('../utils/jwt');
const child_process = require('child_process');

async function solving(language, code, problem_id, submit_id){ 
    const ext = [".cpp", ".java", ".py"];
    var dir = `./scoring/source/`
    var input = `./scoring/input/${problem_id}/`
    var output = `./scoring/output/${submit_id}/`

    var cmd = "";
    cmd += `echo "${code}" > ${dir}${submit_id}${ext[language]}\n`
    cmd += `mkdir ${output}\n`
    console.log(code);
    if(language == 0){
        cmd += `
        for var in {0..100}
        do 
            if [ ! -e ./scoring/input/${problem_id}/$var.txt ];then
                break
            else
                in=./scoring/input/${problem_id}/$var.txt
                out=./scoring/output/${submit_id}/$var.txt
                g++ ${dir}${submit_id}${ext[language]} -o ${dir}${submit_id} && ./${dir}${submit_id} < $in > $out
            fi
        done
        `

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
        var dir = "./scoring/source/"
        var input = "./scoring/input/"
        var output = "./scoring/output/"
        const data  = await db["user"].findOne({
            where : {
                id:req.decoded.id
            }
        })

        const {language, code, id, problem_id} = req.body;
        console.log(language);
        solving(language, code, problem_id, id);

        var cmd = "echo \"" + code + "\" > " + dir + String(req.body.id) + ".py";
        var cmds = `
            echo "${code}" > ${dir+req.body.id}.py
            python3 ${dir+req.body.id}.py < ${input}${req.body.problem_id}/0.txt > ${output}${req.body.problem_id}/0.txt
        `
        // console.log(cmds);

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