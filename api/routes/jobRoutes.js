const express = require('express');
const auth = require('../utils/auth');

const router = express.Router();

router.route('/')
.get(function(req, res) {
    res.status(200).json({msg: 'list jobs route'});
})

router.route('/:id')
.get(function(req, res) {
    res.status(200).json({msg: 'find job by :id route'});
});

router.use(auth.protect);

router.route('/')
.post(function(req, res) {
    res.status(201).json({msg: 'post job route'});
});

router.route('/:id')
.put(function(req, res) {
    res.status(200).json({msg: 'update job by :id route'});
})
.delete(function(req, res) {
    res.status(204).json({msg: 'delete job by :id route'});
});
 
module.exports = router;