const express = require('express');
const bodyParser = require('body-parser');
const promoRouter = express.Router();
const Promos = require('../models/promotions');
const cors = require('./cors');
const authenticate = require('../authenticate');

promoRouter.use(bodyParser.json());

promoRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req, res, next) => {
  Promos.find({}).then((promos) => {
    res.statusCode = 200;
    res.setHeader('Content-type', 'application/json');
    res.json(promos);
  }, (err) => next(err))
  .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  Promos.remove({}).then((resp) => {
    res.statusCode = 200;
    res.setHeader('Content-type', 'application/json');
    res.json(resp);
  }, (err) => next(err))
  .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  Promos.create(req.body).then((promo) => {
    res.statusCode = 200;
    res.setHeader('Content-type', 'application/json');
    res.json(promo);
  }, (err) => next(err))
  .catch((err) => next(err)); 
  })
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  res.statusCode = 403;
  res.end('PUT operation is not supported');
});

promoRouter.route('/:promoId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req, res, next) => {
  Promos.findById(req.params.promoId).then((promo) => 
  {
    res.statusCode = 200;
    res.setHeader('Content-type', 'application/json');
    res.json(promo);
  }, (err) => next(err))
  .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  Promos.findByIdAndUpdate(req.params.promoId, {$set:req.body}, {new: true}).then((promo) => {
    res.statusCode = 200;
    res.setHeader('Content-type', 'application/json');
    res.json(promo);
  }, (err) => next(err))
  .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  Promos.findByIdAndRemove(req.params.promoId).then((resp) => {
    res.statusCode = 200;
    res.setHeader('Content-type', 'application/json');
    res.json(resp);
  }, (err) => next(err))
  .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation is not supported');
});

  module.exports = promoRouter;