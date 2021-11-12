import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import isoWeek from 'dayjs/plugin/isoWeek';
import { Capacitor } from '@capacitor/core';
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import LocalStore from './Stores/LocalStore';
import WebStore from './Stores/WebStore';
import { Recipe } from './types/Recipe';
import apiClient from './plugins/axios';
import { Week } from './types/Week';
import { ShoppingList } from './types/ShoppingList';
import StoreHandler from './Stores/StoreHandler';

dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);

const plattformIsMobile = !!Capacitor.isNative;

const recipeLocalStore = new LocalStore<Recipe>('recipes.txt');
const recipeWebStore = new WebStore<Recipe>('/recipes/', apiClient);
export const recipeService = new StoreHandler<Recipe>({
  localStore: recipeLocalStore,
  webStore: recipeWebStore,
  plattformIsMobile,
});

const weekLocalStore = new LocalStore<Week>('week.txt');
const weekWebStore = new WebStore<Week>('/weekplans/', apiClient);
export const weekService = new StoreHandler<Week>({
  localStore: weekLocalStore,
  webStore: weekWebStore,
  plattformIsMobile,
});

const shoppingListLocalStore = new LocalStore<ShoppingList>('shoppingList.txt');
const shoppingListWebStore = new WebStore<ShoppingList>('/shopping-lists/', apiClient);
export const shoppingListService = new StoreHandler<ShoppingList>({
  localStore: shoppingListLocalStore,
  webStore: shoppingListWebStore,
  plattformIsMobile,
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
