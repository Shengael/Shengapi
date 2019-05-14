const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TTuserSchema = new Schema(
    {
    },
    {
        autoCreate: true,
        collection: 'TTuser'
    }
);

class TTuserClass {

    constructor() {
    }
}

TTuserSchema.loadClass(TTuserClass);
const TTuser = mongoose.model('TTuser', TTuserSchema);

module.exports = TTuser;
