module.exports = (req, res, next) => {
  const query = { ...req.query };
  const exclude = [
    'page',
    'sort',
    'limit',
    'fields',
    'title',
    'description',
    'name',
  ];

  exclude.forEach((item) => delete query[item]);

  req.sql = {};
  req.sql.where = { ...query };

  if (query.title) {
    req.sql.where['title'] = { [Op.like]: `${query.title}%` };
  }

  if (query.name) {
    req.sql.where['name'] = { [Op.like]: `${query.name}%` };
  }

  next();
  
};
