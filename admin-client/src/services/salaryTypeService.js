import { http } from '../utils/http';

const salaryTypeService = {
    async index(page = 1, sortOrder = 'asc') {
        const res = await http.get(`/salary-types?page=${page}&order=${sortOrder}`);
        if (res.status !== 200) throw new Error(res.status);
        return Array.from(res.data.data.salaryTypes) || [];
    }
}

export default salaryTypeService;