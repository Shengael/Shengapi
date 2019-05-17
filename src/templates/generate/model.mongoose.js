const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const $Model$Schema = new Schema(
    {
    },
    {
        autoCreate: true,
        collection: '$Model$'
    }
);

class $Model$Class {

    constructor() {
    }
}

$Model$Schema.loadClass($Model$Class);
const $Model$ = mongoose.model('$Model$', $Model$Schema);

module.exports = $Model$;
