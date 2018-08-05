/* global describe test expect */

const request = require('supertest');
const admin = request.agent(global.optimiseRouter);
const user = request.agent(global.optimiseRouter);
const message = require('../src/utils/message-utils');
const { connectAdmin, connectUser, disconnectAgent } = require('./connection');

beforeAll(async () => { //eslint-disable-line no-undef
    await connectAdmin(admin);
    await connectUser(user);
});

afterAll(async () => { //eslint-disable-line no-undef
    await disconnectAgent(admin);
    await disconnectAgent(user);
});

describe('Creating CE data', () => {
    test('Request creation without body', () => admin
        .post('/data/clinicalEvent').then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(`${message.dataMessage.MISSINGVALUE}clinicalEventId`);
        }));

    test('Request creation without add or update', () => admin
        .post('/data/clinicalEvent')
        .send({ clinicalEventId: 1 })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(`${message.dataMessage.MISSINGVALUE}clinicalEventId`);
        }));

    test('Request creation without clinicalEvent id', () => admin
        .post('/data/clinicalEvent')
        .send({ add: { 5: 'BOTH' } })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(`${message.dataMessage.MISSINGVALUE}clinicalEventId`);
        }));

    test('Request creation with invalid value for id', () => admin
        .post('/data/clinicalEvent')
        .send({ clinicalEventId: 99, add: { 1: 'YES' } })
        .then(res => {
            expect(res.status).toBe(404);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.dataMessage.CLINICALEVENT);
        }));

    test('Request creation with invalid field', () => admin
        .post('/data/clinicalEvent')
        .send({ clinicalEventId: 1, add: { 534567: 'BOTH' } })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.dataMessage.FIELDNOTFOUND);
        }));

    test('Request creation with invalid value for requested field', () => admin
        .post('/data/clinicalEvent')
        .send({ clinicalEventId: 1, add: {} })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.dataMessage.FIELDNOTFOUND);
        }));

    test('Request creation succesfull', () => user
        .post('/data/clinicalEvent')
        .send({ clinicalEventId: 1, add: { 1: 'YES' } })
        .then(res => {
            expect(res.status).toBe(200);
            expect(typeof res.body).toBe('object');
            expect(res.body.success).toBeDefined();
            expect(res.body.message).toBeDefined();
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe(message.dataMessage.SUCCESS);
        }));

    test('Request update succesfull (as admin)', () => admin
        .post('/data/clinicalEvent')
        .send({ clinicalEventId: 1, update: { 1: 'NO' } })
        .then(res => {
            expect(res.status).toBe(200);
            expect(typeof res.body).toBe('object');
            expect(res.body.success).toBeDefined();
            expect(res.body.message).toBeDefined();
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe(message.dataMessage.SUCCESS);
        }));

    test('Request creation of incompatible reference type and parent clinical event', () => user
        .post('/data/clinicalEvent')
        .send({ clinicalEventId: 1, add: { 18: 'We do not know' } })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.dataMessage.INVALIDFIELD);
        }));

    test('Request creation successfull (as user)', () => user
        .post('/data/clinicalEvent')
        .send({ clinicalEventId: 5, add: { 18: 'We do not know' } })
        .then(res => {
            expect(res.status).toBe(200);
            expect(typeof res.body).toBe('object');
            expect(res.body.success).toBeDefined();
            expect(res.body.message).toBeDefined();
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe(message.dataMessage.SUCCESS);
        }));

    test('Request update succesfull (as user)', () => user
        .post('/data/clinicalEvent')
        .send({ clinicalEventId: 5, update: { 18: 'We do not know a lot' } })
        .then(res => {
            expect(res.status).toBe(200);
            expect(typeof res.body).toBe('object');
            expect(res.body.success).toBeDefined();
            expect(res.body.message).toBeDefined();
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe(message.dataMessage.SUCCESS);
        }));

    test('Request creation with wrong type', () => user
        .post('/data/clinicalEvent')
        .send({ clinicalEventId: 5, add: { 17: 'Not a date' } })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(`${message.userError.INVALIDDATE} at field 17`);
        }));

    test('Request creation with wrong none ISO date format', () => user
        .post('/data/clinicalEvent')
        .send({ clinicalEventId: 5, add: { 17: '2018/10/10' } })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(`${message.userError.INVALIDDATE} at field 17`);
        }));

    test('Request creation with correct ISO date format', () => user
        .post('/data/clinicalEvent')
        .send({ clinicalEventId: 5, add: { 17: '2013-02-04T22:44:30.652Z' } })
        .then(res => {
            expect(res.status).toBe(200);
            expect(typeof res.body).toBe('object');
            expect(res.body.success).toBeDefined();
            expect(res.body.message).toBeDefined();
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe(message.dataMessage.SUCCESS);
        }));

    test('Request update with wrong none ISO date format', () => user
        .post('/data/clinicalEvent')
        .send({ clinicalEventId: 5, update: { 17: '2017/10/10' } })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(`${message.userError.INVALIDDATE} at field 17`);
        }));

    test('Request update with correct ISO date format', () => user
        .post('/data/clinicalEvent')
        .send({ clinicalEventId: 5, update: { 17: '2013-02-04T22:44:30.652Z' } })
        .then(res => {
            expect(res.status).toBe(200);
            expect(typeof res.body).toBe('object');
            expect(res.body.success).toBeDefined();
            expect(res.body.message).toBeDefined();
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe(message.dataMessage.SUCCESS);
        }));

    test('Request reset of field', () => user
        .post('/data/clinicalEvent')
        .send({ clinicalEventId: 5, update: { 17: '' } })
        .then(res => {
            expect(res.status).toBe(200);
            expect(typeof res.body).toBe('object');
            expect(res.body.success).toBeDefined();
            expect(res.body.message).toBeDefined();
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe(message.dataMessage.SUCCESS);
        }));
});