var express = require("express");
var router = express.Router();
var SpecialDate = require("../models").SpecialDate;
var Shuttleschedule = require("../models").ShuttleSchedule;
const authenticateToken = require("../middleware/authJWT");
router.post('/add', authenticateToken, async (req, res) => {
    try {
        const { date, reason } = req.body;
        if (!date || !reason) {
            return res.status(400).send({ message: "Date and reason are required" });
        }

        // Check if a SpecialDate with the same date already exists
        const existingSpecialDate = await SpecialDate.findOne({ where: { date } });
        if (existingSpecialDate) {
            return res.status(200).send({ message: "A record with the same date already exists" });
        }

        // If not, create a new SpecialDate
        const newSpecialDate = await SpecialDate.create({ date, reason });
        return res.status(201).send(newSpecialDate);
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Internal Server Error" });
    }
});


router.get('/validate', async (req, res) => {
    try {
        const { date, origin } = req.query;
        const dateObj = new Date(date);

        if (isNaN(dateObj.getTime())) {
            return res.status(400).send({ message: "Invalid date format" });
        }

        const specialDate = await SpecialDate.findOne({ where: { date: date } });

        if (specialDate) {
            const schedules = await Shuttleschedule.findAll({
                where: {
                    departingLocation: origin,
                    date: date
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