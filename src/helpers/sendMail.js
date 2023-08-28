const nodemailer = require('nodemailer');
const {SMTP_MAIL, SMTP_PASSWORD} = process.env;

const sendMail = async(email, mailSubject, content) =>{
    try{
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.email',
            port: 587,
            secure: false,
            require: true,
            auth: {
              user: SMTP_MAIL, // generated ethereal user
              pass: SMTP_PASSWORD // generated ethereal password
            }
    })
    var mailOptions = {
        from: 'SMTP_MAIL',
        to: email,
        subject: mailSubject,
        html: content
    };
 
    tranport.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(1)
        } else {
            console.log("mail sent successfully", info.response)
        }
    });
}catch (error){
  console.log(error.message)
}
}


module.exports = sendMail;