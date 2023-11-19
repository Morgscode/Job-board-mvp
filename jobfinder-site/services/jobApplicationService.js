import { http } from "./http";

const ROUTE = "/job-applications";

const jobService = {
  async index(query = "") {
    const res = await http.get(`${ROUTE}?${query}`);
    if (res.status !== 200) throw new Error(res.status);
    return res.data.data.applications || [];
  },
  async find(id) {
    const res = await http.get(`${ROUTE}/${id}`);
    if (res.status !== 200) throw new Error(res.status);
    return res.data.data.application || false;
  },
  async create(application) {
    const res = await http.post(`${ROUTE}`, application);
    if (res.status !== 201) throw new Error(res.status);
    return res.data.data.application || false;
  },
  async withdraw(id) {
    const res = await http.put(`${ROUTE}/${id}/withdraw`);
    if (res.status !== 200) throw new Error(res.status);
    return true;
  },
};

export default jobService;
