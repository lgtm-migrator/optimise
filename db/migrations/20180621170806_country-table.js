exports.up = function (knex) {
    return knex.schema.createTable('COUNTRIES', function (table) {
        table.increments('id').primary().notNullable();
        table.text('value').notNullable();
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('COUNTRIES');
};
