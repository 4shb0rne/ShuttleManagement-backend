var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User, Sequelize } = require("../models");
const authenticateToken = require("../middleware/authJWT");
const { where } = require("sequelize");

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (!(await bcrypt.compare(password, user.password))) {
        return res.status(403).json({ error: "Incorrect password" });
    }

    const accessToken = jwt.sign(
        { username: user.username },
        process.env.ACCESS_TOKEN_SECRET
    );
    res.json({ accessToken });
});

router.get("/get-current-user", authenticateToken, async (req, res) => {
    try {
        console.log(req.user.username);
        const userData = await User.findOne({
            where: { username: req.user.username },
        });

        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(userData);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/get-all-users", async (req, res) => {
    try {
        const users = await User.findAll({
            where: {
                user_role: {
                    [Sequelize.Op.not]: "Super",
                },
            },
        });

        return res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

router.put("/update-access-rights", async (req, res) => {
    const user_id = req.query.user_id;
    const { access_rights } = req.body;
    console.log(access_rights);
    // console.log(JSON.parse(access_rights));
    try {
        const user = await User.findOne({
            where: { user_id: user_id },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // // Ensure that access_rights is an array before assigning
        // if (!Array.isArray(access_rights)) {
        //     return res
        //         .status(400)
        //         .json({ message: "Access rights must be an array" });
        // }

        // user.access_rights = JSON.stringify(access_rights);
        user.access_rights = access_rights;
        await user.save();

        return res
            .status(200)
            .json({ message: "Access rights updated successfully" });
    } catch (error) {
        console.error("Error updating access rights:", error);
        return res
            .status(500)
            .json({ message: "Failed to update access rights" });
    }
});

router.delete("/:user_id", async (req, res) => {
    try {
        const deleted = await User.destroy({
            where: { user_id: req.params.user_id },
        });
        if (deleted) {
            res.status(204).send("User deleted");
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
