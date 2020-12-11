import Vue from 'vue';
import Router from 'vue-router';
import ProfileView from "../components/profile-view.vue";
Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'Home',
            component: ProfileView,
            meta: {
                title: 'Spotify',
            },
        },
    ]
});