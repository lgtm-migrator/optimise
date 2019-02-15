export const TABLE_NAME = 'TEST_DATA';
export const PRIORITY = 4;
export default async (dbcon, version) => {
    switch (version) {
        case 1:
            if (await dbcon.schema.hasTable(TABLE_NAME) === true)
                await dbcon.schema.renameTable(TABLE_NAME, `ARCHIVE_${Date.now()}_${TABLE_NAME}`);
            await dbcon.schema.createTable(TABLE_NAME, (table) => {
                table.increments('id').primary();
                table.integer('test').notNullable().references('id').inTable('ORDERED_TESTS').onDelete('CASCADE');
                table.integer('field').notNullable().references('id').inTable('AVAILABLE_FIELDS_TESTS');
                table.text('value').notNullable();
                table.text('createdTime').notNullable().defaultTo(dbcon.fn.now());
                table.integer('createdByUser').notNullable().references('id').inTable('USERS');
                table.text('deleted').notNullable().defaultTo('-');
                table.unique(['test', 'field', 'deleted'], `UNIQUE_${Date.now()}_${TABLE_NAME}`);
            });
            break;
        default:
            break;
    }
};