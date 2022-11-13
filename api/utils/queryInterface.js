const { Op } = require('sequelize');
const { request } = require('../app');

module.exports = (req, res, next) => {
  const query = { ...req.query };
  const exclude = ['page', 'sort', 'limit', 'fields', 'description', 'id'];

  // === filtering

  // remove any non allowed keys
  exclude.forEach((item) => delete query[item]);

  // copy the query into a new object
  req.sql = {};
  req.sql.where = { ...query };

  // filter out anything that has multiple params for now
  Object.keys(req.sql.where).forEach((key) => {
    let value = req.sql.where[key];

    try {
      value = JSON.parse(value.toString());
      if (typeof value === 'object') delete req.sql.where[key];
    } catch (error) {
      return;
    }
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

    try {
      value = JSON.parse(value.toString());
      req.sql.where[queryKey] = {};
      if (typeof value === 'object') {
        Object.keys(value).forEach((paramKey) => {
          switch (paramKey) {
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
    } catch (error) {
      return;
    }
  });

  // === limiting retuned fields
  if (req.query.fields) {
    try {
      req.sql.attributes = {};
      const fields = req.query.fields.split(',');
      if (fields[0].startsWith('-')) {
        req.sql.attributes.exclude = fields.map(field => field.slice(1))
      } else {
        req.sql.attributes = fields;
      }
    } catch (error) {}
  }

  // === sorting

  if (req.sql.where.order) {
    const order = req.sql.where.order;
    delete req.sql.where.order;
    if (req.sql.where.orderBy) {
      const orderBy = req.sql.where.orderBy;
      delete req.sql.where.orderBy;
      req.sql.order = [[orderBy, order]];
    } else {
      req.sql.order = order;
    }
  } else {
    // by default sort by the newest records
    req.sql.order = [['createdAt', 'DESC']];
  }

  console.log(req.sql);

  next();
};
