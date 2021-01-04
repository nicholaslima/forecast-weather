

import axios from 'axios';


const api = axios.create({
        baseURL: 'https://community-open-weather-map.p.rapidapi.com',
});

export default api;
