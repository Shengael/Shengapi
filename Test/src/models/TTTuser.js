const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TTTuserSchema = new Schema(
    {
    },
    {
        autoCreate: true,
        collection: 'TTTuser'
    }
);

class TTTuserClass {

    constructor() {
    }
}

TTTuserSchema.loadClass(TTTuserClass);
const TTTuser = mongoose.model('TTTuser', TTTuserSchema);

module.exports = TTTuser;
