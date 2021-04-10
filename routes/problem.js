const express = require('express')
const router = express.Router();

const db = require('../models/index')
const {verifyToken} = require('../utils/jwt');
const child_process = require('child_process');

async function solving(language, code, problem_id, submit_id){ 
    const ext = [".cpp", ".java", ".py"];
    var dir = `./scoring/source/`
    var input = `./scoring/input/${problem_id}`
    var output = `./scoring/output/${submit_id}/`

    var cmd = "";
    cmd += `echo "${code}" > ${dir}${submit_id}${ext[language]}\n`
    cmd += `mkdir ${output}\n`
    if(language == 0){
        var tmp = `g++ ${dir}${submit_id}${ext[language]} -o ${submit_id} && ./${submit_id} `;

    }else if(language == 1){
        // var tmp = `javac ${dir}${submit_id}${ext[language]} -o ${submit_id} && java `
    }else if(language == 2){
        var tmp = `python3 ${dir}${submit_id}${ext[language]}`
        console.log(cmd)
        console.log(tmp)
    }
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
        // child_process.exec(cmds, function(err,stdout,stderr){
        //     if(err){
        //         console.log('child process exited with error code', err.code);
        //         return ;
        //     }else{
        //         console.log(stdout);
        //     }
        // })
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