const { check } = require('express-validator');

exports.forgetValidation = [
    check('email', 'Please enter valid mail')
    .isEmail().normalizeEmail({ gmail_remove_dots:true }),
]