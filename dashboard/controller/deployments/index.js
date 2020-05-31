// include libraries
var superagent = require('superagent'),
	common = require('../../../helper/common'),
	requestDeployment = require('./requestDeployment'),
	editDeployment = require('./editDeployment'),
	viewDeployment = require('./viewDeployment'),
	deleteDeployment = require('./deleteDeployment'),
	updateDeployment = require('./updateDeployment');

// init settings
var ini = null;
exports.init = function(settings) {
	ini = settings;
};

exports.ini = function() {
	return ini;
};

// main landing page
exports.index = function(req, res) {

	//query
	var query = {
		sort: '+name'
	};

	//get query params
	if (req.query.q != '') {
		query['q'] = req.query.q;
	}
	if (req.query.status != '') {
		query['status'] = req.query.status;
	}
	if (req.query.limit != '') {
		query['limit'] = req.query.limit;
	}
	if (req.query.offset != '') {
		query['offset'] = req.query.offset;
	}
	if(req.query.sort !=''){
		query['sort'] = req.query.sort;
	}

	// call
	superagent
		.get(common.getAPIUrl(req) + 'api/v1/deployments')
		.set(common.getHeaders(req))
		.query(query)
		.end(function (error, response) {
			if (response.statusCode == 200) {
				res.render('deployments', {
					module: 'deployments',
					query: query,
					data: response.body,
					account: req.session.user,
					server: ini.information
				});
			} else {
				req.flash('errors', {
					msg: {
						text: 'error-code-'+response.body.code
					}
				});
			}
		});
};

exports.requestDeployment = requestDeployment;
exports.editDeployment = editDeployment;
exports.viewDeployment = viewDeployment;
exports.deleteDeployment = deleteDeployment;
exports.updateDeployment = updateDeployment;