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
