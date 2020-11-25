const express = require("express");
const router = express.Router();
const Movie = require("../models/Movie");

router.get("/", (req, res) => {
  Movie.find({ userId: req.user.id })
    .then((watchlist) => {
      res.status(200).json({ watchlist });
    })
    .catch((err) => res.status(400).json(err));
});

router.post("/add", (req, res) => {
  const userId = req.user.id;
  const movie = req.body.movie;
  Movie.findOne({ userId, id: movie.id })
    .then((findMovie) => {
      // không cho add movie đã tồn tại trong watchlist (chỉ cần khi người dùng click quá nhanh)
      if (findMovie) {
        res.status(400).json({ message: "added" });
      } else {
        const newMovie = new Movie({
          userId,
          ...movie,
        });
        newMovie.save((err, data) => {
          if (err) {
            res.status(400).json({ message: err });
          } else {
            res.status(200).json(data);
          }
        });
      }
    })
    .catch((err) => res.status(400).json(err));
});

router.post("/remove", (req, res) => {
  Movie.findOneAndDelete({ userId: req.user.id, id: req.body.id })
    .then((findMovie) => {
      res.status(200).json(findMovie);
    })
    .catch((err) => res.status(400).json({ err }));
});

module.exports = router;
