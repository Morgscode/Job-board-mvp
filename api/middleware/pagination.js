module.exports = (req, res, next) => {
  const query = { ...req.query };

  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 10;
  const offset = (page - 1) * limit;

  req.pagination = {
    limit,
    offset,
  };
  
  next();
};
