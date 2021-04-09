const bcrypt = require('bcrypt');
const saltRounds = 10;

const hashPassword = async(password) => {
    try{
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch(e){
        console.log(e);
        return new Error(e);
    }
}

const comparePassword = async(password, hashedPassword) => {
    try{
        return await bcrypt.compare(password, hashedPassword);
    }catch(e){
        console.log(e);
        return new Error(e);
    }
}

module.exports = {hashPassword, comparePassword};