const homeRouter = require('./home')
const newsRouter = require('./news')
const adminRouter = require('./admin')
const postRouter = require('./post')
const detailRouter = require('./detailpage')
const loginRouter = require('./login')
const testRouter = require('./test')
const reportRouter = require('./report')
const accountRouter = require('./account')

function route(app) {
    app.use('/news', newsRouter);
    app.use('/admin', adminRouter);
    app.use('/post', postRouter);
    app.use('/phong-tro', detailRouter);
    app.use('/report', reportRouter),
    app.use('/login', loginRouter);
    app.use('/test', testRouter);
    app.use('/account', accountRouter);
    app.use('/', homeRouter);
}
module.exports = route;