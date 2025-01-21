const express = require('express')
const router = express.Router()
const {getUsers, authenticateUser}=require('../controllers/userController')
const {User}=require('../models/userModel')


router.get('/', getUsers)
// router.put('/authenticate',authenticateUser)

module.exports=router
