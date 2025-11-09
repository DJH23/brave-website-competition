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

// Helper: wait for an element to appear (lazy-loaded views / transitions)
function waitForEl(
  selector: string,
  maxAttempts = 30,
  interval = 50
): Promise<{ el: string; behavior: ScrollBehavior } | { top: number }> {
  return new Promise((resolve) => {
    let attempts = 0;
    const check = () => {
      const el = document.querySelector(selector);
      if (el) {
        resolve({ el: selector, behavior: "smooth" });
        return;
      }
      attempts++;
      if (attempts >= maxAttempts) {
        // Fallback: just go to top if anchor never appears
        resolve({ top: 0 });
        return;
      }
      setTimeout(check, interval);
    };
    // Start checking after next frame (ensures component mount cycle begins)
    requestAnimationFrame(check);
  });
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;

    if (to.hash) {
      // Immediate attempt first; if not found, wait.
      if (document.querySelector(to.hash)) {
        return { el: to.hash, behavior: "smooth" };
      }
      return waitForEl(to.hash);
    }
    return { top: 0 };
  },
});

// Update page title on route change (no scroll logic here)
router.beforeEach((to, _from, next) => {
  document.title = (to.meta.title as string) || "Privacy-First Creator Hub";
  next();
});

export default router;
