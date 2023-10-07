import { createApp } from 'vue';
import App from './App.vue';

import router from './router';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faEnvelope, faGlobe, faHouse, faMagnifyingGlass, faPlaneArrival, faPlaneDeparture, faSquarePhone } from '@fortawesome/free-solid-svg-icons';
import { faSquareTwitter } from '@fortawesome/free-brands-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';

library.add(faEnvelope);
library.add(faGlobe);
library.add(faHouse);
library.add(faMagnifyingGlass);
library.add(faPlaneArrival);
library.add(faPlaneDeparture);
library.add(faSquarePhone);
library.add(faSquareTwitter);

createApp(App).use(router).component('font-awesome-icon', FontAwesomeIcon).mount('#app');
