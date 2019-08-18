import drugs_v1 from './defaults_v1/drugs.json';
import drugs_v4 from './defaults_v4/drugs.json';

export const TABLE_NAME = 'AVAILABLE_DRUGS';
export const PRIORITY = 0;
export default async (dbcon, version) => {
    switch (version) {
        case 1:
            await dbcon().schema.createTable(TABLE_NAME, (table) => {
                table.increments('id').primary();
                table.text('name').notNullable();
                table.text('module').nullable();
                table.text('deleted').notNullable().defaultTo('-');
                table.unique(['name', 'module', 'deleted'], `UNIQUE_${Date.now()}_${TABLE_NAME}`);
            });
            await dbcon()(TABLE_NAME).insert(drugs_v1);
            break;
        case 4:
            await dbcon()(TABLE_NAME)
                .where('module', 'Disease Modifying')
                .update({ 'deleted': `0@${(new Date()).getTime()}` });
            await dbcon()(TABLE_NAME).insert(drugs_v4);
            break;
        default:
            break;
    }
};