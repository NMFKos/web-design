const homeRouter = require('./home')
const newsRouter = require('./news')
const adminRouter = require('./admin')
const postRouter = require('./post')
const descriptionRouter = require('./description')
const loginRouter = require('./login')

function route(app) {
    app.use('/news', newsRouter);
    app.use('/admin', adminRouter);
    app.use('/post', postRouter);
    app.use('/cho-thue-phong-tro', descriptionRouter);
    app.use('/login', loginRouter);
    app.use('/', homeRouter);
}

module.exports = route;