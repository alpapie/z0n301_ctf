const express=require('express')
const router=express.Router()
const {get_users}=require("../controller/userController")

router.get("/users",get_users)

module.exports=router