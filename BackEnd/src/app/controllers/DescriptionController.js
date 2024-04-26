const House = require('../modules/house');
const User = require('../modules/user');

class DescriptionController {
    index(req, res) {
        res.render('description', { showHeader: true });
    }    
}

module.exports = new DescriptionController;
