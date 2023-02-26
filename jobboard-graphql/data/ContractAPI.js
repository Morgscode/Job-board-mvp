const { RESTDataSource } = require('@apollo/datasource-rest');

class ContractAPI extends RESTDataSource {
  baseURL = process.env.API_DOMAIN;

  async getContract(id) {
    const res = await this.get(`employment-contract-types/${id}?fields=[id,name]`);
    const { contractType } = res.data;
    return contractType; 
  }

}

module.exports = { ContractAPI };