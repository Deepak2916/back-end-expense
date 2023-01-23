const jwt=require('jsonwebtoken')
const User=require('../models/UserModel')
require('dotenv').config()

const authenticate= async (req,res,next)=>{
    try{
      const token=req.header('authorization');
      // console.log("token----->",token)
      
      const user=jwt.verify(token,process.env.SECRETKEY)
        
      let expenseUser= await User.find({email:user.email})
      // console.log(expenseUser[0].id)
      req.user=expenseUser;
    //   console.log(req.user)
      next()
    }
    catch(err){
        console.log(err)
        res.status(401).json({success:false})
    }
}

module.exports={authenticate}