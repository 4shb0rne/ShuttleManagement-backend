var express = require('express');
var router = express.Router();
var Shuttleschedule = require('../models').ShuttleSchedule;


//get all schedules
router.get('/', async function(req, res, next) {
    try {
      const schedules = await Shuttleschedule.findAll(); 
      res.json(schedules); 
    } catch (error) {
      next(error);
    }
});


module.exports = router;
