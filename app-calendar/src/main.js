import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
/*
* Config for Vuetextarea auto size
* DGUTIERREZ
*/
import VueTextareaAutosize from "vue-textarea-autosize";
Vue.use(VueTextareaAutosize);
//Vue.config.productionTip = false
import firebase from "firebase/app";
import "firebase/firestore";
/*
* Config for Firebase
* DGUTIERREZ 06-11-2019
*/
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCCuqANf-eZjAhkS41Y4PJ169BMkCjYEvA",
  authDomain: "app-calendar-7452e.firebaseapp.com",
  databaseURL: "https://app-calendar-7452e.firebaseio.com",
  projectId: "app-calendar-7452e",
  storageBucket: "app-calendar-7452e.appspot.com",
  messagingSenderId: "1036880014180",
  appId: "1:1036880014180:web:4851aa0853230b677be871"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//Export object DB
export const db = firebase.firestore();

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
