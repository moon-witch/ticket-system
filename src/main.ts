import './assets/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/lara-dark-cyan/theme.css';
import 'primeicons/primeicons.css'
import ToastService from 'primevue/toastservice';


// icons
import {addIcons, OhVueIcon} from "oh-vue-icons";
import { HiArrowSmRight } from "oh-vue-icons/icons";
import { HiChartPie } from "oh-vue-icons/icons";
import { HiCollection } from "oh-vue-icons/icons";
import { HiCog } from "oh-vue-icons/icons";
import { HiLogout } from "oh-vue-icons/icons";
import { RiLoader5Fill } from "oh-vue-icons/icons";
import { HiAdjustments } from "oh-vue-icons/icons";
import { MdFibernewOutlined } from "oh-vue-icons/icons";
import { LaInfoCircleSolid } from "oh-vue-icons/icons";

addIcons(HiArrowSmRight, HiChartPie, HiCollection, HiCog, HiLogout, RiLoader5Fill, HiAdjustments, MdFibernewOutlined, LaInfoCircleSolid);

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue)
app.use(ToastService)

app.component("v-icon", OhVueIcon)
app.mount('#app')
