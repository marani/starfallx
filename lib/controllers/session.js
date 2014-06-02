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
 * Login
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
 * User initialize FB Login Flow
 */
exports.loginFbStart = passport.authenticate('facebook');

/*
 * Finishing login flow, Facebook callbacks this handler
 */
// exports.loginFbDone = function(req, res, next) {
//     passport.authenticate('facebook' , function(err, user, info) {
//         var error = err || info;
//         if (error) return res.json(401, error);

//         req.login(user, function(err) {
//             if (err) return res.send(err);
//             console.log(req.user.userInfo);
//             res.json(req.user.userInfo);
//         })
//     })(req, res, next);
// }
exports.loginFbDone = passport.authenticate(
    'facebook', { 
        successRedirect: '/',
        failureRedirect: '/login' 
    });