//External node module imports
import express from 'express';

import expressSession from 'express-session';
import mongoSessionConnect from 'connect-mongo';
// import swaggerUi from 'swagger-ui-express';
// import swaggerDocument from '../docs/swagger.json';
import body_parser from 'body-parser';
import passport from 'passport';
import optimiseOptions from './core/options';
import dbcon from './utils/db-connection';
import { migrate } from '../src/utils/db-handler';
import ErrorHelper from './utils/error_helper';

const mongoSession = mongoSessionConnect(expressSession);
class OptimiseSyncServer {
    constructor(config) {
        this.config = new optimiseOptions(config);
        this.app = express();

        // Define config in global scope (needed for server extensions)
        global.config = this.config;

        // Configure EXPRESS.JS router
        // Remove unwanted express headers
        this.app.set('x-powered-by', false);
        // Allow CORS requests when enabled
        if (this.config.enableCors === true) {
            this.app.use((__unused__req, res, next) => {
                res.header('Access-Control-Allow-Origin', '*');
                res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
                next();
            });
        }
    }

    /**
     * @fn start
     * @desc Start the OptimiseServer service, routes are setup and
     * automatic status update is triggered.
     * @return {Promise} Resolve to a native Express.js router ready to use on success.
     * In case of error, an ErrorStack is rejected.
     */
    start() {
        let _this = this;
        return new Promise((resolve, reject) => {

            // Operate database migration if necessary
            migrate().then(async () => {

                // This is awaiting for #286
                // _this.app.use('/documentation', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

                // Setup sessions with third party middleware
                const mongoSessionStore = new mongoSession({
                    client: await dbcon(),
                    collection: 'SESSIONS'
                })

                _this.app.use(expressSession({
                    secret: _this.config.sessionSecret,
                    saveUninitialized: false,
                    resave: false,
                    cookie: { secure: false },
                    store: mongoSessionStore
                }));

                _this.app.use(passport.initialize());
                _this.app.use(passport.session());

                // Keeping a pointer to the original mounting point of the server
                _this.app.use((req, __unused__res, next) => {
                    req.optimiseRootUrl = req.baseUrl;
                    next();
                });

                // Init third party middleware for parsing HTTP requests body
                _this.app.use(body_parser.urlencoded({
                    extended: true
                }));
                _this.app.use(body_parser.json());

                // Setup remaining route using controllers
                _this.setupSync();

                _this.app.all('/*', (__unused__req, res) => {
                    res.status(400);
                    res.json(ErrorHelper('Bad request'));
                });

                // Return the Express application
                return resolve(_this.app);

            }).catch(err => reject(err));
        });
    }

    /**
     * @fn stop
     * @desc Stops the optimise server service. After a call to stop, all references on the
     * express router MUST be released and this service endpoints are expected to fail.
     * @return {Promise} Resolve to true on success, ErrorStack otherwise
     */
    stop() {
        return dbcon().then(client => client.close());
    }

    /**
     * @fn setupSync
     * @desc Initialize the synchronization related routes
     */
    setupSync() {
        // Import the controller
        this.routeSync = require('./routes/syncRoute').default;

        // Modules
        this.app.use('/sync', this.routeSync);
    }
}

export default OptimiseSyncServer;