import { http } from '../utils/http';

const ROUTE = '/employment-contract-types';

const employmentContractTypeService = {
    async index(page = 1, sortOrder = 'asc') {
        const res = await http.get(`${ROUTE}?page=${page}&order=${sortOrder}`);
        return res;
    },
    async create(type) {
        const res = await http.post(ROUTE, type);
        return res;
    }
}

export default employmentContractTypeService;