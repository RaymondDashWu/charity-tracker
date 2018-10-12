const express = require('express')
const app = express()
var exphbs = require('express-handlebars');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/rotten-potatoes');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const Comment = require('./models/comment')
const Review = require('./models/review')

app.use(methodOverride('_method'))

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(methodOverride('_method'))


app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

require('./controllers/reviews')(app);
require('./controllers/comments')(app);

app.listen(3000, () => {
    console.log('App listening on port 3000!')
})

module.exports = app