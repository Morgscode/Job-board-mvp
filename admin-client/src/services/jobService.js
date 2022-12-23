import { http } from '../utils/http';

const ROUTE = '/jobs';

const jobService = {
  async index(page = 1, sortOrder = 'asc') {
    const res = await http.get(`${ROUTE}?page=${page}&order=${sortOrder}`);
    return res;
  },
  async find(id) {
    const res = await http.get(`${ROUTE}/${id}`, id);
    return res;
  },
  async create(job) {
    const res = await http.post(ROUTE, job);
    return res;
  },
  async update(job, id) {},
  async delete(id) {},
};

export default jobService;
