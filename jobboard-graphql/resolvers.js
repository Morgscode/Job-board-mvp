const { authenticated, getUserFromToken } = require('./auth');

const resolvers = {
    Query: {
      me: authenticated(async (_, {input}, {dataSources}) => {
        const me = await dataSources.UsersAPI.me();
        return me;
      }),
      job: async (_, {input}, {dataSources}) => {
        const job = await dataSources.JobsAPI.getJob(input.id);
        return job;
      },
      jobs: async (_, {input}, {dataSources}) => {
        const jobs = await dataSources.JobsAPI.getJobs(input.query);
        return jobs;
      },
    },
  };

  module.exports = {resolvers};
  