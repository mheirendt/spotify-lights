import Vue from "vue";
import Router from "vue-router";
import ProfileView from "../components/profile-view";
import TrackVisualizer from "../components/track-visualizer";
import TrackSetup from "../components/track-setup";
import UserAuth from "../components/user-auth";
Vue.use(Router);

export default new Router({
    mode: "history",
    routes: [
        {
            path: "/",
            redirect: "/visualize",
            name: "Home",
            component: ProfileView,
            children: [
                {
                    path: "visualize",
                    component: TrackVisualizer
                },
                {
                    path: "setup",
                    component: TrackSetup
                }
            ]
        },
        {
            path: "/login",
            name: "Login",
            component: UserAuth
        }
    ]
});