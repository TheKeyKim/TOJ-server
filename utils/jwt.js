

const jwt = require('jsonwebtoken');
const verifyToken = (req, res, next) => {
    try{
        req.decoded = jwt.verify(req.headers.authorization, "thekey_judge");
        console.log(req.decoded);
        return next();
    }catch(e){
        return res.json({
            status : "Error"
        })
    }
}

module.exports = {verifyToken};