const { RESTDataSource } = require('@apollo/datasource-rest');

class SalaryAPI extends RESTDataSource {
  baseURL = process.env.API_DOMAIN;

  async getSalaryType(id) {
    const res = await this.get(`salary-types/${id}?fields=[id,name]`);
    const { salaryType } = res.data;
    return salaryType; 
  }

}

module.exports = { SalaryAPI };