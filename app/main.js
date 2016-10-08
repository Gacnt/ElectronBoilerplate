/*jshint esversion:6*/

import Vue from 'vue';
import {ipcRenderer} from 'electron';
import App from './App.vue';
import VueRouter from 'vue-router';
import Home from './views/Home.vue';

(function() {
  "use strict";

  Vue.use(VueRouter);

  const router = new VueRouter({
      routes: [
          { path: '/', name: 'home', component: Home },
      ]
  });

  new Vue({ 
      router, 
      el: 'app',
      components: {App}
  });

}());

