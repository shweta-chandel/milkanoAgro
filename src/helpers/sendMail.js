const nodemailer = require('nodemailer');
const {SMTP_MAIL, SMTP_PASSWORD} = process.env;

const sendMail = async(email, mailSubject, content) =>{
    try{
        var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: "243fd98bf0a69b",
              pass: "25b4e7959c58b4"
            }
          });
   
    var mailOptions = {
        from: '243fd98bf0a69b',
        to: email,
        subject: mailSubject,
        html: content
    };
 
    transport.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log('error',error)
        } else {
            console.log("mail sent successfully", info.response)
        }
    });

}catch (error){
  console.log(error.message)
}
}


module.exports = sendMail;