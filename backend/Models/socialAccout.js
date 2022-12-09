const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const socialAccountSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    socialAccount: {
        type: String,
        required: true
    },

    platform: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('SocialAccount', socialAccountSchema);
