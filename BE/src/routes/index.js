const siteRouter = require('./home')
const newsRouter = require('./news')
const adminRouter = require('./admin')
const accountRouter = require('./account')
const descriptionRouter = require('./description')

function route(app) {
    app.use('/news', newsRouter);
    app.use('/admin', adminRouter);
    app.use('/account', accountRouter);
    app.use('/description', descriptionRouter);
    app.use('/', siteRouter);
}

module.exports = route;