export const TABLE_NAME = 'RELATIONS';
export const PRIORITY = 0;
export default async (dbcon, version) => {
    switch (version) {
        case 1:
            if (await dbcon.schema.hasTable(TABLE_NAME) === true)
                await dbcon.schema.renameTable(TABLE_NAME, `ARCHIVE_${Date.now()}_${TABLE_NAME}`);
            await dbcon.schema.createTable(TABLE_NAME, (table) => {
                table.increments('id').primary().notNullable();
                table.text('value').notNullable();
                table.text('deleted').notNullable().defaultTo('-');
                table.unique(['value', 'deleted'], `UNIQUE_${Date.now()}_${TABLE_NAME}`);
            });
            return dbcon(TABLE_NAME).insert([
                { value: 'self' },
                { value: 'mother' },
                { value: 'father' },
                { value: 'sisters' },
                { value: 'brothers' },
                { value: 'zygotic twins' },
                { value: 'maternal grandparent' },
                { value: 'maternal cousin' },
                { value: 'maternal aunt/uncle' },
                { value: 'paternal grandparent' },
                { value: 'paternal cousin' },
                { value: 'paternal aunt/uncle' }
            ]);
        default:
            break;
    }
};