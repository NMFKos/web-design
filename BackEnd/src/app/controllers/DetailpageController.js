const House = require('../modules/house');
const User = require('../modules/user');

class DetailController {
    index(req, res) {
        let houseData, userData;
        // Truy vấn thông tin về house
        House.findOne({ slug: req.params.slug })
        .then(house => {
            if (!house) {
                // Nếu không tìm thấy house với _id cụ thể, trả về lỗi 404
                throw new Error('House not found');
            }
            // Lưu dữ liệu house
            houseData = house.toObject();
            // Tiếp tục truy vấn thông tin về user
            return User.findOne({ _id: house.user_id });
        })
        .then(user => {
            if (!user) {
                // Nếu không tìm thấy user, trả về lỗi 404
                throw new Error('User not found');
            }
            // Lưu dữ liệu user
            userData = user.toObject();
            // Render template description với dữ liệu của cả house và user
            res.render('detailpage', { showHeader: true, houseData, userData });
        })
        .catch(error => {
            // Xử lý lỗi nếu có
            console.error('Error:', error);
            res.status(500).send('Internal Server Error');
        });
    }    
}

module.exports = new DetailController;
