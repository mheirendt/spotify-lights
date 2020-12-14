import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import "./plugins/http";
import store from "./store";
import router from './router/router';
import vuetify from "./plugins/vuetify";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
