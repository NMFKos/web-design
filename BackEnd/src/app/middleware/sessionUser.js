const { ObjectId } = require('mongodb');

module.exports = function (req, res, next) {
    if (req.session && req.session.userId) {
        req.userId = new ObjectId(req.session.userId);
    }
    next();
};