const signupContoller=require('../controllers/UserController')
const express=require('express')
const router=express.Router()

router.post('/signup',signupContoller.Postusers)
router.get('/login',signupContoller.GetLogin)
router.get('/',signupContoller.Getusers)






module.exports=router

