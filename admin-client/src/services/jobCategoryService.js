import { http } from '../utils/http';

const jobCategoryService = {
    async index(page = 1, sortOrder = 'asc') {
        const res = await http.get(`/job-categories?page=${page}&order=${sortOrder}`);
        return res;
    }
}

export default jobCategoryService;