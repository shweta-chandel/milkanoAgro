const mysql = require("mysql");
const express = require("express");
require("dotenv").config();
const bodyparser = require("body-parser");
const app = express();
app.use(bodyparser.json());
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const userRoutes = require("./src/routes/userRoute")
const sendMail = require('./src/helpers/sendMail');
const otpGenerator = require('otp-generator')
app.use('/users', userRoutes);

const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "milkano_agro",
  multipleStatements: true,
});
conn.connect((err) => {
  if (err) throw err;
  console.log("Mysql Connected...");
});


app.post('/forget',(req,res)=>{
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
      conn.query(`UPDATE users SET OTP ='${randomStrig}' where email = '${req.body.email}'`);
      //conn.query(`UPDATE users OTP VALUES (${conn.escape(result[0].user_id)}, '${randomStrig}')`)
      
      return res.status(200).send
      ({ message:"Mail sent successfullly" })
  }
  return res.status(401).send({
      message: "email does not exist"
  })
}
})
})

app.post("/login", (req, res) => {
  console.log(req.body);
  const email = req.body.email;
  const password = req.body.password;
  const data = { email, password };
  conn.query(
    "SELECT * FROM users WHERE email = ? AND password = ?",
    [email, password],
    function (err, users) {
      if (users.length > 0) {
        console.log(users[0].user_id);
        const authtoken = jwt.sign(
          {
            user_id: users[0].user_id,
            role_id: users[0].role_id,
            email: users[0].email,
            permission: users[0].permission,
          },
          process.env.accessTokenSecret
        );
        conn.query(
          "UPDATE users set token = ? where email =?",
          [authtoken, email],
          (error, results) => {
            if (error) {
              res.status(500).json({ error: "not exist." });
            } else {
              const data = {
                user_id: users[0].user_id,
                role_id: users[0].role_id,
                email: users[0].email,
                permission: JSON.parse(users[0].permission),
                token: authtoken,
              };
              return res.send({
                message: "login successfully",
                data: data,
              });
            }
          }
        );
      }
    }
  );
});
app.listen(5000, () => console.log("server"));
