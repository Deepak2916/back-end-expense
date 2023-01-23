
const mongoose = require('mongoose')

const Schema=mongoose.Schema

const expenseSchema=new Schema({
    Amount:{
        type:Number,
        required:true,
    },
    Description:{
        type:String,
        required:true,
    },
    Category:{
        type:String,
        required:true,
    },
    createdAt:{
      type:Date,
      required:true
    }

})

const downloadedfiles=new Schema({
  fileUrl:{
      type:String,
      required:true
  },
  createdAt:{
      type:Date,
      required:true
  }

})

const userSchema= new Schema({
  name:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true,
    unique: true
  },
  number:{
    type:String,
    required:true,
    unique: true
    
    },
    password:{
        type:String,
        required:true
    },
    premiumUser:Boolean,
    expenses:[expenseSchema],
    downloadedFiles:[downloadedfiles]

})

userSchema.methods.delete=function(expenseId){

  const updatedExpenses=this.expenses.filter(expense=>{
    return expense._id.toString()!==expenseId.toString()
  })
  this.expenses=updatedExpenses
  return this.save()
}

module.exports=mongoose.model('User',userSchema)