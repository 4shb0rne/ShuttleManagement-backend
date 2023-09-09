var express = require("express");
var router = express.Router();
var rf = require("../models").RegistrationForm;
var rfd = require('../models').RegistrationFormDetail

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
        scheduleID
      } = req.body;
  
      const registration = await rf.create({
        binusianID,
        name,
        phoneNumber,
        email,
        purpose,
        useDate,
        status
      });
      const newRegistrationID = registration.RegistrationID;
      rfd.create({
        scheduleID,
        newRegistrationID
      });
      res.status(201).json({
        registration,
        message: `New registration created with ID: ${newRegistrationID}`
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//GET : Get Registration Data by Schedule
router.get("/schedule/:id", async (req, res) => {
  try {
    const scheduleID = req.params.id;

    const details = await RegistrationFormDetail.findAll({
      where: {
        scheduleID: scheduleID,
      },
    });

    return res.status(200).json(details);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
});

// READ: Get a registration by ID
router.get("/:id", async (req, res) => {
  try {
    const registration = await rf.findByPk(req.params.id);
    if (registration) {
      res.json(registration);
    } else {
      res.status(404).json({ error: "Registration not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE: Update a registration by ID
router.put("/:id", async (req, res) => {
  try {
    const [updated] = await rf.update(req.body, {
      where: { RegistrationID: req.params.id },
    });
    if (updated) {
      const updatedRegistration = await rf.findByPk(req.params.id);
      res.json(updatedRegistration);
    } else {
      res.status(404).json({ error: "Registration not found" });
    }
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

module.exports = router;
