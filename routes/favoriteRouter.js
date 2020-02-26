const express = require('express');
const bodyParser = require('body-parser');
const favoritesRouter = express.Router();
const Favorites = require('../models/favorite');
const authenticate = require('../authenticate');
const cors = require('./cors');


favoritesRouter.use(bodyParser.json());


favoritesRouter.route('/')
  .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })
      .populate('user')
      .populate('dishes')
      .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(dish);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id }).then((favorite) => {
      if (favorite) {
        req.body.forEach(dish => {
          if (!favorite.dishes.includes(dish._id)) favorite.dishes.push(dish);
        });
        favorite.save().then((favorite) => {
          Favorites.findById(favorite._id)
            .populate('dishes')
            .populate('user')
            .then((favorite) => {
              res.statusCode = 200;
              res.setHeader('Content-type', 'application/json');
              res.json(favorite);
            })
        }, (err) => next(err))
      }
      else {
        let favorite = {
          dishes: req.body,
          user: req.user._id
        }
        Favorites.create(favorite).then((favorite) => {
          res.statusCode = 200;
          res.setHeader('Content-type', 'application/json');
          res.json(favorite);
        }, (err) => next(err))
          .catch((err) => next(err));
      }
    }, (err) => next(err))
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation is not supported');
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.remove({ user: req.user._id }).then((resp) => {
      res.statusCode = 200;
      res.setHeader('Content-type', 'application/json');
      res.json(resp);
    }, (err) => next(err))
      .catch((err) => next(err));
  });

  favoritesRouter.route('/:dishId')
  .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id }).then((favorite) => {
      if (favorite) {
        if (!favorite.dishes.includes(req.params.dishId)) favorite.dishes.push(req.params.dishId);
        favorite.save().then((favorite) => {
          Favorites.findById(favorite._id)
            .populate('dishes')
            .populate('user')
            .then((favorite) => {
              res.statusCode = 200;
              res.setHeader('Content-type', 'application/json');
              res.json(favorite);
            })
        }, (err) => next(err))
      }
      else {
        res.sendStatus(200); 
      }
    }, (err) => next(err))
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id }).then((favorite) => {
      if (favorite) {
        if (favorite.dishes.includes(req.params.dishId)) favorite.dishes.pull({_id: req.params.dishId});
        favorite.save().then((favorite) => {
          Favorites.findById(favorite._id)
            .populate('dishes')
            .populate('user')
            .then((favorite) => {
              res.statusCode = 200;
              res.setHeader('Content-type', 'application/json');
              res.json(favorite);
            })
        }, (err) => next(err))
      }
      else {
        res.sendStatus(200); 
      }
    }, (err) => next(err))
  });


module.exports = favoritesRouter;