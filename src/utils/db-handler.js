/*eslint no-console: "off"*/
const knex = require('./db-connection');
const fs = require('fs');

function migrate(type){
    switch (type) {
        case 'testing':
            knex.migrate.latest({ directory: './db/migrations' })
                .then(() => knex.seed.run({ directory: './db/seed' }))
                .then(() => knex.seed.run({ directory: './db/exampleDataForTesting/seed' }))
                .then(() => { if (process.env.NODE_ENV !== 'PROD') console.log('CREATED DATABASE AND POPULATED WITH MS MODULES AND TESTING DATA'); })
                .then(() => knex.destroy())
                .catch(err => { console.log(err); knex.destroy(); });
            break;
        case  'MS_fields':
            knex.migrate.latest({ directory: './db/migrations' })
                .then(() => knex.seed.run({ directory: './db/seed' }))
                .then(() => { if (process.env.NODE_ENV !== 'PROD') console.log('CREATED DATABASE AND POPULATED WITH MS MODULES'); })
                .then(() => knex.destroy())
                .catch(err => { console.log(err); knex.destroy(); });
            break;
        case 'bare':
            knex.migrate.latest({ directory: './db/migrations' })
                .then(() => { if (process.env.NODE_ENV !== 'PROD') console.log('CREATED DATABASE WITH BARE SCHEMA'); })
                .then(() => knex.destroy())
                .catch(err => { console.log(err); knex.destroy(); });
            break ;
        default:
            throw TypeError('Wrong parameter used');
    }
}

function eraseRuntime() {
    knex.destroy()
        .catch(err => { console.log(err); });
}

function erase() {
    let filename = knex.client.config.connection.filename;
    if (fs.existsSync(filename))
        fs.unlinkSync(filename);
}

exports.migrateAndSeed = (type) => {
    migrate(type);
};

exports.destroyAndMigrate = (type) => {
    eraseRuntime();
    migrate(type);
};

exports.destroyConnection = () => {
    knex.destroy();
};

exports.eraseAndMigrate = (type) => {
    erase();
    migrate(type);
};

exports.eraseDatabase = () => {
    erase();
};
