import { http } from "./http";

const ROUTE = "/jobs";

const jobService = {
  async index(query = "active=1") {
    const res = await http.get(`${ROUTE}?${query}`);
    if (res.status !== 200) throw new Error(res.status);
    return res.data.data || [];
  },
  async find(id) {
    const res = await http.get(`${ROUTE}/${id}`, id);
    if (res.status !== 200) throw new Error(res.status);
    return res.data.data.job || false;
  },
  async getPost(id) {
    const res = await http.get(`${ROUTE}/post/${id}`, id);
    if (res.status !== 200) throw new Error(res.status);
    return res.data.data.job || false;
  },
};

export default jobService;
