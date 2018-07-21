exports.up = function (knex) {
    return knex.schema.createTable('AVAILABLE_VISIT_TYPES', function (table) {
        table.increments('id').primary();
        table.text('name').notNullable();
        table.text('deleted').notNullable().defaultTo('-');
        table.unique(['name', 'deleted']);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('AVAILABLE_VISIT_TYPES');
};
