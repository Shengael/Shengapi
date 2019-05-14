const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TotoSchema = new Schema(
    {
    },
    {
        autoCreate: true,
        collection: 'Toto'
    }
);

class TotoClass {

    constructor() {
    }
}

TotoSchema.loadClass(TotoClass);
const Toto = mongoose.model('Toto', TotoSchema);

module.exports = Toto;
