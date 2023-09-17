var express = require("express");
var router = express.Router();
var rf = require("../models").RegistrationForm;
var rfd = require("../models").RegistrationFormDetail;
var Shuttleschedule = require("../models").ShuttleSchedule;
const { Op } = require("sequelize");

//GET : Get Registration Datas by Schedule
router.get("/schedule", async (req, res) => {
  try {
    const scheduleID = parseInt(req.query.scheduleID, 10); // Convert to integer
    const useDate = req.query.useDate;
    const details = await rfd.findAll({
      where: {
        scheduleID: scheduleID,
      },
      include: [
        {
          model: rf,
          where: {
            useDate: {
              [Op.eq]: useDate,
            },
          },
        },
      ],
    });
    return res.status(200).json(details);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
});

//ADD : Add Registration
router.post("/add", async (req, res) => {
  try {
    const {
      binusianID,
      name,
      phoneNumber,
      email,
      purpose,
      useDate,
      status,
      scheduleID,
      scheduleID2,
    } = req.body;

    const registration = await rf.create({
      binusianID,
      name,
      phoneNumber,
      email,
      purpose,
      useDate,
      status,
    });
    const newRegistrationID = registration.RegistrationID;

    await rfd.create({
      scheduleID,
      registrationID: newRegistrationID,
    });
    await rfd.create({
      scheduleID: scheduleID2,
      registrationID: newRegistrationID,
    });
    res.status(201).json({
      registration,
      message: `New registration created with ID: ${newRegistrationID}`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE: Delete a registration by ID
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await rf.destroy({
      where: { RegistrationID: req.params.id },
    });
    if (deleted) {
      res.status(204).send("Registration deleted");
    } else {
      res.status(404).json({ error: "Registration not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ: Get a registration by ID
router.get("/:id", async (req, res) => {
  try {
    const registration = await rf.findByPk(req.params.id, {
      include: [
        {
          model: rfd,
          as: "details",
          include: [
            {
              model: Shuttleschedule,
              as: "schedulesDetails", // This should match the alias in the ShuttleSchedule model's associations.
            },
          ],
        },
      ],
    });
    if (registration) {
      res.json(registration);
    } else {
      res.status(404).json({ error: "Registration not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
