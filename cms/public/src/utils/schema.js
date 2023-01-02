import moment from 'moment';

export const job = Object.freeze({
  title: '',
  salary: '0.00',
  salaryType: '',
  contractType: '',
  locations: [],
  categories: [],
  description: '<p>Make it snappy...</p>',
  deadline: moment().format('YYYY-MM-DD'),
  active: 1,
});

export const location = Object.freeze({
  name: '',
  description: '<p></p>',
});

export const jobCategory = Object.freeze({
  name: '',
  description: '<p></p>',
});

export const salaryType = Object.freeze({
  name: '',
});

export const employmentContractType = Object.freeze({
  name: '',
});

export const user = Object.freeze({
  email: '',
  title: '',
  first_name: '',
  surname: '',
  middle_names: '',
  role: 2,
  password: '',
});

export const upload = Object.freeze({
  title: '',
  name: '',
  path: '',
  mimetype: '',
  user_id: '',
  createdAt: moment(),
  updatedAt: moment(),
  deletedAt: null,
});
