import axios from "axios";
import Vue from "vue";
import Router from '../router/router';
import Cookie from 'js-cookie';

axios.interceptors.request.use(req => {
    // There's gotta be a better way to get the $route outside of a component... but this works
    const access_token = Cookie.get('access_token');
    req.headers.authorization = "Bearer " + access_token;
    return req;
});

axios.interceptors.response.use(
    res => res,
    async err => {
        if (err.response && err.response.status === 401) {
            const refresh_token = Cookie.get('refresh_token');
            console.log('refresh:', refresh_token);
            if (refresh_token) {
                const response = await axios.post('/api/token/refresh', {
                    refresh_token
                });
                Router.push({
                    query: response.data
                });
            } else {
                Router.push({ name: 'Login' });
            }
        } else {
            throw err;
        }
    }
);

Vue.$http = axios;