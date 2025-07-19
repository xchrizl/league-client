/**
 * This file will automatically be loaded by vite and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/process-model
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.ts` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */
import { createApp } from "vue";
import App from "./App.vue";
import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "./views/HomeView.vue";
import DebugView from "./views/DebugView.vue";
import "./style.css";
import "@mdi/font/css/materialdesignicons.css";
import CollectionView from "./views/CollectionView.vue";
import LootView from "./views/LootView.vue";
import StoreView from "./views/StoreView.vue";
import SettingsView from "./views/SettingsView.vue";
import ChampSelectView from "./views/ChampSelectView.vue";
import LobbyView from "./views/LobbyView.vue";
import PlayView from "./views/PlayView.vue";

// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import ProfileView from "./views/ProfileView.vue";

const app = createApp(App);

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: "dark",
  },
});

const routes = [
  { path: "/", component: HomeView },
  { path: "/debug", component: DebugView },
  { path: "/collection", component: CollectionView },
  { path: "/loot", component: LootView },
  { path: "/store", component: StoreView },
  { path: "/settings", component: SettingsView, props: true },
  { path: "/champ-select", component: ChampSelectView },
  { path: "/lobby", component: LobbyView },
  { path: "/play", component: PlayView },
  { path: "/profile", component: ProfileView },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

app.use(router);
app.use(vuetify);

app.mount("#app");
