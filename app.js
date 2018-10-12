const express = require('express')
const app = express()
var exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override')
const port = process.env.PORT || 3000;
const request = require('request');
// const charityapi = request('https://api.data.charitynavigator.org/v2/Lists?app_id=7d5376af&app_key=d810bb5de257324606de7d614079e569');

// MONGOOSE CONNECT
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/rotten-potatoes');

// function printJSONData(jsonObj){
	
// 	// iterating over things in the json response.
// 	for (i = 0; i < jsonObj.length; i++) {
// 		// printing out fields in the OBJ
// 		console.log(jsonObj[index].listName);
// 		console.log(jsonObj[index].listAbstract);
// 	}
	
// }
// printJSONData(charityapi)

// send json data to handlebars template



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

// app.get('/', (req, res) => {
//     charityapi, (err, response, body) => {
//         console.log(res.statusCode)
//         if(!err && res.statusCode == 200) {
//             res.render('charities-index', {charities: JSON.parse(body)})
//         } else {
//             console.log(err)
//             res.render('charities-index')
//         }
//     }
// })

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

app.post('/reviews/comments', (req, res) => {
    Comment.create(req.body).then(comment => {
      res.status(200).send({ comment: comment });
    }).catch((err) => {
      res.status(400).send({ err: err })
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

app.listen(4000, () => {
    console.log('App listening on port 4000!')
})

app.listen(port);

module.exports = app