var db = require('./pghelper'),
    winston = require('winston');

/**
 * Add a new product to the user's wish list
 * @param req
 * @param res
 * @param next
 */
function addItem(req, res, next) {
    var userId = req.userId,
        productId = req.body.productId; // the id in the postgres table

    console.log(JSON.stringify(req.body));

    db.query('SELECT productId FROM wishlist WHERE userId=$1 AND productId=$2', [userId, productId], true)
        .then(function(product) {
            if (product) {
                return res.send(400, 'This product is already in your wish list');
            }
            db.query('INSERT INTO wishlist (userId, productId) VALUES ($1, $2)', [userId, productId], true)
                .then(function () {
                    return res.send('ok');
                })
                .fail(function(err) {
                    return next(err);
                });
        })
        .catch(next);
}

/**
 * Delete a product from the user's wish list
 * @param req
 * @param res
 * @param next
 */
function deleteItem(req, res, next) {
    var userId = req.userId,
        productId = req.params.id;
    db.query('DELETE FROM wishlist WHERE userId=$1 AND productId=$2', [userId, productId], true)
        .then(function () {
            return res.send('OK');
        })
        .catch(next);
}


/**
 * Delete all the wish list items for the given user
 * @param userId
 */
function deleteItems(userId) {
    console.log('deleting wish list items for user ' + userId);
    return db.query('DELETE FROM wishlist WHERE userId=$1', [userId], true);
}

/**
 * Get the user's wish list
 * @param req
 * @param res
 * @param next
 */
function getItems(req, res, next) {
    var userId = req.userId;
    db.query("SELECT o.name as name,TO_CHAR(o.systemmodstamp, 'Day DD Mon YYYY') as orderdate, o.order_status__c as orderstatus, o.total__c as total, CASE WHEN o.order_status__c='Awaiting Packing' THEN 'packing.png' WHEN o.order_status__c='Posted' THEN 'delivery.png' ELSE 'delivered.png' END as image FROM salesforce.contact c inner join salesforce.order__c o on c.sfid = o.contact__c and c.id=$1 ORDER BY o.name DESC",
            [userId])
        .then(function (products) {
            return res.send(JSON.stringify(products));
        })
        .catch(next);
}

exports.addItem = addItem;
exports.deleteItem = deleteItem;
exports.deleteItems = deleteItems;
exports.getItems = getItems;