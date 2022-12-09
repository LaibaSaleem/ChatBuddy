var router = require('express').Router();
var mongoose = require('mongoose');
var Chat = mongoose.model('Chat');
var User = mongoose.model('User');
var auth = require('../auth');

// Get all chats
router.get('/', auth.required, function(req, res, next) {
    Chat.find()
        .populate('user')
        .then(function(chats) {
            return res.json({chats: chats});
        }).catch(next);
});

// Get chat by id
router.get('/:id', auth.required, function(req, res, next) {
    Chat.findById(req.params.id)
        .populate('user')
        .then(function(chat) {
            if (!chat) { return res.sendStatus(401); }
            return res.json({chat: chat});
        }).catch(next);
});

// Create new chat
router.post('/', auth.required, function(req, res, next) {
    User.findById(req.payload.id).then(function(user) {
        if (!user) { return res.sendStatus(401); }
        var chat = new Chat(req.body.chat);
        chat.user = user;
        return chat.save().then(function() {
            return res.json({chat: chat});
        });
    }).catch(next);
});

// Update chat
router.put('/:id', auth.required, function(req, res, next) {
    User.findById(req.payload.id).then(function(user) {
        if (req.chat.user._id.toString() === req.payload.id.toString()) {
            if (typeof req.body.chat.title !== 'undefined') {
                req.chat.title = req.body.chat.title;
            }
            if (typeof req.body.chat.description !== 'undefined') {
                req.chat.description = req.body.chat.description;
            }
            if (typeof req.body.chat.body !== 'undefined') {
                req.chat.body = req.body.chat.body;
            }
            if (typeof req.body.chat.tagList !== 'undefined') {
                req.chat.tagList = req.body.chat.tagList
            }
            req.chat.save().then(function(chat) {
                return res.json({chat: chat});
            }).catch(next);
        } else {
            return res.sendStatus(403);
        }
    });
});

// Delete chat
router.delete('/:id', auth.required, function(req, res, next) {
    User.findById(req.payload.id).then(function() {
        if (req.chat.user._id.toString() === req.payload.id.toString()) {
            return req.chat.remove().then(function() {
                return res.sendStatus(204);
            });
        } else {
            return res.sendStatus(403);
        }
    });
});

//export router
module.exports = router;

