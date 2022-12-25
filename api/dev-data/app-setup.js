#!/usr/bin/env node
const db = require("../utils/db");
const relationships = require("../models/index");
const { SalaryType } = require("../models/salaryTypeModel");
const {
  EmploymentContractType,
} = require("../models/employmentContractTypeModel");
const { Job } = require("../models/jobModel");
const { Location } = require("../models/locationModel");
const { JobCategory } = require("../models/jobCategoryModel");
const { JobApplicationStatus } = require("../models/jobApplicationStatusModel");

const EmploymentContractTypes = [
  "Permanant",
  "Fixed term",
  "Contract",
  "Freelance",
  "Internship",
];

const SalaryTypes = ["Per annum", "Pro rata", "Hourly", "Commission"];

const Locations = [
  {
    name: "London Office - Camden",
    description: "A spacious and vibrant office in the heart of Camden",
  },
  {
    name: "Manchester Office - Northern Quater",
    description: "A spacious and vibrant office in the Northern Quater",
  },
];

const JobCategories = [
  {
    name: "Programming and technology",
    description: "",
  },
  {
    name: "Design and UX",
    description: "",
  },
];

const Jobs = [
  {
    title: "mid-weight UX designer",
    salary: "32000.000",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ac tortor ut turpis ornare molestie pretium tempor nibh. In aliquam accumsan sollicitudin. In id lectus pretium, efficitur magna eget, gravida augue. Integer venenatis vulputate elit, et volutpat mauris feugiat ut. Fusce at luctus nisi. Integer interdum gravida dignissim. Quisque mattis ligula ut ex elementum consequat. Nulla sit amet leo a leo congue fringilla. Suspendisse euismod quis metus eu fringilla. Sed facilisis eleifend odio dictum rhoncus. Mauris lobortis sapien a elit ultricies euismod. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc egestas at mi et dapibus. Duis rhoncus rutrum sem sit amet mollis. Nam magna ante, imperdiet vel nisl eget, sodales facilisis risus.",
    deadline: "2023-03-30",
    locations: [1, 2],
    categories: [2],
    contractType: 1,
    salaryType: 1,
    active: 1,
  },
  {
    title: "mid-weight front-end developer",
    salary: "32000.000",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ac tortor ut turpis ornare molestie pretium tempor nibh. In aliquam accumsan sollicitudin. In id lectus pretium, efficitur magna eget, gravida augue. Integer venenatis vulputate elit, et volutpat mauris feugiat ut. Fusce at luctus nisi. Integer interdum gravida dignissim. Quisque mattis ligula ut ex elementum consequat. Nulla sit amet leo a leo congue fringilla. Suspendisse euismod quis metus eu fringilla. Sed facilisis eleifend odio dictum rhoncus. Mauris lobortis sapien a elit ultricies euismod. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc egestas at mi et dapibus. Duis rhoncus rutrum sem sit amet mollis. Nam magna ante, imperdiet vel nisl eget, sodales facilisis risus.",
    deadline: "2023-04-30",
    locations: [1, 2],
    categories: [1],
    contractType: 1,
    salaryType: 1,
    active: 1,
  },
  {
    title: "mid-weight back-end developer",
    salary: "32000.000",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ac tortor ut turpis ornare molestie pretium tempor nibh. In aliquam accumsan sollicitudin. In id lectus pretium, efficitur magna eget, gravida augue. Integer venenatis vulputate elit, et volutpat mauris feugiat ut. Fusce at luctus nisi. Integer interdum gravida dignissim. Quisque mattis ligula ut ex elementum consequat. Nulla sit amet leo a leo congue fringilla. Suspendisse euismod quis metus eu fringilla. Sed facilisis eleifend odio dictum rhoncus. Mauris lobortis sapien a elit ultricies euismod. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc egestas at mi et dapibus. Duis rhoncus rutrum sem sit amet mollis. Nam magna ante, imperdiet vel nisl eget, sodales facilisis risus.",
    deadline: "2023-04-30",
    locations: [1, 2],
    categories: [1],
    contractType: 1,
    salaryType: 1,
    active: 1,
  },
  {
    title: "Lead developer",
    salary: "45000.000",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ac tortor ut turpis ornare molestie pretium tempor nibh. In aliquam accumsan sollicitudin. In id lectus pretium, efficitur magna eget, gravida augue. Integer venenatis vulputate elit, et volutpat mauris feugiat ut. Fusce at luctus nisi. Integer interdum gravida dignissim. Quisque mattis ligula ut ex elementum consequat. Nulla sit amet leo a leo congue fringilla. Suspendisse euismod quis metus eu fringilla. Sed facilisis eleifend odio dictum rhoncus. Mauris lobortis sapien a elit ultricies euismod. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc egestas at mi et dapibus. Duis rhoncus rutrum sem sit amet mollis. Nam magna ante, imperdiet vel nisl eget, sodales facilisis risus.",
    deadline: "2023-06-30",
    locations: [1, 2],
    categories: [1],
    contractType: 1,
    salaryType: 1,
    active: 1,
  },
  {
    title: "Lead UX designer",
    salary: "45000.000",
    salaryType: 1,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ac tortor ut turpis ornare molestie pretium tempor nibh. In aliquam accumsan sollicitudin. In id lectus pretium, efficitur magna eget, gravida augue. Integer venenatis vulputate elit, et volutpat mauris feugiat ut. Fusce at luctus nisi. Integer interdum gravida dignissim. Quisque mattis ligula ut ex elementum consequat. Nulla sit amet leo a leo congue fringilla. Suspendisse euismod quis metus eu fringilla. Sed facilisis eleifend odio dictum rhoncus. Mauris lobortis sapien a elit ultricies euismod. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc egestas at mi et dapibus. Duis rhoncus rutrum sem sit amet mollis. Nam magna ante, imperdiet vel nisl eget, sodales facilisis risus.",
    deadline: "2023-06-30",
    locations: [1, 2],
    categories: [2],
    contractType: 1,
    salaryType: 1,
    active: 1,
  },
];

const JobApplicationStatuses = [
  "Applied",
  "Interviewing",
  "Unsuccessful",
  "Successful",
  "Withdrawn",
];

async function main() {
  try {
    console.info("Building db tables.....");
    console.info("======");
    console.info("");
    console.info("");
    await relationships.initModels();
    console.info("DB Tables created - seeding db.....");
    console.info("======");
    console.info("");
    console.info("");
    console.info(
      "Seeding database with some employment contract types types:...."
    );
    console.info("======");
    console.info("");
    console.info("");
    const contractTypes = await Promise.all(
      EmploymentContractTypes.map(
        async (type) => await EmploymentContractType.create({ name: type })
      )
    );
    console.info("Seeding database with some salary types:....");
    console.info("======");
    console.info("");
    console.info("");
    const salaryTypes = await Promise.all(
      SalaryTypes.map(async (type) => await SalaryType.create({ name: type }))
    );
    console.info("Seeding database with some locations:....");
    console.info("======");
    console.info("");
    console.info("");
    const locations = await Promise.all(
      Locations.map(async (location) => await Location.create(location))
    );
    console.info(`created ${locations.length} locations...`);
    console.info("======");
    console.info("");
    console.info("");
    console.info("seeding database with job categories");
    console.info("======");
    console.info("");
    console.info("");
    const categories = await JobCategories.map(
      async (category) => await JobCategory.create(category)
    );
    console.info(`created ${categories.length} job categories...`);
    console.info("======");
    console.info("");
    console.info("");
    console.info("seeding database with some jobs data....");
    console.info("======");
    const jobs = await Promise.all(
      Jobs.map(async (job) => {
        const record = await Job.create(job);
        console.info("created job");
        console.info("");
        console.info("");
        console.info("======");
        console.info("creating job salary type relationship....");
        console.info("");
        console.info("");
        console.info("======");
        const jobSalaryType = await record.setSalaryType(job.salaryType);
        console.info("created job location relationship");
        console.info("");
        console.info("");
        console.info("======");
        console.info("creating job contract type relationship....");
        console.info("");
        console.info("");
        console.info("======");
        const contractType = await record.setEmploymentContractType(
          job.contractType
        );
        console.info("created job location relationship");
        console.info("");
        console.info("");
        console.info("======");
        console.info("creating job location relationship....");
        console.info("");
        console.info("");
        console.info("======");
        const jobLocations = await Promise.all(
          job.locations.map(
            async (location) => await record.addLocation(location)
          )
        );
        console.info("created job location relationships");
        console.info("");
        console.info("");
        console.info("======");
        console.info("creating job category relationship....");
        console.info("");
        console.info("");
        console.info("======");
        const jobCategories = await Promise.all(
          job.categories.map(
            async (category) => await record.addCategory(category)
          )
        );
        console.info("created job cateogry relationships");
      })
    );
    console.info("creating job application status table....");
    console.info("");
    console.info("");
    console.info("======");
    const applicationStatuses = await Promise.all(
      JobApplicationStatuses.map(
        async (status) => await JobApplicationStatus.create({ name: status })
      )
    );
    console.info("created job status table....");
    console.info("");
    console.info("");
    console.info("======");
    console.info("database seeded....");
    process.exit(0);
  } catch (error) {
    console.error(error);
  }
}
main();
