const path = require('path');
const express = require('express');
const morgan = require('morgan');
const { engine } = require('express-handlebars')

const app = express();
const route = require('./routes/index.js');
const db = require('./config/db/index.js')

// Connect Database
db.connect()

// HTTP logger
app.use(morgan('combined'))

// Static files
app.use(express.static(path.join(__dirname, 'public')));

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

// Routes & Controllers
route(app);

app.listen(8888, 'localhost', () => {
    console.log('Server is running on http://localhost:8888');
  });
  