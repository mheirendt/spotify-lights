import Vue from "vue";
import Router from "vue-router";
import ProfileView from "../components/profile-view";
import UserAuth from "../components/user-auth";
Vue.use(Router);

export default new Router({
    mode: "history",
    routes: [
        {
            path: "/",
            name: "Home",
            component: ProfileView
        },
        {
            path: "/login",
            name: "Login",
            component: UserAuth
        }
    ]
});