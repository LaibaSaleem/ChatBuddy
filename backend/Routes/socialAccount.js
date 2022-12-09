var router = require('express').Router();
var mongoose = require('mongoose');
var SocialAccount = mongoose.model('SocialAccount');
var User = mongoose.model('User');

// Get all social accounts
router.get('/', function(req, res, next) {
    SocialAccount.find()
        .populate('user')
        .then(function(socialAccounts) {
            return res.json({socialAccounts: socialAccounts});
        }).catch(next);
});

// Get social account by id
router.get('/:id', function(req, res, next) {
    SocialAccount.findById(req.params.id)
        .populate('user')
        .then(function(socialAccount) {
            if (!socialAccount) { return res.sendStatus(401); }
            return res.json({socialAccount
: socialAccount});
        }).catch(next);
});

// Create new social account
router.post('/', function(req, res, next) {
    User.findById(req.payload.id).then(function(user) {
        if (!user) { return res.sendStatus(401); }
        var socialAccount = new SocialAccount(req.body.socialAccount);
        socialAccount.user = user;
        return socialAccount.save().then(function() {
            return res.json({socialAccount: socialAccount});
        });
    }).catch(next);
});

// Update social account
router.put('/:id', function(req, res, next) {
    User.findById(req.payload.id).then(function(user) {
        if (req.socialAccount.user._id.toString() === req.payload.id.toString()) {
            if (typeof req.body.socialAccount.socialAccount !== 'undefined') {
                req.socialAccount.socialAccount = req.body.socialAccount.socialAccount;
            }
            req.socialAccount.save().then(function(socialAccount) {
                return res.json({socialAccount: socialAccount});
            }).catch(next);
        } else {
            return res.sendStatus(403);
        }
    });
});

// Delete social account
router.delete('/:id', function(req, res, next) {
    User.findById(req.payload.id).then(function() {
        if (req.socialAccount.user._id.toString() === req.payload.id.toString()) {
            return req.socialAccount.remove().then(function() {
                return res.sendStatus(204);
            });
        } else {
            return res.sendStatus(403);
        }
    });
});

// Preload social account objects on routes with ':socialAccount'
router.param('socialAccount', function(req, res, next, id) {
    SocialAccount.findById(id).then(function(socialAccount) {
        if (!socialAccount) { return res.sendStatus(401); }
        req.socialAccount = socialAccount;
        return next();
    }).catch(next);
});

module.exports = router;