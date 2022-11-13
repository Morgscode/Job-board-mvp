const { Op } = require('sequelize');

module.exports = (req, res, next) => {
    const query = {...req.query};
    const exclude = ['page', 'sort', 'limit', 'fields', 'title', 'description', 'name', 'id'];
    
    exclude.forEach(item => delete query[item]); 
    
    req.sql = {};
    req.sql.where = {...query};
    
    if (req.query.title) {
      req.sql.where['title'] = {[Op.like]: `${decodeURI(req.query.title)}%`};
    }
    
    if (req.query.name) {
      req.sql.where['name'] = {[Op.like]: `${decodeURI(req.query.name)}%`};
    }
    next();
};
