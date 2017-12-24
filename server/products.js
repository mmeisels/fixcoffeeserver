var db = require('./pghelper'),
    config = require('./config'),
    winston = require('winston');

function findAll(productId) {
    return db.query('SELECT id, name, family, description, image__c AS image, productPage__c AS productPage, publishDate__c AS publishDate FROM salesforce.product2 WHERE family=$1 and name!=$1 ORDER BY publishDate DESC', [productId]);
};

function findById(productId) {
    return db.query('SELECT id, name, family, description, image__c AS image, productPage__c AS productPage, publishDate__c AS publishDate FROM salesforce.product2 WHERE id=$1', [productId], true);
};

function findByFamily(productId) {
    return db.query('SELECT id, name, family, description, image__c AS image, productPage__c AS productPage, publishDate__c AS publishDate FROM salesforce.product2 WHERE family=$1', [productId]);
};

function getAll(req, res, next) {
  var id = req.params.id;
  findAll(id)
        .then(function (products) {
            return res.send(JSON.stringify(products));
        })
        .catch(next);
};

function getById(req, res, next) {
    var id = req.params.id;
    findById(id)
        .then(function (products) {
            return res.send(JSON.stringify(products));
        })
        .catch(next);
};

function getByFamily(req, res, next) {
    var name = req.params.name;
    findByFamily(name)
        .then(function (products) {
            return res.send(JSON.stringify(products));
        })
        .catch(next);
};

exports.findAll = findAll;
exports.findById = findById;
exports.getAll = getAll;
exports.getById = getById;
exports.findByFamily = findByFamily;
exports.getByFamily = getByFamily;
