const catchAsync = require('../utils/catchAsyncError');
const AppError = require('../utils/AppError');
const jobModel = require('../models/jobModel');

const _index = catchAsync(async function(req, res, next) {
    res.status(200).json({msg: 'list jobs route'});
});

const _find = catchAsync(async function(req, res, next) {
    res.status(200).json({msg: 'find job by :id route'});
});

const _create = catchAsync(async function(req, res, next) {
    const job = req.body;
    console.log(job);
});

const _update = catchAsync(async function(req, res, next) {
    res.status(200).json({msg: 'update job by :id route'});
});

const _delete = catchAsync(async function(req, res, next) {
    res.status(200).json({msg: 'delete job by :id route'});
});

module.exports = { _index, _find, _create, _update, _delete }