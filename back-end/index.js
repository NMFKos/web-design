const path = require('path');
const express = require('express');
const morgan = require('morgan');
const { engine } = require('express-handlebars')

const app = express();
const route = require('./routes/index.js');

// HTTP logger
app.use(morgan('combined'))

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Template engine
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'resources/views')); 

// Routes & Controllers
route(app);

app.listen(12345)