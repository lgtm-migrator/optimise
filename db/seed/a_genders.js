exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('GENDERS').del()
        .then(function () {
            // Inserts seed entries
            return knex('GENDERS').insert([
                { value: 'male' },
                { value: 'female' },
                { value: 'other' },
                { value: 'prefer not to say' }
            ]);
        });
};
