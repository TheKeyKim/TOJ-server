

const jwt = require('jsonwebtoken');
const verifyToken = (req, res, next) => {
    try{
        req.decoded = jwt.verify(req.headers.authorization, "thekey_judge");
        return next();
    }catch(e){
        return res.json({
            status : "Error"
        })
    }
}

module.exports = {verifyToken};