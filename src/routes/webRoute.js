const express = require("express");
const user_route = express();
user_route.set('view engine','ejs');
user_route.set('views','./views');
user_route.use(express.statc('public'))

const userController = require('../controller/userController');
user_route.get('/reset-password', userController.resetPasswordLoad);
module.exports = user_route;