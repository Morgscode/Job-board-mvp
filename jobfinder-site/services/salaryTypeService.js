import { http } from "./http";

const salaryTypeService = {
  async index(query = "") {
    const res = await http.get(`/salary-types?${query}`);
    if (res.status !== 200) throw new Error(res.status);
    return res.data.data.salaryTypes || [];
  },
};

export default salaryTypeService;
