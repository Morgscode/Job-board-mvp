const { Op } = require('sequelize');

module.exports = (req, res, next) => {
  const query = { ...req.query };
  const exclude = [
    'page',
    'sort',
    'limit',
    'fields',
    'description',
    'id',
  ];

  // *=== filtering

  // remove any non allowed keys
  exclude.forEach((item) => delete query[item]);

  // copy the query into a new object
  req.sql = {};
  req.sql.where = { ...query };

  // filter out anything that has multiple params for now
  Object.keys(req.sql.where).forEach((key) => {
    let value = req.sql.where[key];
    value = JSON.parse(value);
    if (typeof value === 'object') delete req.sql.where[key];
  });

  // like cluses for titls and names
  if (req.query.title) {
    req.sql.where['title'] = { [Op.like]: `${decodeURI(req.query.title)}%` };
  }

  if (req.query.name) {
    req.sql.where['name'] = { [Op.like]: `${decodeURI(req.query.name)}%` };
  }

  // logical operators (gt, lt, gte, lte)
  Object.keys(query).forEach((queryKey) => {
    let value = query[queryKey];
    value = JSON.parse(value);
    req.sql.where[queryKey] = {};
    if (typeof value === 'object') {
      Object.keys(value).forEach(paramKey => {
        switch(paramKey) {
          case 'gte': 
            req.sql.where[queryKey][Op.gte] = value[paramKey];
          break;
          case 'lte': 
          req.sql.where[queryKey][Op.lte] = value[paramKey];
          break;
          case 'gt':
            req.sql.where[queryKey][Op.gt] = value[paramKey];
          break;
          case 'lt':
            req.sql.where[queryKey][Op.lt] = value[paramKey];
          break;
        }
      });
    }
  });

  next();
};
