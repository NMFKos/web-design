class ReportController {
    index(req, res) {
        res.render('report');
    }

    report(req, res) {
        console.log(req.body); // In ra payload từ form
        res.send(req.body); // Phản hồi cho client
    }
}

module.exports = new ReportController;
