const { validationResult }= require('express-validator');

const otpGenerator = require('otp-generator')

const sendMail = require('../helpers/sendMail');
//const bcrypt = require('bcrypt');

const forgotPassword = (req,res) => {
    // const errors = validationResult(req);
    // if(!errors.isEmpty){
    //     return res.status(400).json({errors:errors.array})
    // }
  const { email } = req.body
  conn.query('SELECT * FROM users WHERE email = ? limit 1',email, function (error, result, fields){
    if(error){
        return res.status(400).json({ message:error })
    }else{
        console.log(result)
    if(result.length > 0){
        let mailSubject = 'forgot password';
       const randomStrig = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });

        let content = `<p> 
        Reset Password Otp : ${randomStrig}
        </p>`

        sendMail(email, mailSubject, content);
        conn.query(`INSERT INTO password_resets(email,token) VALUES(${conn.escape(result[0].email)}, '${randomStrig}')`)
        
        return res.status(200).send
        ({ message:"Mail sent successfullly" })
    }
    return res.status(401).send({
        message: "email does not exist"
    })
}
  })
}
//   const resetPasswordLoad = (req,res) => {
//     try {
//         var token = req.query.token;
//         if(token == undefined){
//             res.render('404');
//         }
//         conn.query('SELECT * FROM password_resets where token = ? limit 1', token, function(error, result){
//             if (error){
//                 console.log(error);
//             }
//             if(result.length > 0){
//                 conn.query('SELECT * FROM users where email=? limit 1', result[0].email, function(error, result, fields){
//                     if(error){
//                         console.log(error);  
//                 }
//                 res.render('reset-passsword',{
//                      user: result[0]
//                 });
//                })
//             }else{
//                 res.render('404')
//             }
//         });
//     } catch (error) {
//         console.log(error.message);
//     }
//   }
//    const resetPassword = (req,res) =>{
//       if(req.body.password != req.body.confirm_password){
//         res.render('reset-password', {error_message: 'Password not matching', user:{id:req.body.user_id, email:req.body.email}})
//       }
//         bcrypt.hash(req.body.confirm_password, 10, (err, hash)  =>{
//           if (err) {
//             console.log('Cannot encrypt');
//           }
//           conn.query(`DELET FROM password_resets where email = '${req.body.email}'`);
//           conn.query(`UPDATE users SET password ='${hash}' where id = '${req.body.id}'`);
//            res.render('message', {message:'password reset successfully!'})

    
//            })
//    }


module.exports = {
    forgotPassword
    // resetPasswordLoad,
    // resetPassword
};