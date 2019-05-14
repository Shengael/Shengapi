const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TTTTuserSchema = new Schema(
    {
    },
    {
        autoCreate: true,
        collection: 'TTTTuser'
    }
);

class TTTTuserClass {

    constructor() {
    }
}

TTTTuserSchema.loadClass(TTTTuserClass);
const TTTTuser = mongoose.model('TTTTuser', TTTTuserSchema);

module.exports = TTTTuser;
