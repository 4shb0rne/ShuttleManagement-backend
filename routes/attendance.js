var express = require("express");
var router = express.Router();
var rf = require("../models").RegistrationForm;
var rfd = require("../models").RegistrationFormDetail;
var Shuttleschedule = require("../models").ShuttleSchedule;

// UPDATE: Change status to Present
router.put("/attend", async (req, res) => {
    const registrationId = req.query.id;

    if (!registrationId) {
        return res.status(400).json({ success: false, message: "ID is required" });
    }

    try {
        const updatedRows = await rf.update(
            { status: "Present" },
            { where: { RegistrationID: registrationId } }
        );

        if (updatedRows[0] === 0) {
            return res.status(404).json({ success: false, message: "Registration Form not found" });
        }

        res.status(201).json({ success: true, message: "Status updated successfully" });

    } catch (error) {
        console.error("Error updating status:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
  

//get attendees data schedules
router.get("/get", async (req, res) => {
  try {
    const scheduleID = req.query.scheduleID;
    const useDate = new Date(req.query.useDate); // Convert string date to a Date object

    // Find all registration forms associated with a given scheduleID and useDate
    const registrations = await rf.findAll({
      where: {
        useDate: useDate,
        status: "Absent"
      },
      include: [
        {
          model: rfd,
          as: "details",
          where: { scheduleID: scheduleID },
          include: {
            model: Shuttleschedule,
            as: "schedulesDetails",
          },
        },
      ],
    });

    res.json({ success: true, data: registrations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});


module.exports = router;
