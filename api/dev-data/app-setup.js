#!/usr/bin/env node

const relationships = require('../models/index');
const { Job } = require('../models/jobModel');
const { Location } = require('../models/locationModel');
const { JobCategory } = require('../models/jobCategoryModel');
const { JobApplicationStatus } = require('../models/jobApplicationStatusModel');

const Locations = [
  {
    id: 1,
    name: 'London Office - Camden',
    description: 'A spacious and vibrant office in the heart of Camden',
    active: '1',
  },
  {
    id: 2,
    name: 'Manchester Office - Northern Quater',
    description: 'A spacious and vibrant office in the Northern Quater',
    active: '1',
  },
];

const JobCategories = [
  {
    id: 1,
    name: 'Programming and technology',
    description: '',
    active: '1',
  },
  {
    id: 2,
    name: 'Design and UX',
    description: '',
    active: '1',
  },
];

const Jobs = [
  {
    title: 'mid-weight UX designer',
    salary: '32000.000',
    salaryType: 'per-annum',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ac tortor ut turpis ornare molestie pretium tempor nibh. In aliquam accumsan sollicitudin. In id lectus pretium, efficitur magna eget, gravida augue. Integer venenatis vulputate elit, et volutpat mauris feugiat ut. Fusce at luctus nisi. Integer interdum gravida dignissim. Quisque mattis ligula ut ex elementum consequat. Nulla sit amet leo a leo congue fringilla. Suspendisse euismod quis metus eu fringilla. Sed facilisis eleifend odio dictum rhoncus. Mauris lobortis sapien a elit ultricies euismod. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc egestas at mi et dapibus. Duis rhoncus rutrum sem sit amet mollis. Nam magna ante, imperdiet vel nisl eget, sodales facilisis risus.',
    deadline: '2023-03-30',
    locations: [1, 2],
    categories: [2],
  },
  {
    title: 'mid-weight front-end developer',
    salary: '32000.000',
    salaryType: 'per-annum',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ac tortor ut turpis ornare molestie pretium tempor nibh. In aliquam accumsan sollicitudin. In id lectus pretium, efficitur magna eget, gravida augue. Integer venenatis vulputate elit, et volutpat mauris feugiat ut. Fusce at luctus nisi. Integer interdum gravida dignissim. Quisque mattis ligula ut ex elementum consequat. Nulla sit amet leo a leo congue fringilla. Suspendisse euismod quis metus eu fringilla. Sed facilisis eleifend odio dictum rhoncus. Mauris lobortis sapien a elit ultricies euismod. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc egestas at mi et dapibus. Duis rhoncus rutrum sem sit amet mollis. Nam magna ante, imperdiet vel nisl eget, sodales facilisis risus.',
    deadline: '2023-03-30',
    locations: [1, 2],
    categories: [1],
  },
  {
    title: 'mid-weight back-end developer',
    salary: '32000.000',
    salaryType: 'per-annum',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ac tortor ut turpis ornare molestie pretium tempor nibh. In aliquam accumsan sollicitudin. In id lectus pretium, efficitur magna eget, gravida augue. Integer venenatis vulputate elit, et volutpat mauris feugiat ut. Fusce at luctus nisi. Integer interdum gravida dignissim. Quisque mattis ligula ut ex elementum consequat. Nulla sit amet leo a leo congue fringilla. Suspendisse euismod quis metus eu fringilla. Sed facilisis eleifend odio dictum rhoncus. Mauris lobortis sapien a elit ultricies euismod. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc egestas at mi et dapibus. Duis rhoncus rutrum sem sit amet mollis. Nam magna ante, imperdiet vel nisl eget, sodales facilisis risus.',
    deadline: '2023-03-30',
    locations: [1, 2],
    categories: [1],
  },
  {
    title: 'Lead developer',
    salary: '45000.000',
    salaryType: 'per-annum',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ac tortor ut turpis ornare molestie pretium tempor nibh. In aliquam accumsan sollicitudin. In id lectus pretium, efficitur magna eget, gravida augue. Integer venenatis vulputate elit, et volutpat mauris feugiat ut. Fusce at luctus nisi. Integer interdum gravida dignissim. Quisque mattis ligula ut ex elementum consequat. Nulla sit amet leo a leo congue fringilla. Suspendisse euismod quis metus eu fringilla. Sed facilisis eleifend odio dictum rhoncus. Mauris lobortis sapien a elit ultricies euismod. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc egestas at mi et dapibus. Duis rhoncus rutrum sem sit amet mollis. Nam magna ante, imperdiet vel nisl eget, sodales facilisis risus.',
    deadline: '2023-03-30',
    locations: [1, 2],
    categories: [1],
  },
  {
    title: 'Lead UX designer',
    salary: '45000.000',
    salaryType: 'per-annum',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ac tortor ut turpis ornare molestie pretium tempor nibh. In aliquam accumsan sollicitudin. In id lectus pretium, efficitur magna eget, gravida augue. Integer venenatis vulputate elit, et volutpat mauris feugiat ut. Fusce at luctus nisi. Integer interdum gravida dignissim. Quisque mattis ligula ut ex elementum consequat. Nulla sit amet leo a leo congue fringilla. Suspendisse euismod quis metus eu fringilla. Sed facilisis eleifend odio dictum rhoncus. Mauris lobortis sapien a elit ultricies euismod. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc egestas at mi et dapibus. Duis rhoncus rutrum sem sit amet mollis. Nam magna ante, imperdiet vel nisl eget, sodales facilisis risus.',
    deadline: '2023-03-30',
    locations: [1, 2],
    categories: [2],
  },
];

const JobApplicationStatuses = [
  'applied',
  'interviewing',
  'unsuccessful',
  'successful',
  'withdrawn',
];

async function main() {
  console.info('setting up database with seed data.....')
  console.info('');
  console.info('');
  console.info('Seeding database with some locations:....');
  console.info('');
  console.info('');
  const locations = await Locations.map(
    async (location) => await Location.create(location)
  );
  console.info(`created ${locations.length} locations...`);
  console.info('======');
  console.info('');
  console.info('');
  console.info(locations);
  console.info('');
  console.info('');
  console.info('======')
  console.info('seeding database with job categories');
  console.info('');
  console.info('');
  const categories = await JobCategories.map(
    async (category) => await JobCategory.create(category)
  );
  console.info(`created ${categories.length} job categories...`);
  console.info('======'); 
  console.info('');
  console.info('');
  console.info(categories);
  console.info('======');
  console.info('');
  console.info('');
  console.info('seeding database with some jobs data....');
  console.info('');
  console.info('');
  console.info('======');
  const data = await Promise.all([locations, categories]);

  const jobs = await Promise.all(Jobs.map(async (job) => {
    const record = await Job.create(job);
    console.info('created job....', record);
    console.info('');
    console.info('');
    console.info('======');
    console.info('creating job location relationship....')
    console.info('');
    console.info('');
    console.info('======');
    const jobLocations = await Promise.all(
      job.locations.map(async (location) => await record.addLocation(location))
    );
    console.info('created job location relationship', jobLocations);
    console.info('');
    console.info('');
    console.info('======');
    console.info('creating job category relationship....')
    console.info('');
    console.info('');
    console.info('======');
    console.info()
    const jobCategories = await Promise.all(
      job.categories.map(async (category) => await record.addCategory(category))
    );
    console.info('created job cateogry relationship', jobCategories);
  }));
  console.info('creating job status table....')
  console.info('');
  console.info('');
  console.info('======');
  const applicationStatuses = await Promise.all(JobApplicationStatuses.map(async (status) => await JobApplicationStatus.create({name: status})));
  console.info('created job status table....', applicationStatuses);
  console.info('');
  console.info('');
  console.info('======');
  console.info('database seeded....');
}

main();