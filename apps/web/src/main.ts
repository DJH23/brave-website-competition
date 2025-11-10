import { createApp } from "vue";
import { VueQueryPlugin } from "@tanstack/vue-query";
import { createHead } from "@vueuse/head";
import App from "./App.vue";
import router from "./router";
import "./style.css";
import "bootstrap-icons/font/bootstrap-icons.css";
// @ts-ignore: vue-audio-visual plugin UMD build import for Vite compatibility

// NOTE: Web3Modal is now lazily initialized in useWallet.ts on first connect
// This prevents wallet provider injection conflicts at page load
// Register v-network-graph globally
import VNetworkGraph from "v-network-graph";
import "v-network-graph/lib/style.css";

const app = createApp(App);
const head = createHead();

// Setup Vue Router
app.use(router);

// Setup VueUse Head for SEO
app.use(head);

// Setup Vue Query with default options
app.use(VueQueryPlugin, {
  queryClientConfig: {
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  },
});

// @ts-ignore
app.use(VNetworkGraph);

// Register PWA Service Worker (handled by vite-plugin-pwa in production)
// The plugin will inject the service worker registration automatically
import { registerSW } from "virtual:pwa-register";

if (import.meta.env.PROD) {
  registerSW({
    immediate: true,
    onNeedRefresh() {
      // New content available - user can refresh
    },
    onOfflineReady() {
      // App ready to work offline
    },
    onRegistered(registration) {
      // Check for updates periodically
      if (registration) {
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000); // Check every hour
      }
    },
    onRegisterError(error) {
      console.error("Service Worker registration failed:", error);
    },
  });
}

app.mount("#app");
