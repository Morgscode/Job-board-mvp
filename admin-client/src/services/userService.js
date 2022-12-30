import { http } from './http';

const ROUTE = '/users';

const userService = {
  async index(query = '') {
    const res = await http.get(`${ROUTE}?page=${page}&order=${sortOrder}`);
    if (res.status !== 200) throw new Error(res.status);
    return res.data.data.users || [];
  },
  async find(id) {
    const res = await http.get(`${ROUTE}/${id}`, id);
    if (res.status !== 200) throw new Error(res.status);
    return res.data.data.user || false;
  },
  async create(location) {
    const res = await http.post(ROUTE, location);
    if (res.status !== 201) throw new Error(res.status);
    return res.data.data.user || false;
  },
  async update(location, id) { 
    const res = await http.put(`${ROUTE}/${id}`, location);
    if (res.status !== 200) throw new Error(res.status);
    return res.data.data.user || false;
  },
  async delete(id) {
    const res = await http.delete(`${ROUTE}/${id}`);
    if (res.status !== 200) throw new Error(res.status);
    return true;
  },
};

export default userService;
