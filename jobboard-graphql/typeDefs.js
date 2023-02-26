const typeDefs = `#graphql

type User {
  id: Int!
  email: String!
  title: String
  first_name: String!
  surname: String!
  middle_names: String
  role: Int!
  email_verified_at: String
  createdAt: String
}

type JobLocation {
  id: Int!
  name: String!
  description: String
}

type JobCategory {
  id: Int! 
  name: String! 
  description: String
}

type EmploymentContractType {
  id: Int! 
  name: String! 
}

type SalaryType {
  id: Int! 
  name: String! 
}

type Job {
  id: Int!
  title: String!
  active: Int!
  description: String
  salary_type_id: String
  salary: Float
  employment_contract_type_id: String
  deadline: String!
  createdAt: String!
  updatedAt: String
  deletedAt: String
}

type JobPost {
  job: Job!
  salaryType: SalaryType!
  contract: EmploymentContractType!
  categories: [JobCategory]
  locations: [JobLocation]
}

input JobInput {
  id: Int!
}

input JobsInput {
  query: String
}

type Query {
  me: User!
  job(input: JobInput): JobPost!
  jobs(input: JobsInput): [Job]!
}
`;

module.exports = {typeDefs}
