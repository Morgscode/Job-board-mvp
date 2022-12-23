import { http } from '../utils/http';

const ROUTE = '/locations';

const locationService = {
  async index(page = 1, sortOrder = 'asc') {
    const res = await http.get(`${ROUTE}?page=${page}&order=${sortOrder}`);
    return res;
  },
  async findByJobId(id) {
    const res = await http.get(`${ROUTE}/jobs/${id}`);
    return res;
  },
};

export default locationService;
