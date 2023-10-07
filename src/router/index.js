import { createRouter, createWebHistory } from 'vue-router';
// import HomeView from '../views/Home.vue';

const routes = [
    {
        path: '/home',
        name: 'home',
        component: () => import(/* webpackChunkName: "about" */ '../views/Home.vue')
        // component: HomeView
    },
    {
        path: '/search',
        name: 'search',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/Search.vue')
    },
    {
        path: '/flight/:id',
        name: 'flight',
        component: () => import('../views/Flight.vue')
    },
    {
        path: "/:catchAll(.*)",
        redirect: '/home'
    }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
