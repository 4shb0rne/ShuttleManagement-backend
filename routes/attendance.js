var express = require("express");
var router = express.Router();
var rf = require("../models").RegistrationForm;
var rfd = require("../models").RegistrationFormDetail;
var Shuttleschedule = require("../models").ShuttleSchedule;
const authenticateToken = require("../middleware/authJWT");
// UPDATE: Change status to Present
router.put("/attend", authenticateToken, async (req, res) => {
    const registrationId = req.query.id;

    if (!registrationId) {
        return res
            .status(400)
            .json({ success: false, message: "ID is required" });
    }

    try {
        const registration = await rf.findOne({
            where: { RegistrationID: registrationId },
        });
        if (!registration) {
            return res.status(404).json({
                success: false,
                message: "Registration Form not found",
            });
        }

        const newStatus =
            registration.attendance_status == "Present" ? "Absent" : "Present";
        await rf.update(
            { attendance_status: newStatus },
            { where: { RegistrationID: registrationId } }
        );

        res.status(200).json({
            success: true,
            message: "Status updated successfully",
        });
    } catch (error) {
        console.error("Error updating status:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});

//get attendees data schedules
router.get("/get", authenticateToken, async (req, res) => {
    try {
        const scheduleID = req.query.scheduleID;
        const useDate = new Date(req.query.useDate);
        const registrations = await rf.findAll({
            where: {
                useDate: useDate,
                verification_status: "Verified",
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
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});

module.exports = router;
