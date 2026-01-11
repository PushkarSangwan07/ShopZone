const express = require('express')
const {signup,login} = require('../controller/Authcontroller')
const {signupvalidation,loginvalidation} = require('../middleware/validate')

const router = express.Router()

router.post('/signup',signupvalidation,signup)
router.post('/login',loginvalidation,login)

module.exports=router