/* global beforeAll afterAll describe test expect */

const request = require('supertest');
const admin = request.agent(global.optimiseRouter);
const user = request.agent(global.optimiseRouter);
const message = require('../src/utils/message-utils');
const { connectAdmin, connectUser, disconnectAgent } = require('./connection');

beforeAll(async () => {
    await connectAdmin(admin);
    await connectUser(user);
});

afterAll(async () => {
    await disconnectAgent(admin);
    await disconnectAgent(user);
});

describe('Create Clinical Event controller tests', () => {
    test('Request creation whithout body (should fail)', () => admin
        .post('/clinicalEvents')
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.MISSINGARGUMENT);
            return true;
        }));

    test('Request creation with bad date format (should fail)', () => admin
        .post('/clinicalEvents')
        .send({
            visitId: 1,
            type: 1,
            dateStartDate: {
                jour: 1,
                mois: 3,
                année: 2011
            },
            meddra: 1
        })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.WRONGARGUMENTS);
            return true;
        }));

    test('Request creation with bad body (should fail)', () => admin
        .post('/clinicalEvents')
        .send({
            'visit_-Id': 1,
            'tYpE': 2,
            'mEdDrA': 4,
            'start_dAte': {
                jour: 1,
                mois: 3,
                année: 2011
            }
        })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.MISSINGARGUMENT);
            return true;
        }));

    test('Request creation with good patient and visit (should succeed)', () => admin
        .post('/clinicalEvents')
        .send({
            visitId: 1,
            type: 1,
            dateStartDate: '1980-01-01',
            meddra: 1
        })
        .then(res => {
            expect(res.status).toBe(200);
            expect(typeof res.body).toBe('object');
            expect(res.body.state).toBeDefined();
            expect(res.body.state).toBe(6);
            return true;
        }));
});

describe('Update Clinical Event', () => {

    test('Update MedDRA code of an event', () => user
        .put('/clinicalEvents')
        .send({
            id: 3,
            meddra: 4
        })
        .then(res => {
            expect(res.status).toBe(200);
            expect(typeof res.body).toBe('object');
            expect(res.body.state).toBe(1);
            return true;
        }));
});

describe('Delete Clinical Event controller tests', () => {
    test('Request deletion with a standard user (should succeed)', () => user
        .delete('/clinicalEvents')
        .send({
            ceId: 6
        })
        .then(res => {
            expect(res.status).toBe(200);
            expect(typeof res.body).toBe('object');
            expect(res.body.state).toBeDefined();
            expect(res.body.state).toBe(1);
            return true;
        }));

    test('Request deletion without body (should fail)', () => admin
        .delete('/clinicalEvents')
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.MISSINGARGUMENT);
            return true;
        }));

    test('Request deletion with bad body (should fail)', () => admin
        .delete('/clinicalEvents')
        .send({
            'ce_-Id': 6
        })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.MISSINGARGUMENT);
            return true;
        }));

    test('Request deletion with bad ID reference (should fail)', () => admin
        .delete('/clinicalEvents')
        .send({ 'ceId': 99999999 })
        .then(res => {
            expect(res.status).toBe(200);
            expect(typeof res.body).toBe('object');
            expect(res.body.state).toBeDefined();
            expect(res.body.state).toBe(0);
            return true;
        }));

    test('Request deletion with good body (should succeed)', () => admin
        .delete('/clinicalEvents')
        .send({ 'ceId': 4 })
        .then(res => {
            expect(res.status).toBe(200);
            expect(typeof res.body).toBe('object');
            expect(res.body.state).toBeDefined();
            expect(res.body.state).toBe(1);
            return true;
        }));
});