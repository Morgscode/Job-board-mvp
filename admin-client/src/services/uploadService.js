import { http } from './http';

const ROUTE = '/uploads';

const userService = {
  async index(page = 1, sortOrder = 'asc') {
    const res = await http.get(`${ROUTE}?page=${page}&order=${sortOrder}`);
    if (res.status !== 200) throw new Error(res.status);
    return res.data.data.uploads || [];
  },
  async find(id) {
    const res = await http.get(`${ROUTE}/${id}`, id);
    if (res.status !== 200) throw new Error(res.status);
    return res.data.data.upload || false;
  },
  async create(location) {
    const res = await http.post(ROUTE, location);
    if (res.status !== 201) throw new Error(res.status);
    return res.data.data.upload || false;
  },
  async update(location, id) { 
    const res = await http.put(`${ROUTE}/${id}`, location);
    if (res.status !== 200) throw new Error(res.status);
    return res.data.data.upload || false;
  },
  async delete(id) {
    const res = await http.delete(`${ROUTE}/${id}`);
    if (res.status !== 200) throw new Error(res.status);
    return true;
  },
  async download(id) {
    const res = await http.get(`${ROUTE}/${id}/download`, { responseType: 'blob' });
    if (res.status !== 200) throw new Error(res.status);
    return res;
  },
};

export default userService;
