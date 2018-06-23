/*eslint no-unused-vars: "off"*/

exports.up = function(knex, ignore) {
    return knex.schema.createTable('RELATIONS', function(table){
        table.increments('id').primary().notNullable();
        table.text('value').notNullable();
    });
};

exports.down = function(knex, ignore) {
    return knex.schema.dropTable('RELATIONS');
};
