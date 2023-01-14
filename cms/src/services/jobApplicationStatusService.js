import { http } from './http';

const ROUTE = '/job-application-statuses';

const jobService = {
  async index(query = '') {
    const res = await http.get(`${ROUTE}?${query}`);
    if (res.status !== 200) throw new Error(res.status);
    return res.data.data || [];
  },
  async find(id) {
    const res = await http.get(`${ROUTE}/${id}`, id);
    if (res.status !== 200) throw new Error(res.status);
    return res.data.data.status || false;
  },
  async update(job, id) {
    const res = await http.put(`${ROUTE}/${id}`, job);
    if (res.status !== 200) throw new Error(res.status);
    return res.data.data.status || false;
  },
  async delete(id) {
    const res = await http.delete(`${ROUTE}/${id}`);
    if (res.status !== 200) throw new Error(res.status);
    return true;
  },
};

export default jobService;
