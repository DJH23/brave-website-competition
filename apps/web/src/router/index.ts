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
      title: "🎵 Special Feature",
      transition: "fade",
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Always scroll to top, ignore saved position
    return { top: 0, left: 0, behavior: "instant" };
  },
});

// Update page title on route change
router.beforeEach((to, from, next) => {
  document.title = (to.meta.title as string) || "Privacy-First Creator Hub";
  next();
});

export default router;
