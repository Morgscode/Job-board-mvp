const { RESTDataSource } = require('@apollo/datasource-rest');

class UsersAPI extends RESTDataSource {
  baseURL = process.env.API_DOMAIN;

  constructor(options) {
    super(options);
    this.token = options.token;
  }

  willSendRequest(_path, request) {
    request.headers['authorization'] = `Bearer ${this.token}`;
  }

  async me() {
    const res = await this.get(`me`);
    const { user } = res.data;
    return user;
  }
}

module.exports = { UsersAPI };
