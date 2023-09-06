const express = require('express');
const router = express.Router();
const db = require('../db');
const ExpressError = require('../expressError');

// get route to return a list of all companies.
router.get('/', async (req, res, next) => {
    try {
        const results = await db.query(`SELECT * FROM companies`);
        return res.json({ companies: results.rows })
    } catch (err) {
        return next(err)
    }
})

module.exports = router;