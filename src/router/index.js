import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/airports/search',
        name: 'airports-search',
        component: () => import('../views/AirportsSearch.vue'),
        meta: { title: 'Airports' },
    },
    {
        path: '/airports/airport/:icao',
        name: 'airport',
        component: () => import('../views/Airport.vue'),
        meta: { title: 'Airport' },
    },

    {
        path: '/flight/:icao',
        name: 'flight',
        component: () => import('../views/Flight.vue'),
        meta: { title: 'Flight' },
    },

    {
        path: '/about',
        name: 'about',
        component: () => import('../views/About.vue'),
        meta: { title: 'About' },
    },
    
    {
        path: "/:catchAll(.*)",
        redirect: '/airports/search'
    }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});
router.beforeEach((to, from, next) => {
    document.title = to.meta.title;
    next();
  });  

export default router;
