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

//get schedules based on departing location
router.get("/get-by-origin", async function (req, res, next) {
    try {
        const { origin, day } = req.query;
        if (!origin || !day) {
            return res
                .status(400)
                .json({ error: "origin or day query parameter is required" });
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
router.get("/get-by-destination", async function (req, res, next) {
    try {
        const { destination, day } = req.query;
        if (!destination || !day ) {
            return res
                .status(400)
                .json({ error: "destination or day query parameter is required" });
        }
        const schedules = await Shuttleschedule.findAll({
            where: {
                destinationLocation : destination,
                day: day
            },
        });
        res.json(schedules);
    } catch (error) {
        next(error);
    }
});



module.exports = router;
