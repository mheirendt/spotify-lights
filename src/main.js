import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import VueAxios from "vue-axios";
import axios from "axios";
import store from "./store";
import router from './router/router';
import vuetify from "./plugins/vuetify";

Vue.config.productionTip = false;

Vue.use(VueAxios, axios);

router.beforeEach((to, from, next) => {
  document.title = to.meta.title;
  return next();
});

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
