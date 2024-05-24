const homeRouter = require('./home')
const adminRouter = require('./admin')
const postRouter = require('./post')
const detailRouter = require('./detailpage')
const accountRouter = require('./account')
const paymentRouter = require('./payment')

function route(app) {
    app.use('/admin', adminRouter);
    app.use('/account', accountRouter);
    app.use('/post', postRouter);
    app.use('/phong-tro', detailRouter);
    //app.use('/payment', paymentRouter)
    app.use('/', homeRouter);
}
module.exports = route;