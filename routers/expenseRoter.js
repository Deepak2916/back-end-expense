const expensecontroller=require('../controllers/expensecontroller.js')
const userAuthenticate=require('../middleware/authenticate')

const router=require('express').Router()
router.get('/oneUser',expensecontroller.getOneUserExpenses)
router.delete('/delete',userAuthenticate.authenticate,expensecontroller.deleteExpense)
router.post('/',userAuthenticate.authenticate,expensecontroller.addExpense)
router.get('/',userAuthenticate.authenticate, expensecontroller.getAllExpenses)
router.post('/payment',expensecontroller.orderPremiumAccount)
router.get('/leaderbord',expensecontroller.leaderBord)
router.get('/download',userAuthenticate.authenticate,expensecontroller.DownloadExpenses)
router.get('/add',userAuthenticate.authenticate,expensecontroller.GetPremiumAccount)
router.get('/fileUrls',userAuthenticate.authenticate,expensecontroller.GetFileUrls)

module.exports=router