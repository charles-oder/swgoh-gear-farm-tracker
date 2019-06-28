import Vue from 'vue';
import App from './App.vue';
import router from './router';
import Analytics from 'vue-analytics';

Vue.config.productionTip = false;

Vue.use(Analytics, { id: 'UA-69211559-3'});

new Vue({
    router,
    render: (h) => h(App),
}).$mount('#app');
