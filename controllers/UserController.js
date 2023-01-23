const signupModel=require('../models/UserModel')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
require('dotenv').config()
 
function geneterateToken(email){
    return jwt.sign({email:email},process.env.SECRETKEY)
}
const Postusers= async (req,res)=>{
    
       let {name,email,number,password}=req.body
  
    try{
    bcrypt.hash(password, 10,  async (err,hash)=>{ 

    // const User=await new signupModel({ name,email,number,password:hash,premiumUser:false})
    // User.save()
   
    await signupModel.create({ name,email,number,password:hash,premiumUser:false})

    res.status(200).json({
        message:'successfully created',
        success:true})
    })
    }
    catch(err){
        res.send(err)
        res.status(208).json({
            error:err.errors[0].message.split(" ")[0],
            success:false})
    }
}
const Getusers=async (req,res)=>{
    try{
    const users=await signupModel.find()
    res.json(users) 
    }
    catch(err){
        res.json(err)
    }
}
const GetLogin=async (req,res)=>{
    let email=req.query.email
    let password=req.query.password
    let login=await signupModel.find({email:email})
    let userExist=login[0]
   
    if(userExist){
        bcrypt.compare(password,userExist.password, (err,result)=>{
            if(result){
            
                res.status(200).json({
                    success:true,
                    message:'User login successful',
                    token:geneterateToken(userExist.email)
                })
            }
            else{
                res.status(401).json({
                    success:false,
                    message:'Password is not correct'
                })
            }
            if(err){
                res.status(500).json({
                    success:false,
                    message:'something went wrong'
                })
            }
        })
       
    }
    else{
        res.status(404).json({
            success:false,
            message:'User not found'
        })
    }
    
}



module.exports={Postusers,Getusers,GetLogin}