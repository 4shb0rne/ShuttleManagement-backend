var express = require('express');
var router = express.Router();
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587, 
    secure: false, 
    auth: {
        user: process.env.SMTP_EMAIL, 
        pass: process.env.SMTP_PASSWORD
    }
});

router.post('/send', (req, res) => {
    let mailOptions = {
        from: process.env.SMTP_EMAIL,
        to: req.body.to,
        subject: req.body.subject,
        text: req.body.text
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            res.status(500).send(error);
        } else {
            res.status(200).send('Email sent: ' + info.response);
        }
    });
});
