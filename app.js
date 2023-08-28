const mysql = require("mysql");
const express = require("express");
require("dotenv").config();
const bodyparser = require("body-parser");
const app = express();
app.use(bodyparser.json());
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

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
