var express = require("express");
var router = express.Router();
var rf = require("../models").RegistrationForm;
var rfd = require("../models").RegistrationFormDetail;
var gf = require("../models").GroupRegistrationForm;
var gfd = require("../models").GroupRegistrationFormDetail;
var Shuttleschedule = require("../models").ShuttleSchedule;
const { Op } = require("sequelize");
const { sequelize } = require("../models");

//GET : Get Registration Datas by Schedule
router.get("/schedule", async (req, res) => {
    try {
        const scheduleID = parseInt(req.query.scheduleID, 10);
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

router.get("/newest", async (req, res) => {
    try {
        const registrations = await rf.findAll({
            order: [["created_at", "DESC"]],
            include: [
                {
                    model: rfd,
                    as: "details",
                    include: [
                        {
                            model: Shuttleschedule,
                            as: "schedulesDetails",
                        },
                    ],
                },
            ],
        });
        res.status(200).json(registrations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/gets", async (req, res) => {
    try {
        const ids = req.query.ids.map(Number);
        const registrations = await rf.findAll({
            where: {
                RegistrationID: {
                    [Op.in]: ids,
                },
            },
            include: [
                {
                    model: rfd,
                    as: "details",
                    include: [
                        {
                            model: Shuttleschedule,
                            as: "schedulesDetails",
                        },
                    ],
                },
            ],
        });

        res.status(200).json(registrations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//GET : Get Registration Datas that have status 'Not Verified' (harus diganti)
// router.get("/groupRequest", async (req, res) => {
//     try {
//         const registrations = await rf.findAll({
//             where: {
//                 status: "Not Verified",
//             },
//             include: [
//                 {
//                     model: rfd,
//                     as: "details",
//                     where: {
//                         registrationID: sequelize.col("details.registrationID"),
//                     },
//                     include: [
//                         {
//                             model: Shuttleschedule,
//                             as: "schedulesDetails",
//                         },
//                     ],
//                 },
//             ],
//         });
//         return res.status(200).json(registrations);
//     } catch (err) {
//         return res
//             .status(500)
//             .json({ message: "Server error", error: err.message });
//     }
// });

router.get("/groupRequest", async (req, res) => {
    try {
        const registrations = await gf.findAll({
            where: {
                status: "Not Verified",
            },
            include: [
                {
                    model: gfd,
                    as: "details",
                    where: {
                        groupRegistrationID: sequelize.col(
                            "details.groupRegistrationID"
                        ),
                    },
                    include: [
                        {
                            model: Shuttleschedule,
                            as: "SchedulesDetails",
                        },
                    ],
                },
            ],
        });
        return res.status(200).json(registrations);
    } catch (err) {
        return res
            .status(500)
            .json({ message: "Server error", error: err.message });
    }
});

//harus diganti
router.put("/processRequest", async (req, res) => {
    const groupRegistrationId = req.query.id;
    const processCode = req.query.processCode;

    if (!groupRegistrationId) {
        return res
            .status(400)
            .json({ success: false, message: "ID is required" });
    }

    try {
        let updatedRows;
        console.log(processCode);
        if (processCode == 1) {
            updatedRows = await gf.update(
                { status: "Verified" },
                { where: { groupRegistrationID: groupRegistrationId } }
            );
        } else {
            //delete
            updatedRows = await gf.update(
                { status: "Rejected" },
                { where: { groupRegistrationID: groupRegistrationId } }
            );
        }

        if (updatedRows[0] === 0) {
            return res.status(404).json({
                success: false,
                message: "Registration Form not found",
            });
        }

        res.status(201).json({
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

const addRegistration = async (reqBody) => {
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
    } = reqBody;

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

    return {
        registration,
        message: `New registration created with ID: ${newRegistrationID}`,
    };
};

//ADD : Add Registration
router.post("/add", async (req, res) => {
    try {
        const result = await addRegistration(req.body);
        res.status(201).json(result);
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
                            as: "schedulesDetails",
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

module.exports = { router, addRegistration };
