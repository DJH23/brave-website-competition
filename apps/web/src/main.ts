import { createApp } from "vue";
import { VueQueryPlugin } from "@tanstack/vue-query";
import App from "./App.vue";
import "./style.css";
// @ts-ignore: vue-audio-visual plugin UMD build import for Vite compatibility

// Import Web3Modal configuration (initializes the modal)
import "./config/web3";
// Register v-network-graph globally
import VNetworkGraph from "v-network-graph";
import "v-network-graph/lib/style.css";

const app = createApp(App);

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

app.mount("#app");
