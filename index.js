const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");
const bodyParser = require("body-parser");

app.use(cors({
    origin: "http://localhost:3000"
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let users = [
    {email: "example@mail.com", password: "Password!"}
];

const totallySecretKey = "verySecureKeyToAllData";

app.post("/userdata", (req, res) => {
    if(req.body.userKey === totallySecretKey)
        fs.readFile('./contentData.json', 'utf8', function (err, data) {
            if (err) throw err;
            const obj = JSON.parse(data);
            res.send(obj);
        });
    else return res.status(400).send("please log in first");
});

app.post("/login", (req, res) => {
    console.log(req.body)
    if(req.body) {
        const {email, password} = req.body;
        const requestingUser = users.find(userData => userData.email === email);
        if(!requestingUser) return res.status(400).send("user not found");

        if(requestingUser.password === password) 
            return res.status(200).send({secretKey: totallySecretKey});
        else return res.status(400).send('wrong password');

    } else return res.status(400).send("bad request");
});

app.listen(5000, console.log("Server Running on http://localhost:5000"));