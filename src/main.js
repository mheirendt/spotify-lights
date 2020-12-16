import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import "./plugins/http";
import store from "./store";
import router from './router/router';
import vuetify from "./plugins/vuetify";
import filters from './filters';

Vue.config.productionTip = false;

Object.keys(filters).forEach(filter => Vue.filter(filter, filters[filter]));

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
