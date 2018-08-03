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

describe('Create Immunisation controller test', () => {
    test('Creating Immunisation without body', () => admin
        .post('/demographics/Immunisation')
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.MISSINGARGUMENT);
        }));

    test('Creating Immunisation with body but empty property (Should Fail)', () => admin
        .post('/demographics/Immunisation')
        .send({
            'patient': null,
            'vaccineName': null,
            'immunisationDate': null
        })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.WRONGARGUMENTS);
        }));

    test('Creating Immunisation with body but badly formated property (Should Fail)', () => admin
        .post('/demographics/Immunisation')
        .send({
            'patient': 'WRONG',
            'vaccineName': 0,
            'immunisationDate': 0
        })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.WRONGARGUMENTS);
        }));

    test('Creating Immunisation with body but wrong patient (Should Fail)', () => admin
        .post('/demographics/Immunisation')
        .send({
            'patient': 90,
            'vaccineName': 'Vacthing',
            'immunisationDate': '2009-05-02'
        })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.errorMessages.CREATIONFAIL);
        }));

    test('Creating Immunisation with body but wrong vaccineName (Should Fail)', () => admin
        .post('/demographics/Immunisation')
        .send({
            'patient': 1,
            'vaccineName': 0,
            'immunisationDate': '2009-05-02'
        })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.WRONGARGUMENTS);
        }));

    test('Creating Immunisation with body but badly formatted immunisation Date (Should Fail)', () => admin
        .post('/demographics/Immunisation')
        .send({
            'patient': 1,
            'vaccineName': 'Vacthing',
            'immunisationDate': 0
        })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.WRONGARGUMENTS);
        }));

    test('Creating Immunisation with body but wrong vaccine Date (Should Fail)', () => admin
        .post('/demographics/Immunisation')
        .send({
            'patient': 1,
            'vaccineName': 'Vacthing',
            'immunisationDate': '2001-02-29'
        })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.dateError[2]);
        }));


    test('Creating Immunisation well formatted (Should Succeed)', () => admin
        .post('/demographics/Immunisation')
        .send({
            'patient': 1,
            'vaccineName': 'Vacthing',
            'immunisationDate': '2009-05-02'
        })
        .then(res => {
            expect(res.status).toBe(200);
            expect(typeof res.body).toBe('object');
            expect(res.body.state).toBeDefined();
            expect(res.body.state).toBe(4);
        }));

});

describe('Edit Immunisation controller test', () => {
    test('Editing Immunisation without body', () => admin
        .put('/demographics/Immunisation')
        .then(res => {
            expect(res.status).toBe(400);
        }));

    test('Editing Immunisation with body but empty property (Should Fail)', () => admin
        .put('/demographics/Immunisation')
        .send({
            'id': null,
            'patient': null,
            'vaccineName': null,
            'immunisationDate': null
        })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.WRONGARGUMENTS);
        }));

    test('Editing Immunisation with body but badly formated property (Should Fail)', () => admin
        .put('/demographics/Immunisation')
        .send({
            'id': 'WRONG',
            'patient': 'WRONG',
            'vaccineName': 0,
            'immunisationDate': 0
        })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.WRONGARGUMENTS);
        }));

    test('Editing Immunisation with body but wrong id (Should Fail)', () => admin
        .put('/demographics/Immunisation')
        .send({
            'id': 90,
            'patient': 1,
            'vaccineName': 'A good vaccine',
            'immunisationDate': '2009-05-02'
        })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.errorMessages.UPDATEFAIL);
        }));


    test('Editing Immunisation with body but wrong patient (Should Fail)', () => admin
        .put('/demographics/Immunisation')
        .send({
            'id': 1,
            'patient': 90,
            'vaccineName': 'A good vaccine',
            'immunisationDate': '2009-05-02'
        })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.errorMessages.UPDATEFAIL);
        }));

    test('Editing Immunisation with body but badly formatted immunisationDate (Should Fail)', () => admin
        .put('/demographics/Immunisation')
        .send({
            'id': 1,
            'patient': 1,
            'vaccineName': 'A good vaccine',
            'immunisationDate': null
        })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.WRONGARGUMENTS);
        }));

    test('Editing Immunisation well formatted (Should Succeed)', () => admin
        .put('/demographics/Immunisation')
        .send({
            'id': 4,
            'patient': 1,
            'vaccineName': 'Immune D',
            'immunisationDate': '2009-05-02'
        })
        .then(res => {
            expect(res.status).toBe(200);
            expect(typeof res.body).toBe('object');
            expect(res.body.state).toBeDefined();
            expect(res.body.state).toBe(1);
        }));
});

describe('Delete Immunisation controller test', () => {
    test('Deleting Immunisation without body', () => admin
        .delete('/demographics/Immunisation')
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.MISSINGARGUMENT);
        }));

    test('Deleting Immunisation with body but empty property (Should Fail)', () => admin
        .delete('/demographics/Immunisation')
        .send({
            'id': null
        })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.WRONGARGUMENTS);
        }));

    test('Deleting Immunisation with body but badly formated property (Should Fail)', () => admin
        .delete('/demographics/Immunisation')
        .send({
            'id': 'WRONG'
        })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.WRONGARGUMENTS);
        }));

    test('Deleting Immunisation with body but out of bound id (Should Fail)', () => admin
        .delete('/demographics/Immunisation')
        .send({
            'id': 90
        })
        .then(res => {
            expect(res.status).toBe(200);
            expect(typeof res.body).toBe('object');
            expect(res.body.state).toBeDefined();
            expect(res.body.state).toBe(0);
        }));

    test('Deleting Immunisation with good preperty (Should Succeed)', () => admin
        .delete('/demographics/Immunisation')
        .send({
            'id': 3
        })
        .then(res => {
            expect(res.status).toBe(200);
            expect(typeof res.body).toBe('object');
            expect(res.body.state).toBeDefined();
            expect(res.body.state).toBe(1);
        }));
});