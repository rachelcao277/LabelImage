

export default function preloader() {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  const preloader = document.querySelector('#preloader') as HTMLDivElement;
  const loader = document.querySelector('.loader') as HTMLDivElement;
  preloader.style.width = screenWidth + 'px';
  preloader.style.height = screenHeight + 'px';
  loader.style.display = 'block';

  window.onload = function() {
    preloader.style.display = 'none';
  };
}

// export default {
//   main
// };
