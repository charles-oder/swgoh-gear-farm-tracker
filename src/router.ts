import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            redirect: '/characters',
        },
        {
            path: '/gear-needed-per-character',
            name: 'gear needed per character',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import(/* webpackChunkName: "about" */ './gear-needed/GearNeededPerCharacterView.vue'),
        },
        {
            path: '/gear-needed-total',
            name: 'gear needed total',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import(/* webpackChunkName: "about" */ './gear-needed/GearNeededTotal.vue'),
        },
        {
            path: '/gear-to-farm',
            name: 'gear to farm',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import(/* webpackChunkName: "about" */ './gear-needed/GearToFarm.vue'),
        },
        {
            path: '/locations-to-farm',
            name: 'locations to farm',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import(/* webpackChunkName: "about" */ './gear-needed/LocationsToFarm.vue'),
        },
        {
            path: '/gear-on-hand',
            name: 'gear on hand',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import(/* webpackChunkName: "about" */ './gear-on-hand/GearOnHand.vue'),
        },
        {
            path: '/characters',
            name: 'characters',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import(/* webpackChunkName: "about" */ './CharacterList/CharacterListView.vue'),
        },
    ],
});
