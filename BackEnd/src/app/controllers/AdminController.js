const User = require("../modules/user")

class AdminController {
    index(req, res) {
        User.find({}).exec()
        .then(async user=> {
            if(!user){
                //Nếu không tìm thấy thông tin user
                throw new Error('404 NOT FOUND');
            }
            const userData = user.slice(30, 42).map(user => user.toObject());
            res.render('admin', {showAdmin: true, userData});
        })
        .catch(error => {
            console.error('Error fetching user from database');
            res.status(500).send('INTERNAL SERVER ERROR');
        })
    }
}

module.exports = new AdminController;