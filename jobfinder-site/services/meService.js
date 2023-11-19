import { http } from "./http";

const ROUTE = "/me";

const meService = {
  async index() {
    const res = await http.get(`${ROUTE}`);
    if (res.status !== 200) throw new Error(res);
    return res.data.data.user || false;
  },
  async update(user) {
    const res = await http.put(`${ROUTE}`, user);
    if (res.status !== 200) throw new Error(res);
    return res.data.data.user || false;
  },
  async applications() {
    const res = await http.get(`${ROUTE}/job-applications`);
    if (res.status !== 200) throw new Error(res);
    return res.data.data.applications || [];
  },
};

export default meService;
