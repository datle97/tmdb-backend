const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MovieSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    id: { type: Number, required: true },
    media_type: { type: String, default: "movie" },
    title: String,
    poster_path: String,
    release_date: Date,
    overview: String,
    vote_average: Number,
    popularity: Number,
  },
  { timestamps: true }
);

const Movie = mongoose.model("Movie", MovieSchema);

module.exports = Movie;
