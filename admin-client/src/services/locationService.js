import { http } from '../utils/http';

const locationService = {
    async index(page = 1, sortOrder = 'asc') {
        const res = await http.get(`/locations?page=${page}&order=${sortOrder}`);
        return res;
    }
}

export default locationService;