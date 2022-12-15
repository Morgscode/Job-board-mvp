import { http } from '../utils/http';

const salaryTypeService = {
    async index(page = 1, sortOrder = 'asc') {
        const res = await http.get(`/salary-types?page=${page}&order=${sortOrder}`);
        return res;
    }
}

export default salaryTypeService;