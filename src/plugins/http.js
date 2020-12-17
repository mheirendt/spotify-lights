import axios from "axios";
import Vue from "vue";
import Router from '../router/router';

axios.interceptors.request.use(req => {
    // There's gotta be a better way to get the $route outside of a component... but this works
    req.headers.authorization = "Bearer " + Router.app._route.query.access_token;
    return req;
});

axios.interceptors.response.use(
    res => res,
    async err => {
        if (err.response && err.response.status === 401) {
            if (Router.app._route.query.refresh_token) {
                const response = await axios.post('/api/token/refresh', {
                    refresh_token: Router.app._route.query.refresh_token
                });
                Router.push({
                    query:
                        response.data
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