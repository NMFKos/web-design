const homeRouter = require('./home')
const newsRouter = require('./news')
const adminRouter = require('./admin')
const postRouter = require('./post')
const detailRouter = require('./detailpage')
const loginRouter = require('./login')
const accountRouter = require('./account')
const reportRouter = require('./report')

function route(app) {
    app.use('/news', newsRouter);
    app.use('/admin', adminRouter);
    app.use('/account', accountRouter);
    app.use('/post', postRouter);
    app.use('/phong-tro', detailRouter);
    app.use('/report', reportRouter),
    app.use('/login', loginRouter);
    app.use('/', homeRouter);
}

module.exports = route;