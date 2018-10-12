// const Review = require('../models/review');
const Comment = require('../models/comment');
// const app = express()

module.exports = (app) => {
  console.log(app)
    // NEW Comment
    app.post('/reviews/comments', (req, res) => {
        Comment.create(req.body).then(comment => {
          res.redirect(`/reviews/${comment.reviewId}`);
        }).catch((err) => {
          console.log(err.message);
        });
      });
    

    app.delete('/reviews/comments/:id', function (req, res) {
      console.log("DELETE comment")
      Comment.findByIdAndRemove(req.params.id).then((comment) => {
        res.redirect(`/reviews/${comment.reviewId}`);
      }).catch((err) => {
        console.log(err.message);
      })
    })
  }