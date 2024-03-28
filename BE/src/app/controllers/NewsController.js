class NewsController {
    index(req, res) {
        res.render('news');
    }
}

module.exports = new NewsController;