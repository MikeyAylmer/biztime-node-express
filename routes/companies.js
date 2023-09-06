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

// GET route for object of company by code.
router.get('/:code', async (req, res, next) => {
    try {
        const { code } = req.params;
        const { name, description } = req.body;
        const result = await db.query(
            `SELECT * FROM companies WHERE code =$1`, [code]
        );
        if (result.rows.length === 0) {
            throw new ExpressError(`Cant find company with code of ${code}`, 404)
        }
        return res.json({ companies: result.rows[0] })
    } catch (err) {
        return next(err)
    }
})

// POST route to create a new company.
router.post('/', async (req, res, next) => {
    try {
        const { code, name, description } = req.body;
        const result = await db.query(
            `INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING *`, [code, name, description]
        )
        return res.status(201).json({ companies: result.rows[0] })
    } catch (err) {
        return next(err)
    }
})

module.exports = router;