import Vue from 'vue'
import App from './components/App'
import router from './router'

import { BootstrapVue } from 'bootstrap-vue'

// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false


export const bus = new Vue();

/* eslint-disable no-new */
//new Vue({
//  el: '#app',
//  router,
//  render: h => h(App)
//})

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
new Vue({
  render: h => h(App),
}).$mount('#app')
