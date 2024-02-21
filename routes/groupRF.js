var express = require('express');
var router = express.Router();
var grf = require('../models').GroupRegistrationForm;
var grfd = require('../models').GroupRegistrationFormDetail;
var rf = require("../models").RegistrationForm;
var rfd = require("../models").RegistrationFormDetail;
var registrationform = require('./individualRF');
var Shuttleschedule = require("../models").ShuttleSchedule;
const { User, Sequelize } = require("../models");
const authenticateToken = require('../middleware/authJWT');

const validateCapacity = async(scheduleID, useDate, Capacity) => {
    try {
        // 1. Get the ShuttleSchedule and the count of related registrations
        const schedule = await Shuttleschedule.findByPk(scheduleID, {
          include: {
            model: rfd,
            as: "schedulesDetails", 
            required: true, // Ensure only schedules with registrations are considered
            include: {
              model: rf, // Include the parent RegistrationForm
              where: {
                useDate: useDate, 
              },
            },
          },
          attributes: { 
            include: [[Sequelize.fn('COUNT', Sequelize.col('schedulesDetails.registrationID')), 'registrationCount']] 
          },
        });
        
        // 2. Check if registration count exceeds capacity
        if (schedule && schedule.getDataValue('registrationCount') + Capacity > 25) {
          return {
            schedule,
            status: false
          };
        }
    
        return {
            schedule,
            status: true
        };
      } catch (error) {
        console.error("Error in validateCapacity:", error);
        throw error; 
      }
};

router.get("/validate", async (req, res) => {
    const { scheduleID, useDate, Capacity} = req.query;
    try {
        const result = await validateCapacity(scheduleID, useDate, Capacity);
        res.status(200).json(result);   
    } catch(error) {
        res.status(500).json({error : error.message});
    }
});


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
