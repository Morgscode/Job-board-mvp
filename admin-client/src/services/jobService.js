import { http } from './http';

const jobService = {
    async index(page = 1, order = 'asc') {
        const res = await http.get(`/jobs?page=${page}`);
        return res;
    }
}

export default jobService;