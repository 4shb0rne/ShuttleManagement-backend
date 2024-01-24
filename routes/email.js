var express = require("express");
var router = express.Router();
const nodemailer = require("nodemailer");
const qrcode = require('qrcode');

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
    },
});


router.post("/send", async(req, res) => {
    const url = "http://"+process.env.WEB_URL+"/registrationdetail?registrationID="+req.body.form_id;
    //console.log(url);
    const qrCodeDataURL = await qrcode.toDataURL(url);
    // console.log(qrCodeDataURL);
    console.log(encodeURIComponent(url));
    try {
        let emailContent = `
        <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Email Confirmation</title>
            </head>
            <body style="font-family: Arial, sans-serif;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f7f7f7; border: 1px solid #ddd;">
                    <div style="margin-top: 20px;">
                        <h2>Dear, ${req.body.name}</h2>
                        <p>Berikut adalah konfirmasi untuk reservasi shuttle pada tanggal <b>${req.body.date}</b> pukul <b>${req.body.time1}</b> dan <b>${req.body.time2}</b> dengan data penumpang sebagai berikut :</p>
                        <p>BinusianID : ${req.body.binusianID}</p>
                        <p>Nama       : ${req.body.name}</p>
                        <p>Urusan     : ${req.body.purpose}</p>
                        <div>
                            <a href="${url}">Click Here to Verify</a>
                        </div>
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
            html: emailContent,
            attachDataUrls: true
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                res.status(500).send(error);
            } else {
                res.status(200).send("Email sent: " + info.response);
            }
        });
    } catch (error) {
        res.status(500).send('Error generating QR code');
    }
});

router.post("/sendGroup", (req, res) => {
    const binusianIDs = req.body.binusianID.split(",");
    const names = req.body.name.split(",");

    let tableRows = "";

    for (let i = 0; i < binusianIDs.length; i++) {
        tableRows += `
            <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">${i + 1}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${
                binusianIDs[i]
            }</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${names[i]}</td>
    </tr>
        `;
    }

    let emailContent = `
    <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Email Confirmation</title>
        </head>
        <body style="font-family: Arial, sans-serif;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f7f7f7; border: 1px solid #ddd;">
                <div style="margin-top: 20px;">
                    <h2>Dear, ${req.body.to}</h2>
                    <p>Berikut adalah konfirmasi untuk reservasi shuttle pada tanggal <b>${req.body.date}</b> pukul ${req.body.time1} dan pukul ${req.body.time2} dengan data penumpang sebagai berikut :</p>
                    <p>Urusan     : ${req.body.purpose}</p>
                    <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr>
                        <th style="border: 1px solid #ddd; padding: 8px;">No.</th>
                        <th style="border: 1px solid #ddd; padding: 8px;">BinusianID</th>
                        <th style="border: 1px solid #ddd; padding: 8px;">Nama</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
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
        html: emailContent,
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
