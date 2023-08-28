const express = require("express");
const router = express.Router();

const {  forgetValidation } =  require('../helpers/validation')

router.post('/forgotPassword', forgetValidation, userController.forgotPassword)