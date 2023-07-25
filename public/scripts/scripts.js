const FARBA = {
  WH: window.innerHeight,

  WW: document.documentElement.clientWidth,

  isTouch: 'ontouchstart' in window || navigator.msMaxTouchPoints,

  //lazy load для сторонних либ
  lazyLibraryLoad(scriptSrc, linkHref, callback) {
    let script;
    const domScript = document.querySelector(`script[src="${scriptSrc}"]`);
    const domLink = document.querySelector(`link[href="${linkHref}"]`);

    if (!domScript) {
      script = document.createElement("script");
      script.src = scriptSrc;
      document.querySelector("#wrapper").after(script);
    }

    if (linkHref !== "" && !domLink) {
      let style = document.createElement("link");
      style.href = linkHref;
      style.rel = "stylesheet";
      document.querySelector("link").before(style);
    }

    if (!domScript) {
      script.onload = callback;
    } else {
      domScript.onload = callback;
    }
  }
}

const msVideo = document.querySelector('#main-screen-video')
function updateVideoSrc() {
  let ornt = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'

  if (ornt === 'portrait') {
    msVideo.src = msVideo.dataset.mobile
  } else {
    msVideo.src = msVideo.dataset.desktop
  }
}
updateVideoSrc()

function animateScreenOne() {
  const logo = document.querySelector('.main-screen-logo')
  const title = document.querySelector('.main-screen-title')
  const txt = document.querySelector('.main-screen-txt')
  const td = document.querySelector('.main-screen-3d')

  msVideo.play()
  const tl = gsap.timeline()
  tl
    .fromTo(
      logo,
      {opacity: 0, y: -25},
      {opacity: 1, y: 0, duration: 0.65, delay: 1}
    )
    .fromTo(
      title,
      {opacity: 0, y: -25},
      {opacity: 1, y: 0, duration: 0.65, delay: -0.2}
    )
    .fromTo(
      txt,
      {opacity: 0, y: -25},
      {opacity: 1, y: 0, duration: 0.65, delay: -0.2}
    )
    .fromTo(
      td,
      {opacity: 0, x: 25, rotate: -180 },
      {opacity: 1, x: 0, rotate: 0, duration: 0.65, delay: -0.2, ease:Linear.easeNone}
    )
}



window.addEventListener('load', () => {
  setTimeout(()=> {
    document.documentElement.classList.add('is-loaded')
    // msVideo.play()
    animateScreenOne()
  },1)
})

