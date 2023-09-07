var express = require('express');
var router = express.Router();
var Shuttleschedule = require('../models').ShuttleSchedule;


/* GET users listing. */
router.get('/', async function(req, res, next) {
    try {
      const schedules = await Shuttleschedule.findAll(); // Fetch all schedules
      res.json(schedules); // Send the schedules as a JSON response
    } catch (error) {
      next(error); // Pass any errors to the error handling middleware
    }
  });

module.exports = router;
