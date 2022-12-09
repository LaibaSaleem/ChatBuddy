const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sentimentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    sentiment: {
        type: String,
        required: true
    },

    rationale: {
        type: String,
        required: true
    },

    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Sentiment', sentimentSchema);