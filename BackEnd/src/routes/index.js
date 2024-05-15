const homeRouter = require('./home')
const adminRouter = require('./admin')
const postRouter = require('./post')
const detailRouter = require('./detailpage')
const loginRouter = require('./login')
const reportRouter = require('./report')
const accountRouter = require('./account')

function route(app) {
    app.use('/admin', adminRouter);
    app.use('/account', accountRouter);
    app.use('/post', postRouter);
    app.use('/phong-tro', detailRouter);
    app.use('/report', reportRouter),
    app.use('/login', loginRouter);
    app.use('/', homeRouter);
}
module.exports = route;