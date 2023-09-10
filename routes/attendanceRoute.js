var express = require('express');
var router = express.Router();
var attendance = require('../models').Attendance;


//get one attendance from registrationID
router.get('/:id', async function(req, res, next) {
    try {
      const attendances = await attendance.findAll({
        where: { RegistrationID: req.params.id },
      });
      res.json(attendances); 
    } catch (error) {
      next(error);
    }
});

module.exports = router;
