import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/HomeView.vue"),
    meta: {
      title: "Home - Privacy-First Creator Hub",
      transition: "fade",
    },
  },
  {
    path: "/creator-hub",
    name: "CreatorHub",
    component: () => import("../views/MusicHubView.vue"),
    meta: {
      title: "Creator Hub - Premium Creations",
      transition: "slide-left",
    },
  },
  {
    path: "/wallet",
    name: "Wallet",
    component: () => import("../views/WalletView.vue"),
    meta: {
      title: "Brave Wallet & BAT",
      transition: "slide-left",
    },
  },
  {
    path: "/search",
    name: "Search",
    component: () => import("../views/SearchView.vue"),
    meta: {
      title: "Brave Search - Private Search",
      transition: "slide-left",
    },
  },
  {
    path: "/privacy",
    name: "Privacy",
    component: () => import("../views/PrivacyDemoView.vue"),
    meta: {
      title: "Privacy Demos - See Your Protection",
      transition: "slide-left",
    },
  },
  {
    path: "/surprise",
    name: "Surprise",
    component: () => import("../views/RickRollView.vue"),
    meta: {
      title: "Bonus Feature",
      transition: "fade",
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Update page title on route change
router.beforeEach((to, _from, next) => {
  document.title = (to.meta.title as string) || "Privacy-First Creator Hub";
  next();
});

// Handle hash navigation after component is mounted
router.afterEach((to) => {
  if (to.hash === "#get-set-up") {
    // Wait for the element to appear in the DOM
    const checkElement = () => {
      const element = document.querySelector(to.hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        // Try again on next frame
        requestAnimationFrame(checkElement);
      }
    };
    // Start checking after a brief delay to let the component mount
    setTimeout(checkElement, 50);
  }
});

export default router;
