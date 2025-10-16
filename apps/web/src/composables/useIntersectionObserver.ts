import { ref, onMounted, onUnmounted, type Ref } from "vue";

export interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  rootMargin?: string;
  once?: boolean;
}

export function useIntersectionObserver(
  target: Ref<Element | null>,
  options: UseIntersectionObserverOptions = {}
) {
  const isVisible = ref(false);
  const hasBeenVisible = ref(false);
  let observer: IntersectionObserver | null = null;

  const { threshold = 0.1, rootMargin = "0px", once = true } = options;

  onMounted(() => {
    if (!target.value) return;

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible.value = entry.isIntersecting;

          if (entry.isIntersecting) {
            hasBeenVisible.value = true;

            // Stop observing after first intersection if 'once' is true
            if (once && observer) {
              observer.disconnect();
            }
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(target.value);
  });

  onUnmounted(() => {
    if (observer) {
      observer.disconnect();
    }
  });

  return {
    isVisible,
    hasBeenVisible,
  };
}
