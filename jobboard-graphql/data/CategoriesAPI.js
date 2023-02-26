const { RESTDataSource } = require('@apollo/datasource-rest');

class CategoriesAPI extends RESTDataSource {
  baseURL = process.env.API_DOMAIN;

  async getJobCategories(jobId) {
    const res = await this.get(`job-categories/jobs/${jobId}?fields=[id,name,description]`);
    const { categories } = res.data;
    return categories; 
  }

}

module.exports = { CategoriesAPI };