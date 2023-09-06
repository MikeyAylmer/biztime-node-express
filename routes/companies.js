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

router.get('/:code', async (req, res, next) => {
    try {
        const { code } = req.params;
        const { name, description } = req.body;
        const result = await db.query(
            `SELECT * FROM companies WHERE code =$1`, [code]
        );
        return res.json({ companies: result.rows[0] })
    } catch (err) {
        return next(err)
    }
})

module.exports = router;