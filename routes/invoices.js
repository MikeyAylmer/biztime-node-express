const express = require('express');
const router = express.Router();
const db = require('../db');
const ExpressError = require('../expressError');



// get route to return info on invoices.
router.get('/', async (req, res, next) => {
    try {
        const results = await db.query(`SELECT * FROM invoices`);
        return res.json({ invoices: results.rows })
    } catch (err) {
        return next(err)
    }
})

// export router for middleware.
module.exports = router;