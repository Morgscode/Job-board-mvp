import { http } from '../utils/http';

const ROUTE = '/employment-contract-types';

const employmentContractTypeService = {
    async index(page = 1, sortOrder = 'asc') {
        const res = await http.get(`${ROUTE}?page=${page}&order=${sortOrder}`);
        if (res.status !== 200) throw new Error(res.status);
        return Array.from(res.data.data.contractTypes) || [];
    },
    async find(id) {
        const res = await http.get(`${ROUTE}/${id}`);
        if (res.status !== 200) throw new Error(res.status);
        return res.data.data.contractType || false;
    },
    async create(type) {
        const res = await http.post(ROUTE, type);
        if (res.status !== 201) throw new Error(res.status);
        return res.data.data.contractType;
    }
}

export default employmentContractTypeService;