var router = require('express').Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Chat = mongoose.model('Chat');
var Message = mongoose.model('Message');
var Emotion = mongoose.model('Emotion');
var Sentiment = mongoose.model('Sentiment');
var auth = require('../auth');

// Get all users
router.get('/', auth.required, function(req, res, next) {
    User.find()
        .then(function(users) {
            return res.json({users: users});
        }).catch(next);
});

// Get user by id
router.get('/:id', auth.required, function(req, res, next) {
    User.findById(req.params.id)
        .then(function(user) {
            if (!user) { return res.sendStatus(401); }
            return res.json({user: user});
        }).catch(next);
});

// Create new user
router.post('/', auth.required, function(req, res, next) {
    var user = new User(req.body.user);
    return user.save().then(function() {
        return res.json({user: user});
    }).catch(next);
});

// Update user
router.put('/:id', auth.required, function(req, res, next) {
    User.findById(req.payload.id).then(function(user) {
        if (req.user._id.toString() === req.payload.id.toString()) {
            if (typeof req.body.user.username !== 'undefined') {
                req.user.username = req.body.user.username;
            }
            if (typeof req.body.user.email !== 'undefined') {
                req.user.email = req.body.user.email;
            }
            if (typeof req.body.user.bio !== 'undefined') {
                req.user.bio = req.body.user.bio;
            }
            if (typeof req.body.user.image !== 'undefined') {
                req.user.image = req.body.user.image;
            }
            if (typeof req.body.user.password !== 'undefined') {
                req.user.setPassword(req.body.user.password);
            }
            req.user.save().then(function(user) {
                return res.json({user: user});
            }).catch(next);
        } else {
            return res.sendStatus(403);
        }
    });
});

// Delete user
router.delete('/:id', auth.required, function(req, res, next) {
    User.findById(req.payload.id).then(function() {
        if (req.user._id.toString() === req.payload.id.toString()) {
            return req.user.remove().then(function() {
                return res.sendStatus(204);
            });
        } else {
            return res.sendStatus(403);
        }
    });
});

// Login user
router.post('/login', function(req, res, next) {
    if (!req.body.user.email) {
        return res.status(422).json({errors: {email: "can't be blank"}});
    }
    if (!req.body.user.password) {
        return res.status(422).json({errors: {password: "can't be blank"}});
    }
    passport.authenticate('local', {session: false}, function(err, user, info) {
        if (err) { return next(err); }
        if (user) {
            user.token = user.generateJWT();
            return res.json({user: user});
        } else {
            return res.status(422).json(info);
        }
    })(req, res, next);
});

// Get user's chats
router.get('/:id/chats', auth.required, function(req, res, next) {
    User.findById(req.params.id)
        .then(function(user) {
            if (!user) { return res.sendStatus(401); }
            return res.json({chats: user.chats});
        }).catch(next);
});

// Get user's emotions
router.get('/:id/emotions', auth.required, function(req, res, next) {
    User.findById(req.params.id)
        .then(function(user) {
            if (!user) { return res.sendStatus(401); }
            return res.json({emotions: user.emotions});
        }).catch(next);
});

// Get user's sentiments
router.get('/:id/sentiments', auth.required, function(req, res, next) {
    User.findById(req.params.id)
        .then(function(user) {
            if (!user) { return res.sendStatus(401); }
            return res.json({sentiments: user.sentiments});
        }).catch(next);
});

// Get user's messages
router.get('/:id/messages', auth.required, function(req, res, next) {
    User.findById(req.params.id)
        .then(function(user) {
            if (!user) { return res.sendStatus(401); }
            return res.json({messages: user.messages});
        }).catch(next);
});

// Get user's friends
router.get('/:id/friends', auth.required, function(req, res, next) {
    User.findById(req.params.id)
        .then(function(user) {
            if (!user) { return res.sendStatus(401); }
            return res.json({friends: user.friends});
        }).catch(next);
});


// Add friend
router.post('/:id/friends', auth.required, function(req, res, next) {
    User.findById(req.params.id)
        .then(function(user) {
            if (!user) { return res.sendStatus(401); }
            user.friends.push(req.body.friend);
            user.save().then(function(user) {
                return res.json({friends: user.friends});
            }).catch(next);
        }).catch(next);
});

// Remove friend
router.delete('/:id/friends', auth.required, function(req, res, next) {
    User.findById(req.params.id)
        .then(function(user) {
            if (!user) { return res.sendStatus(401); }
            user.friends.remove(req.body.friend);
            user.save().then(function(user) {
                return res.json({friends: user.friends});
            }).catch(next);
        }).catch(next);
});


// Get user's emotions
router.get('/:id/emotions', auth.required, function(req, res, next) {
    User.findById(req.params.id)
        .then(function(user) {
            if (!user) { return res.sendStatus(401); }
            return res.json({emotions: user.emotions});
        }).catch(next);
});

// Get user's sentiments
router.get('/:id/sentiments', auth.required, function(req, res, next) {
    User.findById(req.params.id)
        .then(function(user) {
            if (!user) { return res.sendStatus(401); }
            return res.json({sentiments: user.sentiments});
        }).catch(next);
});

// post user's sentiments
router.post('/:id/sentiments', auth.required, function(req, res, next) {
    User.findById(req.params.id)
        .then(function(user) {
            if (!user) { return res.sendStatus(401); }
            user.sentiments.push(req.body.sentiment);
            user.save().then(function(user) {
                return res.json({sentiments: user.sentiments});
            }).catch(next);
        }).catch(next);
});


module.exports = router;
