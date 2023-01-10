const express=require('express')
const router=express.Router()
const {fileUpload,getResult,getResultStatus}=require('../controllers/studentController.js')

router.get('/test-me',(req,res)=>{
    return res.send('Namaste SimpliyFi')
})
router.post('/upload',fileUpload)
router.get('/students/:id/result',getResult)
router.get('/students',getResultStatus)

module.exports=router