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
    err => {
        console.log(err);
        if (err.response.status === 401) {
            Router.push({ name: 'Login' });
        } else {
            throw err;
        }
    }
);

Vue.$http = axios;