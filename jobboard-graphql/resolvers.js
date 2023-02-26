const { authenticated } = require('./auth');

const resolvers = {
    Query: {
      me: authenticated(async (_, {input}, {dataSources}) => {
        const me = await dataSources.UsersAPI.me();
        return me;
      }),
      job: async (_, {input}, {dataSources}) => {
        const job = await dataSources.JobsAPI.getJob(input.id);
        const salaryType = await dataSources.SalaryAPI.getSalaryType(job.salary_type_id);
        const contract = await dataSources.ContractAPI.getContract(job.employment_contract_type_id);
        const locations = await dataSources.LocationsAPI.getJobLocations(job.id);
        const categories = await dataSources.CategoriesAPI.getJobCategories(job.id);
        return {job, salaryType, contract, locations, categories};
      },
      jobs: async (_, {input}, {dataSources}) => {
        const jobs = await dataSources.JobsAPI.getJobs(input.query);
        return jobs;
      },
    },
  };

  module.exports = {resolvers};
  