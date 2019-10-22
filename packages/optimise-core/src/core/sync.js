import os from 'os';
import request from 'request';
import { getEntry } from '../utils/controller-utils';
import dbcon from '../utils/db-connection';
import PatientCore from './patient';
import ErrorHelper from '../utils/error_helper';
import message from '../utils/message-utils';
import packageInfo from '../../package.json';

class SyncCore {

    /**
     * @function getSyncOptions retrieve the synchronization options.
     *
     * @returns a Promise that contains the result from the select query
     */
    static async getSyncOptions() {
        const id = await getEntry('OPT_KV', { key: 'SYNC_AGENT_ID' }, '*');
        const host = await getEntry('OPT_KV', { key: 'SYNC_HOST' }, '*');
        const key = await getEntry('OPT_KV', { key: 'SYNC_KEY' }, '*');
        return new Promise((resolve, reject) => {
            if (id.length !== 1)
                return reject(ErrorHelper(message.errorMessages.GETFAIL, 'Sync configuration not initialized'));
            resolve({
                id: id.length === 1 ? id[0].value : undefined,
                host: host.length === 1 ? host[0].value : undefined,
                key: key.length === 1 ? key[0].value : undefined
            });
        });
    }

    /**
     * @function setSyncOptions updates the synchronization options.
     *
     * @param {*} options New value to use for synchronisation
     */
    static async setSyncOptions(options) {
        let hostURL = { href: '' };
        try {
            if (options.host !== undefined && options.host.trim() !== '')
                hostURL = new URL(options.host);
        } catch (e) {
            return Promise.reject(ErrorHelper(message.userError.WRONGARGUMENTS, e));
        }
        const host = await dbcon()('OPT_KV').where({ key: 'SYNC_HOST' }).update({
            value: hostURL.href,
            updated_at: dbcon().fn.now()
        });
        const key = await dbcon()('OPT_KV').where({ key: 'SYNC_KEY' }).update({
            value: options.key,
            updated_at: dbcon().fn.now()
        });
        return new Promise((resolve, reject) => {
            if (host !== 1 || key !== 1)
                return reject(ErrorHelper(message.errorMessages.UPDATEFAIL, 'Sync configuration not initialized or invalid'));
            return resolve({
                status: 'success'
            });
        });
    }

    /**
     * @function getSyncStatus obtain synchronization status.
     *
     */
    static async getSyncStatus() {
        return new Promise((resolve, reject) => {
            return dbcon()('OPT_KV').where({ key: 'SYNC_STATUS' }).then((result) => {
                if (result.length !== 1)
                    return reject(ErrorHelper(message.errorMessages.UPDATEFAIL, 'Sync status could not be retreived'));
                return resolve(JSON.parse(result[0].value));
            }).catch(() => reject(ErrorHelper(message.errorMessages.UPDATEFAIL, 'Sync status could not be retreived')));
        });
    }


    /**
     * @function triggerSync trigger synchronization.
     *
     */
    static async triggerSync() {
        const config = await SyncCore.getSyncOptions();
        return new Promise((resolve, reject) => {
            if (config === undefined)
                return reject(ErrorHelper(message.errorMessages.UPDATEFAIL, 'Sync configuration not initialized or invalid'));
            const status = {
                status: 'scheduling',
                syncing: true
            };
            dbcon()('OPT_KV').where({ key: 'SYNC_STATUS' }).update({
                value: JSON.stringify(status),
                updated_at: dbcon().fn.now()
            }).then(() => {
                setTimeout(() => {
                    SyncCore.startSync(config).catch(() => false);
                }, 1000);
                return resolve(status);
            }).catch((e) => reject(ErrorHelper(message.errorMessages.UPDATEFAIL, e)));

        });
    }

    /**
     * @function startSync start synchronization.
     *
     * @param {*} config Connection information for synchronization
     */
    static async startSync(config) {

        if (config.host.trim() === '' || config.key.trim() === '') {
            await dbcon()('OPT_KV').where({ key: 'SYNC_STATUS' }).update({
                value: JSON.stringify({
                    status: 'idle'
                }),
                updated_at: dbcon().fn.now()
            });
            return;
        }

        try {

            await dbcon()('OPT_KV').where({ key: 'SYNC_STATUS' }).update({
                value: JSON.stringify({
                    status: 'running',
                    step: 'collecting',
                    syncing: true
                }),
                updated_at: dbcon().fn.now()
            });

            const patients = await dbcon().select().table('PATIENTS');
            const users = await dbcon().select().table('USERS');

            await dbcon()('OPT_KV').where({ key: 'SYNC_STATUS' }).update({
                value: JSON.stringify({
                    status: 'running',
                    step: 'counting',
                    syncing: true
                }),
                updated_at: dbcon().fn.now()
            });

            let patientPromises = [];
            let patientProfiles = [];
            patients.forEach(patient => {
                patientPromises.push(PatientCore.getPatientProfile({ 'id': patient.id }, true).then(result => {
                    patientProfiles.push({
                        ...patient,
                        ...result,
                        aliasId: undefined,
                        patientId: undefined
                    });
                    return true;
                }));
            });

            await Promise.all(patientPromises).catch(async (err) => {
                await dbcon()('OPT_KV').where({ key: 'SYNC_STATUS' }).update({
                    value: JSON.stringify({
                        error: {
                            message: 'Error while processing existing records',
                            exception: err
                        }
                    }),
                    updated_at: dbcon().fn.now()
                });
            });

            await dbcon()('OPT_KV').where({ key: 'SYNC_STATUS' }).update({
                value: JSON.stringify({
                    status: 'running',
                    step: 'merging',
                    syncing: true
                }),
                updated_at: dbcon().fn.now()
            });

            const data = JSON.stringify({
                uuid: config.id,
                agent: {
                    hostname: os.hostname(),
                    version: packageInfo.version
                },
                key: config.key,
                data: encodeURI(JSON.stringify({
                    patients: patientProfiles,
                    users: users.map(user => {
                        delete user.pw;
                        delete user.salt;
                        delete user.iterations;
                        return user;
                    })
                }))
            });

            const options = {
                uri: `${config.host}api/sync/v1.1`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Content-Length': data.length
                },
                encoding: 'utf-8',
                body: data
            };

            await dbcon()('OPT_KV').where({ key: 'SYNC_STATUS' }).update({
                value: JSON.stringify({
                    status: 'running',
                    step: 'linking',
                    syncing: true
                }),
                updated_at: dbcon().fn.now()
            });

            request(options, async (error, response, body) => {
                try {
                    const result = body !== undefined ? JSON.parse(body) : {};
                    if (!error && response.statusCode === 200) {
                        if (result.status === 'success')
                            await dbcon()('OPT_KV').where({ key: 'SYNC_STATUS' }).update({
                                value: JSON.stringify({
                                    status: 'success',
                                    lastSuccess: (new Date()).getTime()
                                }),
                                updated_at: dbcon().fn.now()
                            });
                        else
                            await dbcon()('OPT_KV').where({ key: 'SYNC_STATUS' }).update({
                                value: JSON.stringify({
                                    error: {
                                        message: 'Remote did not acknowledge success'
                                    }
                                }),
                                updated_at: dbcon().fn.now()
                            });
                    } else {
                        await dbcon()('OPT_KV').where({ key: 'SYNC_STATUS' }).update({
                            value: JSON.stringify({
                                error: {
                                    message: error ? error.message : (result && result.error ? result.error : 'Unknown error'),
                                    stack: error ? error.stack : (result && result.stack ? result.stack : undefined)
                                }
                            }),
                            updated_at: dbcon().fn.now()
                        });
                    }
                } catch (exception) {
                    await dbcon()('OPT_KV').where({ key: 'SYNC_STATUS' }).update({
                        value: JSON.stringify({
                            error: {
                                message: exception.message ? exception.message : 'Unknown error',
                                stack: exception.stack ? exception.stack : undefined
                            }
                        }),
                        updated_at: dbcon().fn.now()
                    });
                }
            });
        } catch (err) {
            await dbcon()('OPT_KV').where({ key: 'SYNC_STATUS' }).update({
                value: JSON.stringify({
                    error: {
                        message: 'Failed to send data to remote',
                        exception: err
                    }
                }),
                updated_at: dbcon().fn.now()
            });
        }
        return Promise.resolve();

        // const tables = [
        //     'ADVERSE_EVENT_MEDDRA',
        //     'CLINICAL_EVENTS',
        //     'CLINICAL_EVENTS_DATA',
        //     'LOG_ACTIONS',
        //     'MEDICAL_HISTORY',
        //     'ORDERED_TESTS',
        //     'PATIENTS',
        //     'PATIENT_DEMOGRAPHICS',
        //     'PATIENT_DIAGNOSIS',
        //     'PATIENT_IMMUNISATION',
        //     'PATIENT_PII',
        //     'PATIENT_PREGNANCY',
        //     'TEST_DATA',
        //     'TREATMENTS',
        //     'TREATMENTS_INTERRUPTIONS',
        //     'USERS',
        //     'VISITS',
        //     'VISIT_DATA',
        //     'VISIT_REPORT'
        // ];
    }
}

export default SyncCore;