import { ref, type Ref } from "vue";

// Use a more flexible type that matches what WaveSurfer.create() actually returns
type WaveSurferInstance = {
  play: () => Promise<void>;
  pause: () => void;
  isPlaying: () => boolean;
};

// Global state to track the currently playing wavesurfer instance
const currentlyPlaying: Ref<WaveSurferInstance | null> = ref(null);

export function useAudioManager() {
  /**
   * Register a wavesurfer instance as the active player.
   * If another instance is already playing, it will be paused first.
   */
  const registerPlay = (wavesurfer: WaveSurferInstance) => {
    // If there's a different instance playing, pause it
    if (currentlyPlaying.value && currentlyPlaying.value !== wavesurfer) {
      currentlyPlaying.value.pause();
    }
    // Set this instance as the currently playing one
    currentlyPlaying.value = wavesurfer;
  };

  /**
   * Unregister a wavesurfer instance if it's the currently playing one.
   */
  const unregisterPlay = (wavesurfer: WaveSurferInstance) => {
    if (currentlyPlaying.value === wavesurfer) {
      currentlyPlaying.value = null;
    }
  };

  return {
    registerPlay,
    unregisterPlay,
  };
}
