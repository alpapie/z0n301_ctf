const express=require('express')
const router=express.Router()
const {login,register,updatePoints,dashboard,auth} = require("../controller/adminController")
const verifyToken=require("../middleware/auth.js")

router.post("/login",login)
router.post("/register",verifyToken,register)
router.post("/update",verifyToken,updatePoints)
router.get("/dasboard",verifyToken, dashboard)
router.get("/auth",verifyToken,auth)

module.exports=router