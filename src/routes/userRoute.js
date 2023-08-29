const express = require("express");
const router = express.Router();
const { forgotPassword }  = require("../controller/userController")
const {  forgetValidation } =  require('../helpers/validation')

router.post('/forgotPassword', forgetValidation, forgotPassword)

module.exports = router;