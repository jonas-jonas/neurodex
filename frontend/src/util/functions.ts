export const requestFullscreen = (element: HTMLElement) => {
  if ('requestFullscreen' in element) {
    element.requestFullscreen();
  }
};

export const exitFullscreen = () => {
  if ('exitFullscreen' in document) {
    document.exitFullscreen();
  }
};
