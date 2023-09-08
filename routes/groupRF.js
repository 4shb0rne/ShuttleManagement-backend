var express = require('express');
var router = express.Router();
var grf = require('../models').GroupRegistrationForm;
const authenticateToken = require('../middleware/authJWT');
// CREATE: Add a new group registration
router.post('/', authenticateToken, async (req, res) => {
    try {
        const groupRegistration = await grf.create(req.body);
        res.status(201).json(groupRegistration);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// READ: Get a group registration by ID
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const groupRegistration = await grf.findByPk(req.params.id);
        if (groupRegistration) {
            res.json(groupRegistration);
        } else {
            res.status(404).json({ error: 'Group Registration not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// UPDATE: Update a group registration by ID
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const [updated] = await grf.update(req.body, {
            where: { groupRegistrationID: req.params.id }
        });
        if (updated) {
            const updatedGroupRegistration = await grf.findByPk(req.params.id);
            res.json(updatedGroupRegistration);
        } else {
            res.status(404).json({ error: 'Group Registration not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE: Delete a group registration by ID
router.delete('/:id', authenticateToken, async (req, res) => {
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
