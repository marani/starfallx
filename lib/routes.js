'use strict';

var api = require('./controllers/api'),
    index = require('./controllers'),
    users = require('./controllers/users'),
    session = require('./controllers/session'),
    middleware = require('./middleware'),
    course = require('./controllers/course');
/**
 * Application routes
 */
module.exports = function(app) {

    // Server API Routes

    app.route('/api/users')
        .post(users.create)
        .put(users.changePassword);
    app.route('/api/users/me')
        .get(users.me);
    app.route('/api/users/:id')
        .get(users.show);

    app.route('/api/auth/local/login')
        .post(session.login);

    app.route('/api/auth/facebook/callback')
        .get(session.loginFbDone);
    app.route('/api/auth/facebook')
        .get(session.loginFbStart);

    app.route('/api/auth/logout')
        .post(session.logout);

    app.route('/api/course/update/:year/:sem/:hash')
        .post(course.update);

    app.route('/api/course/:year/:sem/:code')
        .get(course.get);

    // search

    // All undefined api routes should return a 404
    app.route('/api/*')
        .get(function(req, res) {
            res.send(404);
        });

    // All other routes to use Angular routing in app/scripts/app.js
    app.route('/partials/*')
        .get(index.partials);
    app.route('/*')
        .get(middleware.setUserCookie, index.index);
};
