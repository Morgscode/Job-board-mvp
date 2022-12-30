import { http } from './http';

const ROUTE = '/jobs';

const jobService = {
  async index(query = '') {
    const res = await http.get(`${ROUTE}?${query}`);
    if (res.status !== 200) throw new Error(res.status);
    return res.data.data.jobs || [];
  },
  async find(id) {
    const res = await http.get(`${ROUTE}/${id}`, id);
    if (res.status !== 200) throw new Error(res.status);
    return res.data.data.job || false;
  },
  async create(job) {
    const res = await http.post(ROUTE, job);
    if (res.status !== 201) throw new Error(res.status);
    return res.data.data.job || false;
  },
  async update(job, id) { 
    const res = await http.put(`${ROUTE}/${id}`, job);
    if (res.status !== 200) throw new Error(res.status);
    return res.data.data.job || false;
  },
  async delete(id) {
    const res = await http.delete(`${ROUTE}/${id}`);
    if (res.status !== 200) throw new Error(res.status);
    return true;
  },
  async query(query) {

  }
};

export default jobService;
