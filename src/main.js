import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false;

// libraries
import VueKonva from 'vue-konva'

// global register
Vue.use(VueKonva)

new Vue({
    render: h => h(App)
}).$mount('#app')
