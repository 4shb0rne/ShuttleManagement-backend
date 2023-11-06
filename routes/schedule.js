var express = require("express");
var router = express.Router();
var Shuttleschedule = require("../models").ShuttleSchedule;
var authenticateToken = require('../middleware/authJWT');
//get all schedules
router.get("/", async function (req, res, next) {
    try {
        const schedules = await Shuttleschedule.findAll();
        res.json(schedules);
    } catch (error) {
        next(error);
    }
});

router.post('/add', authenticateToken, async (req, res) => {
    try {
        const { departingLocation, destinationLocation, departureTime } = req.body;
        const existingSchedule = await Shuttleschedule.findOne({
            where: {
                departingLocation,
                destinationLocation,
                departureTime
            }
        });
        if (existingSchedule) {
            return res.status(409).json({ error: 'A similar schedule already exists.' });
        }
        const newSchedule = await Shuttleschedule.create({
            departingLocation,
            destinationLocation,
            departureTime,
        });
        res.status(201).json(newSchedule);
    } catch (error) {
        res.status(500).json(error.message);
    }
});

  

//get schedules based on departing location
router.get("/get-by-origin", async function (req, res, next) {
    try {
        const { origin } = req.query;
        if (!origin) {
            return res
                .status(400)
                .json({ error: "origin query parameter is required" });
        }
        const schedules = await Shuttleschedule.findAll({
            where: {
                departingLocation: origin,
            },
        });
        res.json(schedules);
    } catch (error) {
        next(error);
    }
});
router.get("/get-by-destination", async function (req, res, next) {
    try {
        const { destination } = req.query;
        if (!destination) {
            return res
                .status(400)
                .json({ error: "destination query parameter is required" });
        }
        const schedules = await Shuttleschedule.findAll({
            where: {
                destinationLocation : destination
            },
        });
        res.json(schedules);
    } catch (error) {
        next(error);
    }
});



module.exports = router;
