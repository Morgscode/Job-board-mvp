module.exports = (req, res, next) => {
  const query = { ...req.query };
  req.pagination = {
    limit: parseInt(query.limit, 10) || 20,
    offset: parseInt(query.offset, 10) || 0,
  };
  next();
};
