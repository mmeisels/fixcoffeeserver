var db = require('./pghelper'),
    activities = require('./activities'),
    winston = require('winston');

/**
 * Get user profile
 * @param req
 * @param res
 * @param next
 */
function getProfile(req, res, next) {
    var userId = req.userId,
        externalUserId = req.externalUserId;

    activities.getPointBalance(externalUserId)
        .then(function (rows) {
            console.log('points is now = : ' + rows[0].points);
            db.query(
                    /**'SELECT c.id, c.firstName, c.lastName, c.email, c.mobilePhone, c.pictureURL__c as pictureURL, c.createddate, c.preference__c AS preference, c.size__c AS size, c.emailpref__c as emailpref, c.smspref__c as smspref, c.offerpref__c as offerpref, c.marketingpref__c as marketingpref, sum(i.points__c) as points FROM salesforce.contact c inner join salesforce.interaction__c i on c.loyaltyid__c=i.contact__loyaltyid__c  WHERE c.id=$1 group by c.id, c.firstName, c.lastName, c.email, c.mobilePhone, c.pictureURL__c,c.createddate, c.preference__c,c.size__c,c.emailpref__c,c.smspref__c, c.offerpref__c,c.marketingpref__c',**/
                    'SELECT id, firstName, lastName, email, mobilePhone, pictureURL__c as pictureURL, createddate, preference__c AS preference, size__c AS size, emailpref__c as emailpref, smspref__c as smspref, offerpref__c as offerpref, marketingpref__c as marketingpref FROM salesforce.contact WHERE id=$1',
                    [userId], true)
                .then(function (user) {
                    console.log('points == : ' + rows[0].points);
                    user.points = rows[0].points;
                    //user.status=activities.getStatus(user.points);
                    user.status = activities.getStatus(rows[0].points);
                    res.send(JSON.stringify(user));
                })
                .catch(next);
        })
        .catch(next);
}

/**
 * Update user profile
 * @param req
 * @param res
 * @param next
 */
function updateProfile(req, res, next) {

    var user = req.body,
        userId = req.userId;

    console.log('updating: ' + JSON.stringify(user));

    db.query('update salesforce.contact SET firstName=$1, lastName=$2, mobilePhone=$3, pictureURL__c=$4, preference__c=$5, size__c=$6, emailpref__c=$8, smspref__c=$9, offerpref__c=$10,marketingpref__c=$11,level__c=$12  WHERE id=$7',
            [user.firstname, user.lastname, user.mobilephone, user.pictureurl, user.preference, user.size, userId, user.emailpref,user.smspref,user.offerpref,user.marketingpref,user.status])
        .then(function () {
            res.send(user);
        })
        .catch(next);
};

exports.getProfile = getProfile;
exports.updateProfile = updateProfile;