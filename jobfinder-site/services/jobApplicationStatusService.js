import { http } from "./http";

const ROUTE = "/job-application-statuses";

const jobService = {
  async index(query = "") {
    const res = await http.get(`${ROUTE}?${query}`);
    if (res.status !== 200) throw new Error(res.status);
    return res.data.data.statuses || [];
  },
  async find(id) {
    const res = await http.get(`${ROUTE}/${id}`, id);
    if (res.status !== 200) throw new Error(res.status);
    return res.data.data.status || false;
  },
};

export default jobService;
