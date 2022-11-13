module.exports = function (req, res, next) {
  const time = new Date().toISOString();
  req.requestTime = time;
  next();
};
