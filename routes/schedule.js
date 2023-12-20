var express = require("express");
var router = express.Router();
var Shuttleschedule = require("../models").ShuttleSchedule;
var authenticateToken = require('../middleware/authJWT');
//get all schedules
router.get("/", async function (req, res, next) {
    try {
        const { day } = req.query;
        const schedules = await Shuttleschedule.findAll({
            where: {
                day: day
            },
        });
        res.json(schedules);
    } catch (error) {
        next(error);
    }
});

router.post('/add', authenticateToken, async (req, res) => {
    try {
        const { departingLocation, destinationLocation, departureTime, day } = req.body;
        const existingSchedule = await Shuttleschedule.findOne({
            where: {
                departingLocation,
                destinationLocation,
                departureTime,
                day
            }
        });
        if (existingSchedule) {
            return res.status(409).json({ error: 'A similar schedule already exists.' });
        }
        const newSchedule = await Shuttleschedule.create({
            departingLocation,
            destinationLocation,
            departureTime,
            day
        });
        res.status(201).json(newSchedule);
    } catch (error) {
        res.status(500).json(error.message);
    }
});

//get schedules
router.get("/get-schedule-data", async function (req, res, next) {
    try {
        const { origin, destination, day } = req.query;
        if (!origin || !destination || !day) {
            return res
                .status(400)
                .json({ error: "origin, destination, and day query parameters are required" });
        }
        const schedules = await Shuttleschedule.findAll({
            where: {
                departingLocation: origin,
                destinationLocation: destination,
                day: day
            },
        });
        res.json(schedules);
    } catch (error) {
        next(error);
    }
});

//get schedules
router.get("/get-schedule-by-origin", async function (req, res, next) {
    try {
        const { origin, day } = req.query;
        if (!origin || !day) {
            return res
                .status(400)
                .json({ error: "origin and day query parameters are required" });
        }
        const schedules = await Shuttleschedule.findAll({
            where: {
                departingLocation: origin,
                day: day
            },
        });
        res.json(schedules);
    } catch (error) {
        next(error);
    }
});




module.exports = router;
