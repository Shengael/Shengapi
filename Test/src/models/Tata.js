const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TataSchema = new Schema({
    name: {
        type: String
    },
    age: {
        type: Number
    }
}, {
    autoCreate: true,
    collection: 'Tata'
});

class TataClass {

    constructor() {}
}

TataSchema.loadClass(TataClass);
const Tata = mongoose.model('Tata', TataSchema);

module.exports = Tata;