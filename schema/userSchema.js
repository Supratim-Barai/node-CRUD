const mongoose = require('mongoose');

//const Schema = mongoose.Schema;

const User = new mongoose.Schema({
    firstname: { type: String, default: '', required: true },
    lastname: { type: String, default: '', required: true },
    email: { type: String, default: '', unique: true, required: true },
    password: { type: String, default: '', required: true },
    myproducts: [
        {
            name: { type: String, require: true },
            availablefrom: { type: Date, require: true },
            availableto: { type: Date, require: true }
        }]
});

const UserModel = mongoose.model('user', User);

module.exports = UserModel;