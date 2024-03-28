

class DescriptionController {
    index(req, res) {
        res.render('description');
    }
}

module.exports = new DescriptionController;