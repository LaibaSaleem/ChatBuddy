const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    chat: {
        type: Schema.Types.ObjectId,
        ref: 'Chat'
    },

    message: {
        type: String,
        required: true
    },

    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Message', messageSchema);
