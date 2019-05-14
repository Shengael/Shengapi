const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tataSchema = new Schema(
    {
    },
    {
        autoCreate: true,
        collection: 'tata'
    }
);

class tataClass {

    constructor() {
    }
}

tataSchema.loadClass(tataClass);
const tata = mongoose.model('tata', tataSchema);

module.exports = tata;
