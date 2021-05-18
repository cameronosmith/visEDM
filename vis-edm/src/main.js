import Vue from 'vue'
import App from './App.vue'


import { BootstrapVue } from 'bootstrap-vue'

// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
/*
  actions: {
      load_data (context) {
          const path = 'http://localhost:5000/get_data';
          return axios.post(path,{"hihi":4}).then((res) => {
              console.log("Successfully loaded data.")
              context.commit('set_data',res.data.data,res.data.header) 
          })
      }
  }
  */

new Vue({
  render: h => h(App),
}).$mount('#app')
