import { http } from './http';

const ROUTE = '/me';

const meService = {
  async index(token) {
    const res = await http.get(`${ROUTE}`, {headers: {'Authorization': `Bearer ${token}`}});
    if (res.status !== 200) throw new Error(res);
    return res.data.data.user || false;
  },
  async update(user) {
    const res = await http.put(`${ROUTE}`, user);
    if (res.status !== 200) throw new Error(res);
    return res.data.data.user || false;
  },
  async applications(token) {
    const res = await http.get(`${ROUTE}/job-applications`, {headers: {'Authorization': `Bearer ${token}`}});
    if (res.status !== 200) throw new Error(res);
    return res.data.data.applications || [];
  },
  async uploads(token) {
    const res = await http.get(`${ROUTE}/uploads`, {headers: {'Authorization': `Bearer ${token}`}});
    if (res.status !== 200) throw new Error(res);
    return res.data.data.uploads || [];
  },
};

export default meService;
