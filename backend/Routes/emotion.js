var router = require('express').Router();
var mongoose = require('mongoose');
var Emotion = mongoose.model('Emotion');
var User = mongoose.model('User');

// Get all emotions
router.get('/', function(req, res, next) {
    Emotion.find()
        .populate('user')
        .then(function(emotions) {
            return res.json({emotions: emotions});
        }).catch(next);
});

// Get emotion by id
router.get('/:id', function(req, res, next) {
    Emotion.findById(req.params.id)
        .populate('user')
        .then(function(emotion) {
            if (!emotion) { return res.sendStatus(401); }
            return res.json({emotion: emotion});
        }).catch(next);
});

// Create new emotion
router.post('/', function(req, res, next) {
    User.findById(req.payload.id).then(function(user) {
        if (!user) { return res.sendStatus(401); }
        var emotion = new Emotion(req.body.emotion);
        emotion.user = user;
        return emotion.save().then(function() {
            return res.json({emotion: emotion});
        });
    }).catch(next);
});

// Update emotion
router.put('/:id', function(req, res, next) {
    User.findById(req.payload.id).then(function(user) {
        if (req.emotion.user._id.toString() === req.payload.id.toString()) {
            if (typeof req.body.emotion.emotion !== 'undefined') {
                req.emotion.emotion = req.body.emotion.emotion;
            }
            req.emotion.save().then(function(emotion) {
                return res.json({emotion: emotion});
            }).catch(next);
        } else {
            return res.sendStatus(403);
        }
    });
});

// Delete emotion
router.delete('/:id', function(req, res, next) {
    User.findById(req.payload.id).then(function() {
        if (req.emotion.user._id.toString() === req.payload.id.toString()) {
            return req.emotion.remove().then(function() {
                return res.sendStatus(204);
            });
        } else {
            return res.sendStatus(403);
        }
    });
});

// Middleware for routes with :id
router.param('id', function(req, res, next, id) {
    Emotion.findById(id, function(err, emotion) {
        if (err) { return next(err); }
        if (!emotion) { return res.sendStatus(401); }
        req.emotion = emotion;
        return next();
    });
});

module.exports = router;
