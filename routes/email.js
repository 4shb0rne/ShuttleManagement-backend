var express = require("express");
var router = express.Router();
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

router.post("/send", (req, res) => {
    let emailContent = `
    <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Email Confirmation</title>
        </head>
        <body style="font-family: Arial, sans-serif;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f7f7f7; border: 1px solid #ddd;">
                <div>
                    <img src="https://upload.wikimedia.org/wikipedia/id/a/a2/Logo_Binus_University.png" alt="Your Brand Logo" width="200" />
                </div>
                <div style="margin-top: 20px;">
                    <h2>Dear, ${req.body.name}</h2>
                    <p>Berikut adalah konfirmasi untuk reservasi shuttle pada tanggal <b>${req.body.date}</b> pukul ${req.body.time} dengan data penumpang sebagai berikut :</p>
                    <p>BinusianID : ${req.body.binusianID}</p>
                    <p>Nama       : ${req.body.name}</p>
                    <p>Urusan     : ${req.body.purpose}</p>
                    <p style="margin-top: 20px;">Best Regards,</p>
                    <p>Lecturer Service Center - Binus University</p>
                </div>
            </div>
        </body>
    </html>
        `;
    let mailOptions = {
        from: process.env.SMTP_EMAIL,
        to: req.body.to,
        subject: req.body.subject,
        html: emailContent
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
        res.status(500).send(error);
        } else {
        res.status(200).send("Email sent: " + info.response);
        }
    });
});

module.exports = router;
