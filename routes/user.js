const express = require("express");
const User = require("../models/User");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.post("/signup", (req, res) => {
  User.findOne({ username: req.body.username })
    .then((user) => {
      if (user) {
        res.status(400).json("Username has already been taken");
      } else {
        const newUser = new User(req.body);
        newUser
          .save()
          .then((user) => {
            // gửi token và đăng nhập sau khi đăng ký thành công
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
              expiresIn: "1d",
            });
            res.status(200).json({ token, user });
          })
          .catch((err) => {
            res.status(400).json(err);
          });
      }
    })
    .catch((err) => res.status(400).json(err));
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      res.status(400).json(err);
    }
    if (info !== undefined) {
      res.status(400).json(info);
    } else {
      req.login(user, { session: false }, (err) => {
        if (err) {
          res.status(400).json(err);
        } else {
          const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
          });
          res.status(200).json({ token, user });
        }
      });
    }
  })(req, res, next);
});

router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.status(200).json({ user: req.user });
  }
);

module.exports = router;
