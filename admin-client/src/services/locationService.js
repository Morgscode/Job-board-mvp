import { http } from '../utils/http';

const ROUTE = '/locations';

const locationService = {
  async index(page = 1, sortOrder = 'asc') {
    const res = await http.get(`${ROUTE}?page=${page}&order=${sortOrder}`);
    if (res.status !== 200) throw new Error(res.status);
    return Array.from(res.data.data.locations) || [];
  },
  async find(id) {
    const res = await http.get(`${ROUTE}/${id}`, id);
    if (res.status !== 200) throw new Error(res.status);
    return res.data.data.location || false;
  },
  async create(location) {
    const res = await http.post(ROUTE, location);
    if (res.status !== 201) throw new Error(res.status);
    return res.data.data.location || false;
  },
  async update(location, id) { 
    const res = await http.put(`${ROUTE}/${id}`, location);
    if (res.status !== 200) throw new Error(res.status);
    return true;
  },
  async delete(id) {
    const res = await http.delete(`${ROUTE}/${id}`);
    if (res.status !== 200) throw new Error(res.status);
    return true;
  },
  async findByJobId(id) {
    const res = await http.get(`${ROUTE}/jobs/${id}`);
    if (res.status !== 200) throw new Error(res.status);
    return Array.from(res.data.data.locations) || [];
  },
};

export default locationService;
