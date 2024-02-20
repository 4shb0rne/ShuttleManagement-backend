var express = require('express');
var router = express.Router();
var grf = require('../models').GroupRegistrationForm;
var grfd = require('../models').GroupRegistrationFormDetail;
var registrationform = require('./individualRF');
var Shuttleschedule = require("../models").ShuttleSchedule;
const authenticateToken = require('../middleware/authJWT');

const validateCapacity = async(groupRegistrationID) => {
    try {
      if (!groupRegistrationID) {
        return res.status(400).json({ error: 'registrationID query parameter is required.' });
      }
  
      // Query the database for scheduleIDs and useDate associated with the provided registrationID
      const registrationDetails = await grfd.findAll({
        where: { groupRegistrationID },
        attributes: ['scheduleID', 'groupRegistrationID'],
        include: [{
          model: grf,
          attributes: ['useDate'],
        }],
        raw: true,
      });
  
      if (registrationDetails.length === 0) {
        return res.status(404).json({ message: 'No schedules found for the provided registrationID.' });
      }
      
      // Fetch registrations count for each schedule on its useDate
      const canRegisterPromises = registrationDetails.map(async (detail) => {
        // Ensure we're accessing `useDate` correctly
        const useDate = detail['GroupRegistrationForm.useDate']; // Adjust this line if the path is incorrect
        if (!useDate) {
          console.error('useDate is undefined for detail:', detail);
          return { scheduleID: detail.scheduleID, canRegister: false }; // Handle the undefined useDate case
        }
      
        const count = await grfd.count({
          include: [{
            model: grf,
            where: { useDate },
            required: true
          }],
          where: { scheduleID: detail.scheduleID }
        });
        return { scheduleID: detail.scheduleID, canRegister: count < 25 };
      });
      
  
      const registrationCapacity = await Promise.all(canRegisterPromises);
  
      // Determine if any of the schedules allow for more registrations
      const canRegister = registrationCapacity.some(capacity => capacity.canRegister);
  
      return canRegister;
    } catch (error) {
      console.error('Failed to check registration capacity:', error);
      return false;
    }
};



// CREATE: Add a new group registration
router.post('/add', async (req, res) => {
    const {
        forms,
        phoneNumber,
        email,
        purpose,
        useDate,
        scheduleID,
        scheduleID2,
    } = req.body;

    try {
        const groupRegistration = await grf.create({
            email: email,
            phoneNumber: phoneNumber,
            purpose: purpose,
            forms: forms,
            useDate,
            status: "Not Verified"
        });
        const groupRegID = groupRegistration.dataValues.groupRegistrationID;
        await grfd.create({
            scheduleID,
            groupRegistrationID: groupRegID,
        });
        await grfd.create({
            scheduleID: scheduleID2,
            groupRegistrationID: groupRegID,
        });
        res.status(201).json(groupRegistration.dataValues);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/add-1-way", async (req, res) => {
    const {
        forms,
        phoneNumber,
        email,
        purpose,
        useDate,
        scheduleID
    } = req.body;

    try {
        const groupRegistration = await grf.create({
            email: email,
            phoneNumber: phoneNumber,
            purpose: purpose,
            forms: forms,
            useDate,
            status: "Not Verified"
        });
        const groupRegID = groupRegistration.dataValues.groupRegistrationID;
        await grfd.create({
            scheduleID,
            groupRegistrationID: groupRegID,
        });
        res.status(201).json(groupRegistration.dataValues);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// READ: Get a group registration by ID
router.get('/:id', async (req, res) => {
    try {
        const groupRegistration = await grf.findByPk(req.params.id, {
            include: [
                {
                    model: grfd,
                    as: "details",
                    include: [
                        {
                            model: Shuttleschedule,
                            as: "SchedulesDetails", // This should match the alias in the ShuttleSchedule model's associations.
                        },
                    ],
                },
            ],
        });
        if (groupRegistration) {
            res.json(groupRegistration);
        } else {
            res.status(404).json({ error: 'Group Registration not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE: Delete a group registration by ID
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await grf.destroy({
            where: { groupRegistrationID: req.params.id }
        });
        if (deleted) {
            res.status(204).send("Group Registration deleted");
        } else {
            res.status(404).json({ error: 'Group Registration not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
