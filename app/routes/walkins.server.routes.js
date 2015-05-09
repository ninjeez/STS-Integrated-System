'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var walkins = require('../../app/controllers/walkins.server.controller');

	// Walkins Routes
	app.route('/walkins')
		.get(walkins.list)
		.post(users.requiresLogin, walkins.create);

	app.route('/walkins/:walkinId')
		.get(walkins.read)
		.put(users.requiresLogin, walkins.hasAuthorization, walkins.update)
		.delete(users.requiresLogin, walkins.hasAuthorization, walkins.delete);

	// Finish by binding the Walkin middleware
	app.param('walkinId', walkins.walkinByID);
};