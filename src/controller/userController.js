const { validationResult }= require('express-validator');

const randomstrig = require('randomstring');
const sendMail = require('../helpers/sendMail');


const forgotPassword = (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty){
        return res.status(400).json({errors:errors.array})
    }
}
  var email = req.email;
  conn.query('SELECT * FROM users WHERE email = ? limit 1',email, function (error, result, fields){
    if(error){
        return res.status(400).json({ message:error })
    }
    if(result.length > 0){
        let mailSubject = 'forgot password';
        const randomStrig = randomstrig.generate();
        let content = '<p>You requested for reset password, kindly use this <a href="http://localhost:5000/reset-password?token=' + token + '">link</a> to reset your password</p>'

        sendMail(email, mailSubject, content);
        conn.query(`INSERT INTO password_resets(email,token) VALUES(${conn.escape(result[0].email)}, '${randomStrig}')`)
        
        return res.status(200).send
        ({ message:"Mail sent successfullly" })

    }
    return res.status(401).send({
        message: "email does not exist"
    })
  })




module.exports = {
    forgotPassword
};