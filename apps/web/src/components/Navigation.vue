<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import BATLogo3DAsync from './BATLogo3DAsync.vue';

const route = useRoute();
const mobileMenuOpen = ref(false);
const navLoaded = ref(false);

const navItems = [
    { path: '/', label: 'Home', icon: 'bi-house-door', tooltip: 'Back to home', color: 'text-bravePink', bgColor: 'bg-bravePink' },
    { path: '/music', label: 'Creator Hub', icon: 'bi-music-note-beamed', tooltip: 'Creator Hub', color: 'text-braveOrange', bgColor: 'bg-braveOrange' },
    { path: '/wallet', label: 'BAT & Wallet Guide', icon: 'bi-wallet2', tooltip: 'BAT & Brave Wallet', color: 'text-braveBlue', bgColor: 'bg-braveBlue' },
    { path: '/surprise', label: 'Bonus Feature', icon: 'bi-gift', tooltip: 'Bonus Feature', color: 'text-bravePurple', bgColor: 'bg-bravePurple' }
];

const toggleMobileMenu = () => {
    mobileMenuOpen.value = !mobileMenuOpen.value;
};

onMounted(() => {
    // Trigger animation after a short delay
    setTimeout(() => {
        navLoaded.value = true;
    }, 100);
});
</script>

<template>
    <nav class="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
        <div class="w-full px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-20">
                <!-- Logo and Brand -->
                <RouterLink to="/" class="flex items-center gap-3 hover:opacity-80 transition-opacity group"
                    @click="mobileMenuOpen = false">
                    <Suspense>
                        <BATLogo3DAsync />
                        <template #fallback>
                            <div class="w-12 h-12 bg-purple-500/20 rounded-lg animate-pulse"></div>
                        </template>
                    </Suspense>
                    <span class="text-xl font-bold bg-gradient-to-r from-bravePurple to-braveOrange 
                                 bg-clip-text text-transparent hidden xs:block transition-all duration-700"
                        :class="{ 'opacity-0 -translate-x-4': !navLoaded, 'opacity-100 translate-x-0': navLoaded }">
                        Privacy Hub
                    </span>
                </RouterLink>

                <!-- Desktop Navigation -->
                <div class="hidden md:flex items-center gap-1">
                    <RouterLink v-for="(item, index) in navItems" :key="item.path" :to="item.path" class="group relative px-4 py-2 rounded-lg transition-all duration-200
                               hover:bg-white/10"
                        :class="route.path === item.path ? 'bg-white/10 text-white' : 'text-gray-300'"
                        :style="{ transitionDelay: `${index * 50}ms` }">
                        <!-- Tooltip -->
                        <div class="absolute -bottom-12 left-1/2 -translate-x-1/2 px-3 py-1 
                                    bg-black/90 text-white text-sm rounded-lg whitespace-nowrap
                                    opacity-0 group-hover:opacity-100 pointer-events-none
                                    transition-opacity duration-200">
                            {{ item.tooltip }}
                            <div class="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 
                                        bg-black/90 rotate-45"></div>
                        </div>

                        <span class="flex items-center gap-2 transition-all duration-700"
                            :class="{ 'opacity-0 translate-y-2': !navLoaded, 'opacity-100 translate-y-0': navLoaded }">
                            <i :class="['bi', item.icon, 'text-lg', item.color]" aria-hidden="true"></i>
                            <span class="font-medium">{{ item.label }}</span>
                        </span>

                        <!-- Active Indicator -->
                        <div v-if="route.path === item.path" :key="route.path"
                            class="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 rounded-full origin-left animate-slide-in"
                            :class="item.bgColor"></div>
                    </RouterLink>
                </div>

                <!-- Mobile Menu Button -->
                <button @click="toggleMobileMenu" class="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
                    aria-label="Toggle menu">
                    <svg v-if="!mobileMenuOpen" class="w-6 h-6 text-white" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    <svg v-else class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>

        <!-- Mobile Menu -->
        <Transition enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 -translate-y-4" enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition-all duration-200 ease-in" leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-4">
            <div v-if="mobileMenuOpen" class="md:hidden border-t border-white/10 glass-strong">
                <div class="px-4 py-4 space-y-2">
                    <RouterLink v-for="item in navItems" :key="item.path" :to="item.path"
                        @click="mobileMenuOpen = false"
                        class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors" :class="route.path === item.path
                            ? 'bg-white/10 text-white'
                            : 'text-gray-300 hover:bg-white/5'">
                        <i :class="['bi', item.icon, 'text-2xl', item.color]" aria-hidden="true"></i>
                        <div class="flex-1">
                            <div class="font-medium">{{ item.label }}</div>
                            <div class="text-sm text-gray-400">{{ item.tooltip }}</div>
                        </div>
                        <svg v-if="route.path === item.path" class="w-5 h-5 text-bravePurple" fill="currentColor"
                            viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clip-rule="evenodd" />
                        </svg>
                    </RouterLink>
                </div>
            </div>
        </Transition>
    </nav>

    <!-- Spacer to prevent content from hiding under fixed navbar -->
    <div class="h-20"></div>
</template>

<style scoped>
/* Add smooth hover effects */
a {
    position: relative;
}

/* Active indicator slide-in animation */
@keyframes slide-in {
    from {
        transform: translateX(-50%) scaleX(0);
        opacity: 0;
    }

    to {
        transform: translateX(-50%) scaleX(1);
        opacity: 1;
    }
}

.animate-slide-in {
    animation: slide-in 600ms cubic-bezier(0.22, 0.61, 0.36, 1);
}
</style>
