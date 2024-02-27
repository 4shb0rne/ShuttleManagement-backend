var express = require("express");
var router = express.Router();
var rf = require("../models").RegistrationForm;
var rfd = require("../models").RegistrationFormDetail;
var gf = require("../models").GroupRegistrationForm;
var gfd = require("../models").GroupRegistrationFormDetail;
var Shuttleschedule = require("../models").ShuttleSchedule;
const authenticateToken = require("../middleware/authJWT");
const { Op } = require("sequelize");
const { sequelize } = require("../models");
const PdfPrinter = require("pdfmake");
const XLSX = require("xlsx");

var fonts = {
    Roboto: {
        normal: "public/fonts/Roboto-Regular.ttf",
        bold: "public/fonts/Roboto-Medium.ttf",
        italics: "public/fonts/Roboto-Italic.ttf",
        bolditalics: "public/fonts/Roboto-MediumItalic.ttf",
    },
};

function generateOTP() {
    let otp = "";
    for (let i = 0; i < 6; i++) {
        otp += Math.floor(Math.random() * 10);
    }
    console.log(otp);
    return otp;
}

function generatePdf(data) {
    const printer = new PdfPrinter(fonts);
    // Group data by departureTime
    const groupedByTime = {};
    data.forEach((item) => {
        item.details.forEach((detail) => {
            // Accessing the schedulesDetails object
            const schedule = detail.schedulesDetails;
            const time = schedule.departureTime;
            if (!groupedByTime[time]) {
                groupedByTime[time] = [];
            }
            groupedByTime[time].push({
                binusianID: item.binusianID,
                name: item.name,
                phoneNumber: item.phoneNumber,
                email: item.email,
            });
        });
    });

    // Prepare content for each departureTime
    const content = [
        { text: "Registration Details", style: "header" },
        { text: "", margin: [0, 10, 0, 0] },
    ];

    Object.keys(groupedByTime).forEach((time) => {
        content.push({ text: `Departure Time: ${time}`, style: "subheader" });
        content.push({ text: "", margin: [0, 5, 0, 0] });

        const tableBody = [
            ["BinusianID", "Name", "Phone", "Email", "Attendance"],
        ];
        groupedByTime[time].forEach((item) => {
            tableBody.push([
                item.binusianID,
                item.name,
                item.phoneNumber,
                item.email,
                "   ",
            ]);
        });

        content.push({
            style: "tableExample",
            table: {
                body: tableBody,
            },
        });

        content.push({ text: "", margin: [0, 10, 0, 0] }); // Space between tables
    });

    const docDefinition = {
        content: content,
        styles: {
            header: {
                fontSize: 18,
                bold: true,
            },
            subheader: {
                fontSize: 14,
                bold: true,
                margin: [0, 5, 0, 5],
            },
            tableExample: {
                margin: [0, 5, 0, 15],
            },
        },
        layout: {
            paddingLeft: function (i, node) {
                return 10;
            },
            paddingRight: function (i, node) {
                return 10;
            },
            paddingTop: function (i, node) {
                return 5;
            },
            paddingBottom: function (i, node) {
                return 5;
            },
        },
    };

    return printer.createPdfKitDocument(docDefinition);
}

function generateXlsx(data) {
    const workbook = XLSX.utils.book_new();

    // Group data by location
    const groupedByLocation = {};
    data.forEach((item) => {
        item.details.forEach((detail) => {
            const schedule = detail.schedulesDetails;
            const location = schedule.departingLocation;
            const time = schedule.departureTime;
            if (!groupedByLocation[location]) {
                groupedByLocation[location] = [];
            }
            groupedByLocation[location].push({
                binusianID: item.binusianID,
                name: item.name,
                phoneNumber: item.phoneNumber,
                email: item.email,
                departureTime: time, // Include the departure time
                attendance_status: item.attendance_status,
            });
        });
    });

    // Iterate over each location
    Object.keys(groupedByLocation).forEach((location) => {
        // Create a worksheet for each location
        const worksheetName = `${location} Schedule`;
        const worksheet = XLSX.utils.aoa_to_sheet([]);

        const headers = [
            "BinusianID",
            "Name",
            "Phone",
            "Email",
            "Departure Time",
            "Attendance",
        ];

        XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: "A1" });

        // Add data
        const tableData = groupedByLocation[location].map((item) => [
            item.binusianID,
            item.name,
            item.phoneNumber,
            item.email,
            item.departureTime,
            item.attendance_status,
        ]);
        XLSX.utils.sheet_add_aoa(worksheet, tableData, { origin: "A2" });

        // Set column widths
        const columnWidths = [
            { wpx: 100 }, // Width in pixels for the first column (BinusianID)
            { wpx: 150 }, // Width in pixels for the second column (Name)
            { wpx: 100 }, // Width in pixels for the third column (Phone)
            { wpx: 200 }, // Width in pixels for the fourth column (Email)
            { wpx: 150 }, // Width in pixels for the fifth column (Departure Time)
            { wpx: 100 }, // Width in pixels for the sixth column (Attendance)
        ];
        worksheet["!cols"] = columnWidths;

        // Add autofilters to headers
        worksheet["!autofilter"] = { ref: `A1:F${tableData.length + 1}` };

        // Append the worksheet to the workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, worksheetName);
    });

    // Generate buffer
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    return buffer;
}

//GET : Based on Date + Departing Location
router.get("/get-schedule-by-date", async (req, res) => {
    try {
        const departingLocation = req.query.departingLocation;
        const useDate = req.query.useDate;
        const details = await rf.findAll({
            where: {
                useDate: {
                    [Op.eq]: useDate,
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
                            where: {
                                departingLocation: {
                                    [Op.eq]: departingLocation,
                                },
                            },
                            attributes: ["scheduleID", "departureTime"],
                        },
                    ],
                },
            ],
        });

        // Generate PDF
        const pdfDoc = generatePdf(details);
        res.setHeader("Content-Type", "application/pdf");
        pdfDoc.pipe(res);
        pdfDoc.end();
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

//GET : Get attendance excel file
router.get("/get-attendance-excel", async (req, res) => {
    try {
        const useDate = req.query.useDate;
        const details = await rf.findAll({
            where: {
                useDate: useDate, // Use directly without [Op.eq]
            },
            include: [
                {
                    model: rfd,
                    as: "details",
                    include: [
                        {
                            model: Shuttleschedule,
                            as: "schedulesDetails",
                            attributes: [
                                "scheduleID",
                                "departureTime",
                                "departingLocation",
                            ],
                        },
                    ],
                },
            ],
        });
        console.log("Testing");
        // Generate Excel
        const buffer = generateXlsx(details);

        // Set response headers
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="attendance.xlsx"`
        );

        // Send the buffer as response
        res.send(buffer);
    } catch (err) {
        console.error("Error generating Excel:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

//GET : Get Verified Registration Datas by Schedule
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
                        verification_status: "Verified",
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

//GET : Get All Registration Datas by Schedule
router.get("/all-schedule", async (req, res) => {
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

const addRegistration2Way = async (reqBody) => {
    const {
        binusianID,
        name,
        phoneNumber,
        email,
        purpose,
        useDate,
        verification_status,
        attendance_status,
        scheduleID,
        scheduleID2,
        otp,
    } = reqBody;

    const registration = await rf.create({
        binusianID,
        name,
        phoneNumber,
        email,
        purpose,
        useDate,
        verification_status,
        attendance_status,
        otp,
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

const addRegistration1Way = async (reqBody) => {
    const {
        binusianID,
        name,
        phoneNumber,
        email,
        purpose,
        useDate,
        verification_status,
        attendance_status,
        scheduleID,
        otp,
    } = reqBody;

    const registration = await rf.create({
        binusianID,
        name,
        phoneNumber,
        email,
        purpose,
        useDate,
        verification_status,
        attendance_status,
        otp,
    });
    const newRegistrationID = registration.RegistrationID;

    await rfd.create({
        scheduleID,
        registrationID: newRegistrationID,
    });

    return {
        registration,
        message: `New registration created with ID: ${newRegistrationID}`,
    };
};

router.post("/add-1-way", async (req, res) => {
    const otp = generateOTP();
    try {
        const newRegistrationData = { ...req.body, otp: otp };
        const check = await validateCapacityBasedOnSchedule(req.body.useDate, req.body.scheduleID);
        if(req.body.verification_status == "Verified" && !check){
            res.status(200).json({message : "Full Capacity"});
        } else {
            const result = await addRegistration1Way(newRegistrationData);
            res.status(201).json(result);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//ADD : Add Registration 2 Way
router.post("/add", async (req, res) => {
    const otp = generateOTP();
    try {
        const newRegistrationData = { ...req.body, otp: otp };
        console.log(newRegistrationData);
        const check1 = await validateCapacityBasedOnSchedule(req.body.useDate, req.body.scheduleID);
        const check2 = await validateCapacityBasedOnSchedule(req.body.useDate, req.body.scheduleID2);
        console.log(check1);
        console.log(check2);
        if(req.body.verification_status == "Verified" && (check1 && check2)){
            res.status(200).json({message : "Full Capacity"});
        } else {
            const result = await addRegistration2Way(newRegistrationData);
            res.status(201).json(result);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/getOtp", authenticateToken, async (req, res) => {
    try {
        const registration = await rf.findByPk(req.query.RegistrationID);
        if (registration) {
            res.json({ otp: registration.otp });
        } else {
            res.status(404).json({ error: "Registration not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/verify-otp", async (req, res) => {
    try {
        const { registrationID, otp } = req.query;
        const registration = await rf.findByPk(registrationID);

        if (registration) {
            if (registration.otp === otp) {
                const check = await validateCapacity(registrationID);
                if(check) {
                    registration.verification_status = "Verified";
                    await registration.save();
                    res.json({ message: "OTP verified successfully" });
                } else {
                    res.json({ message : "Full Capacity" });
                }
            } else {
                res.json({ message : "Invalid OTP" });
            }
        } else {
            res.json({ error: "Registration not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/validate-capacity", async (req, res) => {
    try {
        const { registrationID } = req.query;
        const check = await validateCapacity(registrationID);
        res.status(200).json({ available: check });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

const validateCapacity = async(registrationID) => {
    try {
      if (!registrationID) {
        return res.status(400).json({ error: 'registrationID query parameter is required.' });
      }
  
      // Query the database for scheduleIDs and useDate associated with the provided registrationID
      const registrationDetails = await rfd.findAll({
        where: { registrationID },
        attributes: ['scheduleID', 'registrationID'],
        include: [{
          model: rf,
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
        const useDate = detail['RegistrationForm.useDate']; // Adjust this line if the path is incorrect
        if (!useDate) {
          console.error('useDate is undefined for detail:', detail);
          return { scheduleID: detail.scheduleID, canRegister: false }; // Handle the undefined useDate case
        }
      
        const count = await rfd.count({
          include: [{
            model: rf,
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

const validateCapacityBasedOnSchedule = async (useDate, scheduleID) => {
    try {
        if (!useDate || !scheduleID) {
            return false;
        }

        const count = await rfd.count({
            include: [{
                model: rf,
                where: { useDate },
                required: true
            }],
            where: { scheduleID }
        });

        return count >= 25; 
    } catch (error) {
        console.error('Failed to check registration capacity:', error);
        return false;
    }
};
  

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

module.exports = { router, addRegistration1Way };
module.exports = { router, addRegistration2Way };
