import { ref, onMounted, onBeforeUnmount } from "vue";

export function useLazyLoad() {
  const isIntersecting = ref(false);
  const targetRef = ref<HTMLElement | null>(null);

  let observer: IntersectionObserver | null = null;

  onMounted(() => {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isIntersecting.value = true;
            // Once loaded, disconnect the observer
            if (observer && targetRef.value) {
              observer.unobserve(targetRef.value);
            }
          }
        });
      },
      {
        rootMargin: "50px", // Start loading slightly before element is visible
        threshold: 0.01,
      }
    );

    if (targetRef.value) {
      observer.observe(targetRef.value);
    }
  });

  onBeforeUnmount(() => {
    if (observer && targetRef.value) {
      observer.unobserve(targetRef.value);
    }
  });

  return {
    targetRef,
    isIntersecting,
  };
}
