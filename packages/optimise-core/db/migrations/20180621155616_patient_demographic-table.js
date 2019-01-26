exports.up = (knex) => knex.schema.createTable('PATIENT_DEMOGRAPHIC', (table) => {
    table.increments('id').primary();
    table.integer('patient').notNullable().references('id').inTable('PATIENTS').onDelete('CASCADE');
    table.text('DOB').notNullable();
    table.integer('gender').notNullable().references('id').inTable('GENDERS');
    table.integer('dominantHand').notNullable().references('id').inTable('DOMINANT_HANDS');
    table.integer('ethnicity').notNullable().references('id').inTable('ETHNICITIES');
    table.integer('countryOfOrigin').notNullable().references('id').inTable('COUNTRIES');
    table.integer('alcoholUsage').notNullable().references('id').inTable('ALCOHOL_USAGE');
    table.integer('smokingHistory').notNullable().references('id').inTable('SMOKING_HISTORY');
    table.text('createdTime').notNullable().defaultTo(knex.fn.now());
    table.integer('createdByUser').notNullable().references('id').inTable('USERS');
    table.text('deleted').notNullable().defaultTo('-');
    table.unique(['patient', 'deleted']);
});

exports.down = (knex) => knex.schema.dropTable('PATIENT_DEMOGRAPHIC');