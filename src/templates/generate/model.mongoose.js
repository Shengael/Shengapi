const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const $modelName$Schema = new Schema(
    {
    },
    {
        autoCreate: true,
        collection: '$models$'
    }
);

const $modelName$ = mongoose.model('$modelName$', $modelName$Schema);

module.exports = $modelName$;