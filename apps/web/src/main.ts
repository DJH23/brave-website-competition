import { createApp } from "vue";
import { VueQueryPlugin } from "@tanstack/vue-query";
import { createHead } from "@vueuse/head";
import App from "./App.vue";
import router from "./router";
import "./style.css";
import "bootstrap-icons/font/bootstrap-icons.css";
// @ts-ignore: vue-audio-visual plugin UMD build import for Vite compatibility

// Import Web3Modal configuration (initializes the modal)
import "./config/web3";
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
      console.log("🔄 New content available, please refresh.");
    },
    onOfflineReady() {
      console.log("✅ App ready to work offline.");
    },
    onRegistered(registration) {
      console.log("✅ PWA Service Worker registered");

      // Check for updates periodically
      if (registration) {
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000); // Check every hour
      }
    },
    onRegisterError(error) {
      console.error("❌ Service Worker registration failed:", error);
    },
  });
}

app.mount("#app");
