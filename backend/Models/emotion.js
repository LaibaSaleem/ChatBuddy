const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const emotionSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    emotion: {
        type: String,
        required: true
    },

    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Emotion', emotionSchema);