'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy, 
    FacebookStrategy = require('passport-facebook').Strategy,
    config = require('./config');

/**
 * Passport configuration
 */
passport.serializeUser(function(user, done) {
    done(null, user.id);
});
passport.deserializeUser(function(id, done) {
    User.findOne({
        _id: id
    }, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
        done(err, user);
    });
});

// add other strategies for more authentication flexibility
passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password' // this is the virtual field on the model
    },
    function(email, password, done) {
        User.findOne({
            email: email.toLowerCase()
        }, function(err, user) {
            if (err) return done(err);

            if (!user) {
                return done(null, false, {
                    message: 'This email is not registered.'
                });
            }
            if (!user.authenticate(password)) {
                return done(null, false, {
                    message: 'This password is not correct.'
                });
            }
            return done(null, user);
        });
    }
));

passport.use(new FacebookStrategy({
        clientID: '630865300320892',
        clientSecret: 'cac03e1da8d0140f4acbf16221f476fa',
        callbackURL: 'http://localhost:9000/api/auth/facebook/callback'
    },
    function(accessToken, refreshToken, profile, done) {
        console.log('this is called back');
        User.findOne({
            'facebook.id': profile.id
        }, function(err, user) {
            if (err) {
                return done(err);
            }
            console.log(user);
            console.log(profile);
            // console.log('1', profile._raw.name);
            // var arr = profile._raw.split(",");
            // console.log(arr);
            if (!user) {
                user = new User({
                    name: profile.displayName,
                    // email: profile.emails[0].value,
                    // username: profile.username
                    provider: 'facebook',
                    facebook: profile._json
                });
                user.save(function(err) {
                    if (err) console.log(err);
                    return done(err, user);
                });
            } else {
                return done(err, user);
            }
        });
    }
));

module.exports = passport;
