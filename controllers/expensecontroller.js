
const User=require('../models/UserModel')
const Razorpay = require('razorpay');
const S3Service=require('../services/S3Service');

require('dotenv').config()


const addExpense=async (req,res)=>{
   

    let info={
        Amount:req.body.Amount,
        Description:req.body.Description,
        Category:req.body.Category,
        createdAt:new Date()
       
    }
  
    try{
        req.user[0].expenses.push(info)
        await req.user[0].save()
        res.status(200).json(req.user[0])
    }
    catch(err){
       console.log(err) 
    }   
}
const getAllExpenses=async (req,res)=>{
    try{
        let pageNumber=+req.query.page
        let size=+req.query.size
        let total=req.user[0].expenses.length
       
        let pages=Math.ceil(total/size)
       let page;
     
        if(pageNumber>0){
            page=pageNumber
        }
        else{
            page=pages
        }
       
        const user=await User.find({_id:req.user[0]._id})  
       
    let currentPage=(page-1)*size
    let currentSize=currentPage+size
   
    let userExpenses;
    let flag=req.query.daytoday
   
    if(flag=='true'){
        userExpenses=user[0].expenses
    }
    else{
     userExpenses=user[0].expenses.slice(currentPage,currentSize)
    }
  
        res.status(200).json({
           expenses: userExpenses,
           premium:user[0].premiumUser,
           pages:pages,
           user:req.user[0]
        })
    }
    catch(err){
        console.log(err)
    }
}

const getOneUserExpenses=async (req,res)=>{
    try{
         let id=req.query.id
        const user=await User.find({_id:id})
        const userExpenses=user[0].expenses
        res.status(200).json(userExpenses)
    }
    catch(err){
        console.log(err)
    }
   
    
}
const deleteExpense=async (req,res)=>{
    try{
        let id=req.query.id
       await req.user[0].delete(id)
        res.status(200).send('expense deleted')
    }
    catch(err){
        console.log(err)
    }
}

var instance = new Razorpay({ key_id:process.env.RAZOR_KEY_ID, key_secret:process.env.RAZOR_KEY_SECRET})

const orderPremiumAccount = async (req,res)=>{
    const {amount,currency,receipt, notes}  = req.body
 await instance.orders.create({amount,currency,receipt, notes}, function(err, order) {
  if(!err){
    res.json(order)
  }
  else{
    res.json(err)
  }
});
}

const leaderBord=async (req,res)=>{
    try{
    let Allusers=await User.find()
    let arr=[]
    
    for(let user of Allusers){
        let total=0
        let expenses=user.expenses
        expenses.forEach((expense)=>{
            if(expense.Amount>0)
            total+=expense.Amount
        })
        arr.push([user.name,total,user._id,user.premiumUser])
    }
    arr.sort((a,b)=>b[1]-a[1])
   
    res.json({
        users:arr})
    }
    catch(err){
        console.log(err)
       
    }

}
const GetPremiumAccount=async (req,res)=>{
    try{
    // req.user[0].premiumUser=true
    // await req.user[0].save()
   await User.updateOne({_id:req.user[0]},{$set:{premiumUser:true}})
   res.status(200).json({
    success:true
   })
    }
    catch(err){
        console.log(err)
    }
}

// downloading expenses


const DownloadExpenses=async (req,res)=>{
  
    const expenses=req.user[0].expenses
   
    const stringifyexpenses=JSON.stringify(expenses)
    const filename=`Expense/${req.user[0]._id}/${new Date()}.txt`;
    const fileUrl= await S3Service.uploadToS3(stringifyexpenses,filename)
    let info={
        fileUrl:fileUrl,
        createdAt:new Date()
    }
    let user=await User.find({email:req.user[0].email})
        user[0].downloadedFiles.push(info)
      
        await user[0].save()
        res.status(200).json({
            success:true,
            fileUrl:fileUrl
        })

}

const GetFileUrls= (req,res)=>{
    res.json({
        fileUrl:req.user[0].downloadedFiles
    })

}
module.exports={addExpense,getAllExpenses,deleteExpense,orderPremiumAccount,leaderBord,getOneUserExpenses,DownloadExpenses,GetPremiumAccount,GetFileUrls}