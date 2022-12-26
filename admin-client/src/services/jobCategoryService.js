import { http } from '../utils/http';

const ROUTE = '/job-categories';

const jobCategoryService = {
  async index(page = 1, sortOrder = 'asc') {
    const res = await http.get(`${ROUTE}?page=${page}&order=${sortOrder}`);
    if (res.status !== 200) throw new Error(res.status);
    return Array.from(res.data.data.categories) || [];
  },
  async findByJobId(id) {
    const res = await http.get(`${ROUTE}/jobs/${id}`);
    if (res.status !== 200) throw new Error(res.status);
    return Array.from(res.data.data.categories) || [];
  },
};

export default jobCategoryService;
