const jwt = require('jsonwebtoken')
const User = require('../schema/userSchema')
// const cookies = require('cookie-parser')
const authofuser = async(req,res,next)=>{
   try {
    const token = req.cookies.jwttoken;
    const verifytoken = jwt.verify(token, process.env.SECRET_KEY)
    const rootUser = await User.findOne({_id:verifytoken._id, "tokens.token": token });
    if(!rootUser){
        res.status(401).json({error:"unauthorized:no token provided"});
        console.log("user not found");
        // throw new Error('User not Found')
        
    }
    else{
        req.rootUser = rootUser;
        req.token = token;
        req.userID = rootUser._id;
      
    }
    next();
}catch(err){
    res.status(401).json({error:"unauthorized:no token provided"});
}
}
module.exports = authofuser;