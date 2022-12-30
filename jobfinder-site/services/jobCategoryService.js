import { http } from './http';

const ROUTE = '/job-categories';

const jobCategoryService = {
  async index(page = 1, sortOrder = 'asc') {
    const res = await http.get(`${ROUTE}?page=${page}&order=${sortOrder}`);
    if (res.status !== 200) throw new Error(res.status);
    return res.data.data.categories || [];
  },
  async find(id) {
    const res = await http.get(`${ROUTE}/${id}`, id);
    if (res.status !== 200) throw new Error(res.status);
    return res.data.data.category || false;
  },
  async create(category) {
    const res = await http.post(ROUTE, category);
    if (res.status !== 201) throw new Error(res.status);
    return res.data.data.category || false;
  },
  async update(category, id) {
    const res = await http.put(`${ROUTE}/${id}`, category);
    if (res.status !== 200) throw new Error(res.status);
    return res.data.data.category || false;
  },
  async delete(id) {
    const res = await http.delete(`${ROUTE}/${id}`);
    if (res.status !== 200) throw new Error(res.status);
    return true;
  },
  async findByJobId(id) {
    const res = await http.get(`${ROUTE}/jobs/${id}`);
    if (res.status !== 200) throw new Error(res.status);
    return res.data.data.categories || [];
  },
};

export default jobCategoryService;
