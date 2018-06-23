
exports.up = function(knex, ignore) {
    return knex.schema.createTable('AVAILABLE_FIELDS_CE', function(table) {
        table.increments('id').primary();
        table.text('definition').notNullable();
        table.text('idname').notNullable();
        table.integer('type').notNullable().references('id').inTable('TYPES');
        table.text('unit').nullable();
        table.text('module').nullable();
        table.text('permittedValues').nullable();
        table.text('referenceType').notNullable().references('id').inTable('AVAILABLE_CLINICAL_EVENT_TYPES');
        table.text('deleted').notNullable().defaultTo('-');
    });
};

exports.down = function(knex, ignore) {
    return knex.schema.dropTable('AVAILABLE_FIELDS_CE');
};
