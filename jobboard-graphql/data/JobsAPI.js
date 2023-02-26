const { RESTDataSource } = require('@apollo/datasource-rest');

class JobsAPI extends RESTDataSource {
  baseURL = 'http://localhost:8080/api/v1/';

  async getJobs(query = 'page=1') {
    const res = await this.get(`jobs?${query}`);
    const { jobs } = res.data;
    return jobs; 
  }

  async getJob(id) {
    const res = await this.get(`jobs/post/${encodeURIComponent(id)}`);
    const { job } = res.data;
    return job;
  }

}

module.exports = { JobsAPI };