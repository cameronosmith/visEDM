import Vue from 'vue'
import Router from 'vue-router'
const routerOptions = [
  //{ path: '/home', component: 'Home' },
  //{ path: '/about', component: 'About' }
]
const routes = routerOptions.map(route => {
  return {
    ...route,
    component: () => import(`@/components/${route.component}.vue`)
  }
})
Vue.use(Router)
export default new Router({
  routes,
  mode: 'history'
})
