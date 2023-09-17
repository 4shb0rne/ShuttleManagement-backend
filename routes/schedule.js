var express = require("express");
var router = express.Router();
var Shuttleschedule = require("../models").ShuttleSchedule;

//get all schedules
router.get("/", async function (req, res, next) {
    try {
        const schedules = await Shuttleschedule.findAll();
        res.json(schedules);
    } catch (error) {
        next(error);
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
