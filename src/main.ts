/* eslint-disable no-plusplus */
/* eslint-disable import/no-extraneous-dependencies */
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/store';

const app = createApp(App);

app.use(router);
app.mount('#app');
// app.use(store);
