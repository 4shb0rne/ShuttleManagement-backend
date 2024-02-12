var express = require('express');
var router = express.Router();
var grf = require('../models').GroupRegistrationForm;
var grfd = require('../models').GroupRegistrationFormDetail;
var registrationform = require('./individualRF');
var Shuttleschedule = require("../models").ShuttleSchedule;
const authenticateToken = require('../middleware/authJWT');
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
