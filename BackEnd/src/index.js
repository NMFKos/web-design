const path = require('path');
const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const { engine } = require('express-handlebars')

const app = express();
const route = require('./routes/index.js');
const db = require('./config/db/index.js')

// Connect Database
db.connect()

// HTTP logger
app.use(morgan('combined'))

// Cấu hình express-session
app.use(session({
    secret: 'aQw09^&2Qmz!3#xT~1L5p4d',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

// Template engine
app.engine('handlebars', engine(
    {
        defaultLayout: path.join(__dirname, 'resources/views/layouts/main.handlebars'),
        layoutsDir: path.join(__dirname, "resources/views/layouts"),
        partialsDir: path.join(__dirname,  "resources/views/partials")
    }
));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'resources/views')); 

app.use(function(req, res, next) {
    res.locals.session = req.session;
    next();
});

// Routes & Controllers
route(app);

app.listen(8888, 'localhost', () => {
    console.log('Server is running on http://localhost:8888');
});


