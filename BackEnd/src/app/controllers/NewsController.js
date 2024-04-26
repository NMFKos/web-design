class NewsController {
    index(req, res) {
        res.render('news', { showHeader: true });
    }
}

module.exports = new NewsController;