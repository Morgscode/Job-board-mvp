const { Op } = require('sequelize');

module.exports = (req, res, next) => {
  const query = { ...req.query };
  const exclude = ['page', 'limit', 'fields', 'description', 'id'];

  // === filtering

  // remove any non allowed keys
  exclude.forEach((item) => delete query[item]);

  // copy the query into a new object
  req.sql = {};
  req.sql.where = { ...query };

  // console.info('pre filter', req.sql);

  // filter out anything that has multiple params for now
  Object.keys(req.sql.where).forEach((key) => {
    let value = req.sql.where[key];
    try {
      value = JSON.parse(value.toString());
      console.log('parsed value', value);
      // remove any object parameters from the sql where
      if (typeof value === 'object') delete req.sql.where[key];
    } catch (error) {
      return;
    }
  });

  // allow like/contains clauses for titles and names
  if (req.query.title) {
    req.sql.where['title'] = { [Op.like]: `%${decodeURI(req.query.title)}%` };
  }

  if (req.query.name) {
    req.sql.where['name'] = { [Op.like]: `%${decodeURI(req.query.name)}%` };
  }

  if (req.query.description) {
    req.sql.where['description'] = { [Op.like]: `%${decodeURI(req.query.description)}%` };
  }

  // console.info('pre logical', req.sql);

  // logical operators (gt, lt, gte, lte)
  Object.keys(query).forEach((queryKey) => {
    let value = query[queryKey];

    try {
      value = JSON.parse(value.toString());
      if (typeof value === 'object') {
        req.sql.where[queryKey] = {};
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

  // console.info('pre limit', req.sql);

  // === limiting retuned fields

  if (req.query.fields) {
    try {
      req.sql.attributes = {};
      const fields = req.query.fields.split(',');
      if (fields[0].startsWith('-')) {
        req.sql.attributes.exclude = fields.map((field) => field.slice(1));
      } else {
        req.sql.attributes = fields;
      }
    } catch (error) {}
  }

  // === sorting

  // console.info('pre order', req.sql);

  if (req.sql.where.order) {
    const order = req.sql.where.order.toUpperCase();
    delete req.sql.where.order;
    if (req.sql.where.orderBy) {
      const orderBy = req.sql.where.orderBy;
      delete req.sql.where.orderBy;
      req.sql.order = [[orderBy, order]];
    } else {
      req.sql.order = [['createdAt', order]];
    }
  } else {
    // by default sort by the newest records
    req.sql.order = [['createdAt', 'DESC']];
  }

  // console.info('post query interface', req.sql);

  next();
};
