import { http } from './http';

const ROUTE = '/employment-contract-types';

const employmentContractTypeService = {
    async index(page = 1, sortOrder = 'asc') {
        const res = await http.get(`${ROUTE}?page=${page}&order=${sortOrder}`);
        if (res.status !== 200) throw new Error(res.status);
        return res.data.data.contractTypes || [];
    },
}

export default employmentContractTypeService;