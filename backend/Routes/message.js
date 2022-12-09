var router = require('express').Router();
var mongoose = require('mongoose');

var Message = mongoose.model('Message');
var Chat = mongoose.model('Chat');
var User = mongoose.model('User');

var auth = require('../auth');

// Get all messages
router.get('/', auth.required, function(req, res, next) {
    Message.find()
        .populate('user')
        .then(function(messages) {
            return res.json({messages: messages});
        }).catch(next);
});

// Get message by id
router.get('/:id', auth.required, function(req, res, next) {
    Message.findById(req.params.id)
        .populate('user')
        .then(function(message) {
            if (!message) { return res.sendStatus(401); }
            return res.json({message: message});
        }).catch(next);
});

// Create new message
router.post('/', auth.required, function(req, res, next) {
    User.findById(req.payload.id).then(function(user) {
        if (!user) { return res.sendStatus(401); }
        var message = new Message(req.body.message);
        message.user = user;
        return message.save().then(function() {
            return res.json({message: message});
        });
    }).catch(next);
});

// Update message
router.put('/:id', auth.required, function(req, res, next) {
    User.findById(req.payload.id).then(function(user) {
        if (req.message.user._id.toString() === req.payload.id.toString()) {
            if (typeof req.body.message.title !== 'undefined') {
                req.message.title = req.body.message.title;
            }
            if (typeof req.body.message.description !== 'undefined') {
                req.message.description = req.body.message.description;
            }
            if (typeof req.body.message.body !== 'undefined') {
                req.message.body = req.body.message.body;
            }
            if (typeof req.body.message.tagList !== 'undefined') {
                req.message.tagList = req.body.message.tagList
            }
            req.message.save().then(function(message) {
                return res.json({message: message});
            }).catch(next);
        } else {
            return res.sendStatus(403);
        }
    });
});

// Delete message
router.delete('/:id', auth.required, function(req, res, next) {
    User.findById(req.payload.id).then(function() {
        if (req.message.user._id.toString() === req.payload.id.toString()) {
            return req.message.remove().then(function() {
                return res.sendStatus(204);
            });
        } else {
            return res.sendStatus(403);
        }
    });
});

// Favorite message
router.post('/:id/favorite', auth.required, function(req, res, next) {
    var messageId = req.message._id;
    User.findById(req.payload.id).then(function(user) {
        if (!user) { return res.sendStatus(401); }
        return user.favorite(messageId).then(function() {
            return req.message.updateFavoriteCount().then(function(message) {
                return res.json({message: message});
            });
        });
    }).catch(next);
});


// Unfavorite message
router.delete('/:id/favorite', auth.required, function(req, res, next) {
    var messageId = req.message._id;
    User.findById(req.payload.id).then(function(user) {
        if (!user) { return res.sendStatus(401); }
        return user.unfavorite(messageId).then(function() {
            return req.message.updateFavoriteCount().then(function(message) {
                return res.json({message: message});
            });
        });
    }).catch(next);
});

// Get all messages by user
router.get('/feed', auth.required, function(req, res, next) {
    var limit = 20;
    var offset = 0;
    if (typeof req.query.limit !== 'undefined') {
        limit = req.query.limit;
    }
    if (typeof req.query.offset !== 'undefined') {
        offset = req.query.offset;
    }
    User.findById(req.payload.id).then(function(user) {
        if (!user) { return res.sendStatus(401); }
        Promise.all([
            Message.find({user: {$in: user.following}})
                .limit(Number(limit))
                .skip(Number(offset))
                .populate('user')
                .exec(),
            Message.count({user: {$in: user.following}})
        ]).then(function(results) {
            var messages = results[0];
            var messagesCount = results[1];
            return res.json({
                messages: messages,
                messagesCount: messagesCount
            });
        }).catch(next);
    });
});


// Preload message object on routes with ':message' 
router.param('message', function(req, res, next, id) {
    Message.findById(id).then(function(message) {
        if (!message) { return res.sendStatus(404); }
        req.message = message;
        return next();
    }
    ).catch(next);
});

module.exports = router;
