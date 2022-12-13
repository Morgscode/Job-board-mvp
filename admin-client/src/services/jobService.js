import { http } from '../utils/http';

const jobService = {
    async index(page = 1, sortOrder = 'asc') {
        const res = await http.get(`/jobs?page=${page}&order=${sortOrder}`);
        return res;
    }
}

export default jobService;