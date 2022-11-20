#!/usr/bin/env node

const relationships = require('../models/index');
const { Job } = require('../models/jobModel');
const { Location } = require('../models/locationModel');
const { JobCategory } = require('../models/jobCategoryModel');
const { JobApplicationStatus } = require('../models/jobApplicationStatusModel');

const User = [
  {
    email: 'luke@luke.com',
    password: '12345678',
  },
];

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
  'closed',
];

async function main() {
  const locations = await Locations.map(
    async (location) => await Location.create(location)
  );
  const categories = await JobCategories.map(
    async (category) => await JobCategory.create(category)
  );
  const data = await Promise.all([locations, categories]);

  const jobs = await Promise.all(Jobs.map(async (job) => {
    const record = await Job.create(job);
    const jobLocations = await Promise.all(
      job.locations.map(async (location) => await record.addLocation(location))
    );
    const jobCategories = await Promise.all(
      job.categories.map(async (category) => await record.addCategory(category))
    );
  }));
  const applicationStatuses = await Promise.all(JobApplicationStatuses.map(async (status) => await JobApplicationStatus.create({name: status})));
}

main();
