var express = require("express");
var router = express.Router();
var SpecialDate = require("../models").SpecialDate;
var Shuttleschedule = require("../models").ShuttleSchedule;

app.post('/add', async (req, res) => {
    try {
        const { date, reason } = req.body;
        if (!date || !reason) {
            return res.status(400).send({ message: "Date and reason are required" });
        }

        const newSpecialDate = await SpecialDate.create({ date, reason });
        return res.status(201).send(newSpecialDate);
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Internal Server Error" });
    }
});

app.get('/validate', async (req, res) => {
    try {
        const { date } = req.query;
        const dateObj = new Date(date);

        if (isNaN(dateObj.getTime())) {
            return res.status(400).send({ message: "Invalid date format" });
        }

        const specialDate = await SpecialDate.findOne({ where: { date: dateObj } });

        if (specialDate) {
            const schedules = await Shuttleschedule.findAll({
                where: {
                    date: specialDate
                },
            });
            return res.status(200).send({ exists: true, specialDate, schedules });
        } else {
            return res.status(200).send({ exists: false });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;