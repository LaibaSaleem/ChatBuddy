const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },

    socialAccounts: [{
        type: Schema.Types.ObjectId,
        ref: 'SocialAccount'
    }],

    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },

    friends: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],

    chats: [{
        type: Schema.Types.ObjectId,
        ref: 'Chat'
    }],

    emotion: {
        type: Schema.Types.ObjectId,
        ref: 'Emotion'
    },
    sentiments: [{
        type: Schema.Types.ObjectId,
        ref: 'Sentiment'
    }]
});

module.exports = mongoose.model('User', userSchema);
