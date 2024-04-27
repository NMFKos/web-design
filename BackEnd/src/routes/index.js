const homeRouter = require('./home')
const newsRouter = require('./news')
const adminRouter = require('./admin')
const postRouter = require('./post')
const detailRouter = require('./detailpage')
const loginRouter = require('./login')
const testRouter = require('./test')

function route(app) {
    app.use('/news', newsRouter);
    app.use('/admin', adminRouter);
    app.use('/post', postRouter);
    app.use('/phong-tro', detailRouter);
    app.use('/login', loginRouter);
    app.use('/test', testRouter);
    app.use('/', homeRouter);
}

module.exports = route;