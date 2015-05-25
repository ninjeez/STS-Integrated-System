'use strict';

var _ = require('lodash'),
    errorHandler = require('../errors.server.controller'),
    mongoose = require('mongoose'),
    User = mongoose.model('User');

/*
 * User-Instance middleware
 */
exports.userByNetId = function(req, res, next, username) {
    User.findOne({
        username: username
    }).exec(function(err, user) {
        if (err) return next(err);

        if (!user) req.profile = null;
        else       req.profile = user;
        next();
    });
};

/*
 * Validation
 */
exports.validateNetId = function(req, res){
    var user = req.profile;

    if(!user)
        res.jsonp( { status : 'Not found', user : user });
    else{
        user.provider = undefined;
        user.password = undefined;
        user.roles = undefined;
        res.jsonp( { status : 'Found', user : user });
    }

};
