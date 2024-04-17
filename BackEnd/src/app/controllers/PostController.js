class PostController {
    index(req, res) {
        res.render('post');
    }
}

module.exports = new PostController;