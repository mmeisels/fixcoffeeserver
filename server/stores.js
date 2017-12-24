var db = require('./pghelper'),
    winston = require('winston');

/**
 * Get a list of stores
 * @param req
 * @param res
 * @param next
 */
function findAll(req, res, next) {
	console.log('findAll');
    db.query("SELECT id, name, location_latitude__c AS latitude, location_longitude__c AS longitude FROM salesforce.store__c ORDER BY name")
        .then(function (stores) {
            return res.send(JSON.stringify(stores));
        })
        .catch(next);
};

exports.findAll = findAll;
