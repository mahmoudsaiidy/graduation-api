const validator = require('validator');
const mongoose = require('mongoose');
const { type } = require('os');
const S = mongoose.Schema;

const userSchema = new S({
    email: {
        required: true,
        type: String,
        unique: true, validate: [validator.isEmail, 'Field must be a valid email']
    },
    password: {
        required: true,
        type: String 
    },
});


module.exports = mongoose.model('User', userSchema);