/* global describe test expect */

const app = require('../src/app');
const request = require('supertest')(app);
const adminToken = require('./token').adminToken;
const standardToken = require('./token').standardToken;

let createdTestId;

describe('Create test controller tests', () => {
    test('Request creation without body (should fail)', () => request
        .post('/api/tests')
        .set('token', adminToken)
        .then(res => {
            expect(res.status).toBe(400);
        }));

    test('Request creation with bad body (should fail)', () => request
        .post('/api/tests')
        .set('token', adminToken)
        .send({ 'vis': 1, 'teep': 1, 'Date': { 'day': 1, 'month': 1, 'year': 2020 } })
        .then(res => {
            expect(res.status).toBe(400);
        }));

    test('Request creation with good body (should success)', () => request
        .post('/api/tests')
        .set('token', adminToken)
        .send({ 'visitId': 1, 'type': 1, 'expectedDate': { 'day': 1, 'month': 1, 'year': 2020 } })
        .then(res => {
            expect(res.status).toBe(200);
            createdTestId = res[0];
        }));

});

describe('Create test add occurence date controller tests', () => {
    test('Request creation add occurence date with bad body (should fail)', () => request
        .post('/api/tests')
        .set('token', adminToken)
        .send({ 'vis': 1, 'teep': 1, 'Date': { 'day': 1, 'month': 1, 'year': 2020 } })
        .then(res => {
            expect(res.status).toBe(400);
        }));

    test('Request creation add occurence date with good body (should success)', () => request
        .post('/api/tests')
        .set('token', adminToken)
        .send({ 'visitId': 1, 'type': 1, 'expectedDate': { 'day': 12, 'month': 1, 'year': 2020 }, 'actualOccurredDate': { 'day': 4, 'month': 1, 'year': 2020 } })
        .then(res => {
            expect(res.status).toBe(200);
        }));
});

describe('Delete test controller tests', () => {
    test('Request deletion without body (should fail)', () => request
        .patch('/api/tests')
        .set('token', adminToken)
        .then(res => {
            expect(res.status).toBe(400);
        }));

    test('Request deletion with bad body (should fail)', () => request
        .post('/api/tests')
        .set('token', adminToken)
        .send({ 'visit_-Id': createdTestId })
        .then(res => {
            expect(res.status).toBe(400);
        }));

    test('Request deletion with good body by standard User (should fail)', () => request
        .patch('/api/tests')
        .set('token', standardToken)
        .send({ 'testID': createdTestId })
        .then(res => {
            expect(res.status).toBe(401);
        }));

    test('Request deletion with bad ID type (should fail)', () => request
        .patch('/api/tests')
        .set('token', adminToken)
        .send({ 'testID': 'WRONG' })
        .then(res => {
            expect(res.status).toBe(404);
        }));

    test('Request deletion with bad ID reference (should fail)', () => request
        .patch('/api/tests')
        .set('token', adminToken)
        .send({ 'testID': 99999999 })
        .then(res => {
            expect(res.status).toBe(404);
        }));

    test('Request deletion with good body (should success)', () => request
        .patch('/api/tests')
        .set('token', adminToken)
        .send({ 'testID': createdTestId })
        .then(res => {
            expect(res.status).toBe(200);
        }));
});
