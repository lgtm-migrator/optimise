/*eslint no-unused-vars: "off"*/

exports.up = function(knex, Promise) {
    return knex.schema.createTable('PATIENT_PREGNANCY', function(table) {
        table.increments('id').primary();
        table.integer('patient').notNullable().references('id').inTable('PATIENTS');
        table.text('startDate');
        table.integer('outcome').notNullable().references('id').inTable('PREGNANCY_OUTCOMES');
        table.text('outcomeDate');
        table.text('createdTime').notNullable().defaultTo(knex.fn.now());
        table.integer('createdByUser').notNullable().references('id').inTable('USERS');
        table.text('deleted').notNullable().defaultTo('-');
        table.unique(['patient', 'startDate', 'deleted']);
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('PATIENT_PREGNANCY');
};