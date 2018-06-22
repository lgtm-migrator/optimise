
exports.up = function(knex, Promise) {
    return knex.schema.createTable('ETHNICITIES', function(table){
        table.increments('id').primary().notNullable();
        table.text('value').notNullable();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('ETNICITIES');
};
