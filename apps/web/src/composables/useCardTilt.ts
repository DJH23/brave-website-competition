/**
 * Composable for 3D card tilt effect on mouse movement
 * Provides consistent card hover interaction across views
 */
export function useCardTilt() {
  const handleCardMouseMove = (event: MouseEvent) => {
    const card = event.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 50;
    const rotateY = -(x - centerX) / 50;

    card.style.transition =
      "transform 0.15s ease-out, box-shadow 0.15s ease-out";
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  };

  const handleCardMouseLeave = (event: MouseEvent) => {
    const card = event.currentTarget as HTMLElement;
    card.style.transition = "transform 0.5s ease, box-shadow 0.3s ease";
    card.style.transform =
      "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
  };

  return {
    handleCardMouseMove,
    handleCardMouseLeave,
  };
}
