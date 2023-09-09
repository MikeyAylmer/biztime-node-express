process.env.NODE_ENV = 'test'
const request = require('supertest');
const app = require('../app')
const db = require('../db');


// set up test company
let testUser;
beforeEach(async () => {
    const result = await db.query(
        `INSERT INTO companies (code, name, description) 
        VALUES ('rougeninja', 'Akatsuki', 'Evil team of rouge ninja') RETURNING *`)
    testUser = result.rows[0]
})

// delete all uses after test are ran to avoid duplication.
afterEach(async () => {
    await db.query(`DELETE FROM companies`)
})

// needed to end async operations in jest.
afterAll(async () => {
    await db.end()
})
// test to see if set up is working
describe("HOPE THIS WORKS", () => {
    test("BLAHH", () => {
        console.log(testUser);
        expect(1).toBe(1);
    })
})