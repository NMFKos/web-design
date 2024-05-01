const Posts = require('../modules/post')

class SiteController {
    index(req, res) {
        Posts.find({})
        .then(posts => {
            if (!posts) {
                // Nếu không tìm thấy nhà, trả về lỗi 404
                throw new Error('404 Not found');
            }
            // đối với find sử dụng toObject() cho mỗi phần tử
            // đối với findOne sử dụng toObject() cho chính nó
            const postData = posts.map(p => p.toObject());
            res.render('home', { showHeader: true, postData });
        })
        .catch(error => {
            console.error('Error fetching houses from database:', error);
            res.status(500).send('Internal Server Error');
        });
        // let houseData;
        // Houses.find({})
        // .then(houses => {
        //     if (!houses || houses.length === 0) {
        //         // Nếu không tìm thấy nhà, có thể xử lý tại đây, ví dụ: res.status(404).send('404 Not found');
        //         throw new Error('404 Not found');
        //     }

        //     // Sử dụng vòng lặp để lấy một tài nguyên cho mỗi nhà
        //     houseData = houses.map(house => house.toObject());
        //     const findResourcePromises = [];
        //     houses.forEach(house => {
        //         const houseIdString = house._id.toString();
        //         findResourcePromises.push(Images.findOne({ house_id: houseIdString }));
        //     });

        //     // Sử dụng Promise.all để chờ tất cả các truy vấn findOne hoàn tất
        //     return Promise.all(findResourcePromises);
        // })
        // .then(matchedResources => {
        //     // matchedResources là một mảng chứa kết quả từng truy vấn findOne tương ứng
        //     // matchedResources[i] sẽ là tài nguyên tương ứng với nhà có _id là houses[i]._id
            
        //     // Tiếp tục xử lý ở đây
        //     console.log(matchedResources)
        //     res.render('home', { showHeader: true, houseData, matchedResources });
        // })
        // .catch(error => {
        //     console.error(error);
        //     res.status(500).send('Internal Server Error');
        // });
    }
    
    login(req, res) {
        res.render('login', { showHeader: false });
    }
}

module.exports = new SiteController;