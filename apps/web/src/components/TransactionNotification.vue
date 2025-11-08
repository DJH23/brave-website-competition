<script setup lang="ts">
import { ref, watch } from 'vue';

export interface NotificationProps {
    show: boolean;
    type: 'success' | 'error' | 'info';
    title: string;
    message: string;
    txSignature?: string;
    chain?: 'ethereum' | 'solana';
    downloadUrl?: string;
    downloadFilename?: string;
}

const props = withDefaults(defineProps<NotificationProps>(), {
    show: false,
    type: 'info',
    title: '',
    message: '',
});

const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'download'): void;
}>();

const handleDownload = () => {
    if (props.downloadUrl) {
        const link = document.createElement('a');
        link.href = props.downloadUrl;
        link.download = props.downloadFilename || 'track.mp3';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    emit('download');
};

const localShow = ref(props.show);

watch(() => props.show, (newVal) => {
    localShow.value = newVal;
    if (newVal) {
        // Auto-close after 5 seconds for success, 7 seconds for error
        setTimeout(() => {
            handleClose();
        }, props.type === 'success' ? 5000 : 7000);
    }
});

const handleClose = () => {
    localShow.value = false;
    emit('close');
};

const getExplorerUrl = () => {
    if (!props.txSignature) return '';

    if (props.chain === 'solana') {
        return `https://solscan.io/tx/${props.txSignature}`;
    } else if (props.chain === 'ethereum') {
        return `https://etherscan.io/tx/${props.txSignature}`;
    }
    return '';
};

const getIconColor = () => {
    switch (props.type) {
        case 'success':
            return 'text-green-400';
        case 'error':
            return 'text-red-400';
        case 'info':
            return 'text-blue-400';
        default:
            return 'text-blue-400';
    }
};

const getBorderColor = () => {
    switch (props.type) {
        case 'success':
            return 'border-green-500/50';
        case 'error':
            return 'border-red-500/50';
        case 'info':
            return 'border-blue-500/50';
        default:
            return 'border-blue-500/50';
    }
};
</script>

<template>
    <Teleport to="body">
        <Transition enter-active-class="transition ease-out duration-300" enter-from-class="translate-y-2 opacity-0"
            enter-to-class="translate-y-0 opacity-100" leave-active-class="transition ease-in duration-200"
            leave-from-class="translate-y-0 opacity-100" leave-to-class="translate-y-2 opacity-0">
            <div v-if="localShow" class="fixed top-4 right-4 z-[9999] max-w-md w-full" role="alert" aria-live="polite">
                <div class="glass-strong rounded-xl p-4 border-2 shadow-2xl backdrop-blur-xl"
                    :class="[getBorderColor()]">
                    <div class="flex items-start gap-3">
                        <!-- Icon -->
                        <div class="flex-shrink-0">
                            <!-- Success Icon -->
                            <svg v-if="type === 'success'" :class="getIconColor()" class="w-6 h-6" fill="currentColor"
                                viewBox="0 0 20 20" aria-hidden="true">
                                <path fill-rule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                    clip-rule="evenodd" />
                            </svg>

                            <!-- Error Icon -->
                            <svg v-else-if="type === 'error'" :class="getIconColor()" class="w-6 h-6"
                                fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                <path fill-rule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                                    clip-rule="evenodd" />
                            </svg>

                            <!-- Info Icon -->
                            <svg v-else :class="getIconColor()" class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"
                                aria-hidden="true">
                                <path fill-rule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                                    clip-rule="evenodd" />
                            </svg>
                        </div>

                        <!-- Content -->
                        <div class="flex-1 min-w-0">
                            <h4 class="text-base font-semibold text-white mb-1">
                                {{ title }}
                            </h4>
                            <p class="text-sm text-neutral-300 mb-2">
                                {{ message }}
                            </p>

                            <!-- Download Button -->
                            <button v-if="downloadUrl" @click="handleDownload"
                                class="inline-flex items-center gap-2 px-4 py-2 mb-2 rounded-lg bg-gradient-to-r from-braveOrange via-bravePink to-bravePurple text-white font-semibold text-sm hover:opacity-90 transition-opacity">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                    aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                <span>Download Track</span>
                            </button>

                            <!-- Transaction Link -->
                            <a v-if="txSignature && chain" :href="getExplorerUrl()" target="_blank"
                                rel="noopener noreferrer"
                                class="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors">
                                <span>View on {{ chain === 'solana' ? 'Solscan' : 'Etherscan' }}</span>
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                    aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        </div>

                        <!-- Close Button -->
                        <button @click="handleClose"
                            class="flex-shrink-0 text-neutral-400 hover:text-white transition-colors"
                            aria-label="Close notification">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <!-- Progress Bar -->
                    <div v-if="type === 'success' || type === 'info'"
                        class="mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div class="h-full bg-gradient-to-r from-braveOrange via-bravePink to-bravePurple animate-progress"
                            :style="{ animationDuration: type === 'success' ? '5s' : '7s' }"></div>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
@keyframes progress {
    from {
        width: 100%;
    }

    to {
        width: 0%;
    }
}

.animate-progress {
    animation: progress linear forwards;
}
</style>
