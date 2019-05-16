const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TbtbSchema = new Schema({
    name: {
        type: String
    },
    age: {
        type: Number
    }
}, {
    autoCreate: true,
    collection: 'Tbtb'
});

class TbtbClass {

    constructor() {}
}

TbtbSchema.loadClass(TbtbClass);
const Tbtb = mongoose.model('Tbtb', TbtbSchema);

module.exports = Tbtb;
