const { RESTDataSource } = require('@apollo/datasource-rest');

class LocationsAPI extends RESTDataSource {
  baseURL = process.env.API_DOMAIN;

  async getJobLocations(jobId) {
    const res = await this.get(`locations/jobs/${jobId}?fields=[id,name,description]`);
    const { locations } = res.data;
    return locations; 
  }

}

module.exports = { LocationsAPI };