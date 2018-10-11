const express = require('express')
const app = express()
var exphbs = require('express-handlebars');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/rotten-potatoes');
const bodyParser = require('body-parser');
const methodOverride = require('method-override')
const port = process.env.PORT || 3000;

app.listen(port);


const Review = mongoose.model('Review', {
    title: String,
    description: String,
    movieTitle: String
});

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(methodOverride('_method'))


app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
    Review.find()
        .then(reviews => {
            res.render('reviews-index', {
                reviews: reviews
            });
        })
        .catch(err => {
            console.log(err);
        })
})

app.get('/reviews', (req, res) => {
    res.render('reviews-index', {
        reviews: reviews
    });
})

app.get('/reviews/new', (req, res) => {
    res.render('reviews-new', {});
})

app.get('/reviews/:id', (req, res) => {
    Review.findById(req.params.id).then((review) => {
        res.render('reviews-show', {
            review: review
        })
    }).catch((err) => {
        console.log(err.message);
    })
})

app.get('/reviews/:id/edit', (req, res) => {
    Review.findById(req.params.id, function (err, review) {
        res.render('reviews-edit', {
            review: review
        });
    })
})

app.post('/reviews', (req, res) => {
    Review.create(req.body).then((review) => {
        console.log(review)
        res.redirect(`/reviews/${review._id}`) // Redirect to reviews/:id
    }).catch((err) => {
        console.log(err.message)
    })
})

app.put('/reviews/:id', (req, res) => {
    Review.findByIdAndUpdate(req.params.id, req.body)
      .then(review => {
        res.redirect(`/reviews/${review._id}`)
      })
      .catch(err => {
        console.log(err.message)
      })
  })

app.delete('/reviews/:id', function (req, res) {
  console.log("DELETE review")
  Review.findByIdAndRemove(req.params.id).then((review) => {
    res.redirect('/');
  }).catch((err) => {
    console.log(err.message);
  })
})

app.listen(3000, () => {
    console.log('App listening on port 3000!')
})

module.exports = app