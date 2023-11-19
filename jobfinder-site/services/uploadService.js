import { http } from "./http";

const ROUTE = "/uploads";

const userService = {
  async index(query = "") {
    const res = await http.get(`${ROUTE}?${query}`);
    if (res.status !== 200) throw new Error(res.status);
    return res.data.data.uploads || [];
  },
  async find(id) {
    const res = await http.get(`${ROUTE}/${id}`, id);
    if (res.status !== 200) throw new Error(res.status);
    return res.data.data.upload || false;
  },
  async create(upload) {
    const res = await http.post(ROUTE, upload);
    if (res.status !== 201) throw new Error(res.status);
    return res.data.data.uploads || false;
  },
  async update(upload, id) {
    const res = await http.put(`${ROUTE}/${id}`, upload);
    if (res.status !== 200) throw new Error(res.status);
    return res.data.data.upload || false;
  },
  async delete(id) {
    const res = await http.delete(`${ROUTE}/${id}`);
    if (res.status !== 200) throw new Error(res.status);
    return true;
  },
  async download(id) {
    const res = await http.get(`${ROUTE}/${id}/download`, {
      responseType: "blob",
    });
    if (res.status !== 200) throw new Error(res.status);
    return res;
  },
};

export default userService;
