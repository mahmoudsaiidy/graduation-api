const validator = require('validator');
const mongoose = require('mongoose');
const S = mongoose.Schema;

const userSchema = new S({
    email: {
        required: true,
        type: String,
        unique: true,
        validate: [validator.isEmail, 'Field must be a valid email']
    },
    chat: {
        required: true,
        type: [
            {
            message: { type: String, required: true },
            response: { type: String, required: true }
            }
        ]
    }
});

module.exports = mongoose.model('Chat', userSchema);
