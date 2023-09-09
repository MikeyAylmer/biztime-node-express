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

// GET/ route to return info by id.
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await db.query(`SELECT * FROM invoices WHERE id=$1`, [id])
        if (result.rows.length === 0) {
            throw new ExpressError(`Can't find info on ID of ${id}`, 404)
        }
        return res.send({ invoices: result.rows[0] })
    } catch (err) {
        return next(err)
    }
})

// POST/ route to create new company invoice.
router.post('/', async (req, res, next) => {
    try {
        const { comp_code, amt } = req.body;
        const result = await db.query(
            `INSERT INTO invoices (comp_code, amt) VALUES ($1, $2) RETURNING *`, [comp_code, amt])

        return res.status(201).json({ invoices: result.rows[0] })

    } catch (err) {
        return next(err)
    }
})

// PUT/ route to update amt of companies invoice.
router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { amt } = req.body;
        const result = await db.query(
            `UPDATE invoices SET amt=$1
            WHERE id =$2
            RETURNING *`,
            [amt, id]
        )
        if (result.rows.length === 0) {
            throw new ExpressError(`Can't update amt of id where id is ${id}`, 404)
        }
        return res.json({ invoices: result.rows[0] })
    } catch (err) {
        return next(err)
    }
})

// DELETE/ route to delete by id.
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params
        const result = await db.query(`DELETE FROM invoices WHERE id=$1`, [id])
        if (result.rowCount === 0) {
            throw new ExpressError(`Can't delete invoice with id of ${id}`, 404)
        }
        return res.send({ message: "DELETED!" })
    } catch (err) {
        return next(err)
    }
})

// GET/ route to grab both data from companies and invoices table.
router.get('/companies/:code', async (req, res, next) => {
    try {
        const { code } = req.params;

        // Assuming there is a companies table
        const result = await db.query(
            `SELECT
            c.code AS comp_code,
            c.name AS company_name,
            c.description AS company_description, AS invoices
            FROM
                companies c
            LEFT JOIN
                invoices i
            ON
                c.comp_code = i.comp_code
            WHERE
                c.comp_code =$1
            GROUP BY
                c.code, c.name, c.description;`,
            [code]
        );

        if (result.rows.length === 0) {
            // Handle the case where the company with the given code is not found
            return res.status(404).json({ error: 'Company not found' });
        }

        // Assuming you want to return a single company's information
        const company = result.rows[0];

        // You can customize the response structure as needed
        const responseObj = {
            company: {
                code: company.company_code,
                name: company.company_name,
                description: company.company_description,
                invoices: company.invoices,
            },
        };

        return res.json(responseObj);
    } catch (err) {
        return next(err);
    }
});

// export router for middleware.
module.exports = router;