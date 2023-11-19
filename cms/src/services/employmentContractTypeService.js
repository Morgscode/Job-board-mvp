import { http } from "./http";

const ROUTE = "/employment-contract-types";

const employmentContractTypeService = {
  async index(query = "") {
    const res = await http.get(`${ROUTE}?${query}`);
    if (res.status !== 200) throw new Error(res.status);
    return res.data.data || [];
  },
};

export default employmentContractTypeService;
