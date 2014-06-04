'use strict';

var mongoose = require('mongoose'),
    passport = require('passport');

/**
 * Logout
 */
exports.logout = function(req, res) {
    req.logout();
    res.send(200);
};

/**
 * Login Local
 */
exports.login = function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        var error = err || info;
        if (error) return res.json(401, error);

        req.logIn(user, function(err) {

            if (err) return res.send(err);
            res.json(req.user.userInfo);
        });
    })(req, res, next);
};

/**
 * Initialize login flow
 */
exports.loginFbStart = passport.authenticate('facebook');

/**
 * Finishing login flow, Facebook callbacks this handler,
 * this handler will call the 'validationfn' defined inside
 * passport.use ('facebok', validationfn) at config
 */
exports.loginFbDone = passport.authenticate(
    'facebook', { 
        successRedirect: '/',
        failureRedirect: '/login' 
    });