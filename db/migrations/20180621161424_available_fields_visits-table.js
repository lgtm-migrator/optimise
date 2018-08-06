exports.up = (knex) => knex.schema.createTable('AVAILABLE_FIELDS_VISITS', (table) => {
    table.increments('id').primary();
    table.text('definition').notNullable();
    table.text('idname').notNullable();
    table.integer('section').notNullable().references('id').inTable('AVAILABLE_VISIT_SECTIONS');
    table.text('subsection').nullable();
    table.integer('type').notNullable().references('id').inTable('TYPES');
    table.text('unit').nullable();
    table.text('module').nullable();
    table.text('permittedValues').nullable();
    table.text('labels').nullable();
    table.integer('referenceType').notNullable().references('id').inTable('AVAILABLE_VISIT_TYPES');
    table.text('laterality').nullable();
    table.text('cdiscName').nullable();
    table.text('deleted').notNullable().defaultTo('-');
    table.unique(['idname', 'type', 'unit', 'module', 'deleted']);
});

exports.down = (knex) => knex.schema.dropTable('AVAILABLE_FIELDS_VISITS');
