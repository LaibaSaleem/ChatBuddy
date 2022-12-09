var router = require('express').Router();
var mongoose = require('mongoose');
var Sentiment = mongoose.model('Sentiment');
var User = mongoose.model('User');

// Get all sentiments
router.get('/', function(req, res, next) {
    Sentiment.find()
        .populate('user')
        .then(function(sentiments) {
            return res.json({sentiments: sentiments});
        }).catch(next);
});

// Get sentiment by id
router.get('/:id', function(req, res, next) {
    Sentiment.findById(req.params.id)
        .populate('user')
        .then(function(sentiment) {
            if (!sentiment) { return res.sendStatus(401); }
            return res.json({sentiment: sentiment});
        }).catch(next);
});

// Create new sentiment
router.post('/', function(req, res, next) {
    User.findById(req.payload.id).then(function(user) {
        if (!user) { return res.sendStatus(401); }
        var sentiment = new Sentiment(req.body.sentiment);
        sentiment.user = user;
        return sentiment.save().then(function() {
            return res.json({sentiment: sentiment});
        });
    }).catch(next);
});

// Update sentiment
router.put('/:id', function(req, res, next) {
    User.findById(req.payload.id).then(function(user) {
        if (req.sentiment.user._id.toString() === req.payload.id.toString()) {
            if (typeof req.body.sentiment.sentiment !== 'undefined') {
                req.sentiment.sentiment = req.body.sentiment.sentiment;
            }
            req.sentiment.save().then(function(sentiment) {
                return res.json({sentiment: sentiment});
            }).catch(next);
        } else {
            return res.sendStatus(403);
        }
    });
});

// Delete sentiment
router.delete('/:id', function(req, res, next) {
    User.findById(req.payload.id).then(function() {
        if (req.sentiment.user._id.toString() === req.payload.id.toString()) {
            return req.sentiment.remove().then(function() {
                return res.sendStatus(204);
            });
        } else {
            return res.sendStatus(403);
        }
    });
});

// Middleware for routes with :id
router.param('id', function(req, res, next, id) {
    Sentiment.findById(id, function(err, sentiment) {
        if (err) { return next(err); }
        if (!sentiment) { return res.sendStatus(401); }
        req.sentiment = sentiment;
        return next();
    });
});

module.exports = router;