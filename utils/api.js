
import axios from 'axios';
import { removeAuthCookie } from './auth-cookies';
import Cookies from 'js-cookie';

const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Cookies.get('jwt')}`,
    },
});

instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 401) {
            // If unauthorized, remove the JWT token cookie
            removeAuthCookie('jwt');
        }
        return Promise.reject(error);
    }
);

export default instance;