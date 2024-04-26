const Houses = require('../modules/house')

class SiteController {
    index(req, res) {
        Houses.find({})
        .then(houses => {
            if (!houses) {
                // Nếu không tìm thấy nhà, trả về lỗi 404
                throw new Error('404 Not found');
            }
            // Điều chỉnh từ toOject() thành toObject()
            const houseData = houses.map(h => h.toObject());
            res.render('home', { showHeader: true, houseData });
        })
        .catch(error => {
            console.error('Error fetching houses from database:', error);
            res.status(500).send('Internal Server Error');
        });
    }
    
    login(req, res) {
        res.render('login', { showHeader: false });
    }
}

module.exports = new SiteController;