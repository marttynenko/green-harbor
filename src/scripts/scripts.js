gsap.registerPlugin(ScrollTrigger);

jQuery.validator.setDefaults({
  errorClass: 'invalid',
	successClass: 'valid',
	focusInvalid: false,
	errorElement: 'span',
	errorPlacement: function (error, element) {
    if ( element.parent().hasClass('ui-checkbox')) {
      element.closest('.ui-checkbox').after(error);
    } else {
      error.insertAfter(element);
    }
  },
  highlight: function(element, errorClass, validClass) {
    if ( $(element).parent().hasClass('ui-checkbox')) {
    	$(element).parent().addClass(errorClass).removeClass(validClass);
    } else {
    	$(element).addClass(errorClass).removeClass(validClass);
    }
  },
  unhighlight: function(element, errorClass, validClass) {
  	if ($(element).parent().hasClass('ui-checkbox')) {
    	$(element).parent().removeClass(errorClass).addClass(validClass);
    } else {
    	$(element).removeClass(errorClass).addClass(validClass);
    }
  }
});
//дефолтные сообщения, предупреждения
jQuery.extend(jQuery.validator.messages, {
  required: "Обязательное поле",
  email: "Некорректный email адрес",
  url: "Некорректный URL",
  number: "Некорректный номер",
  digits: "Это поле поддерживает только числа",
  equalTo: "Поля не совпадают",
  maxlength: jQuery.validator.format('Максимальная длина поля {0} символа(ов)'),
  minlength: jQuery.validator.format('Минимальная длина поля {0} символа(ов)'),
  require_from_group: jQuery.validator.format('Отметьте миниммум {0} из этих полей')
});
//кастомные методы валидатора
jQuery.validator.addMethod("lettersonly", function(value, element) {
  return this.optional(element) || /^[a-zA-ZА-Яа-я\s]+$/i.test(value);
}, "Только буквы");

jQuery.validator.addMethod("telephone", function(value, element) {
  return this.optional(element) || /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){11,14}(\s*)?$/i.test(value);
}, "Некорректный формат телефона");

const FARBA = {
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


const playVideo = () => {
  let video
  if (window.innerWidth >= 1025) {
    video = document.querySelector('#main-video-desktop')
  } else {
    video = document.querySelector('#main-video-mobile')
  }
  video.play()
}

function animateScreenOne() {
  const logo = document.querySelector('.main-screen-logo')
  const title = document.querySelector('.main-screen-title')
  const txt = document.querySelector('.main-screen-txt')
  const td = document.querySelector('.main-screen-mute')

  playVideo()
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
      {opacity: 0, x: 25 },
      {opacity: 1, x: 0, duration: 0.65, delay: -0.2}
    )
}

function animateScreenParallax(screen) {
  const logo = screen.querySelector('.screen-parallax-logo')
  const title = screen.querySelector('.screen-parallax-title')
  const mute = screen.querySelector('.screen-parallax-mute')
  const content = screen.querySelector('.screen-parallax-content')

  const tl = gsap.timeline()
  tl
    .fromTo(
      logo,
      {opacity: 0, y: -25},
      {opacity: 1, y: 0, duration: 0.65, delay: 0.8}
    )
    .fromTo(
      title,
      {opacity: 0, y: -25},
      {opacity: 1, y: 0, duration: 0.65, delay: -0.2}
    )
    .fromTo(
      mute,
      {opacity: 0, x: 25 },
      {opacity: 1, x: 0, duration: 0.65, delay: -0.2, ease:Linear.easeNone}
    )
}


window.addEventListener('load', () => {
  setTimeout(()=> {
    document.documentElement.classList.add('is-loaded')
    animateScreenOne()
  },1)
})



document.addEventListener('mousemove',(e) => {
  if (window.innerWidth < 1024) return
  Object.assign(document.documentElement, {
    style: `
      --move-x: ${(e.clientX - window.innerWidth / 2) * -0.005 }deg;
      --move-y: ${(e.clientY - window.innerHeight / 2) * 0.01 }deg;
      --ratio-x: ${e.clientX / window.innerWidth};
      --ratio-y: ${e.clientY / window.innerHeight};
    `
  })
})


document.querySelectorAll('.screen-parallax-mute, .main-screen-mute').forEach(el => {
  el.addEventListener('click', (e) => {
    e = e || window.event
    e.preventDefault()
    const screen = e.target.closest('.screen-parallax') || e.target.closest('.screen')
    const audio = screen.querySelector('audio')
    const otherAudios = document.querySelectorAll('audio')

    if (!audio) return

    otherAudios.forEach(item => {
      if (item !== audio) {
        item.pause()
        const mute = item.previousElementSibling
        if (mute) mute.classList.remove('playing')
      }
    })
    
    if (audio.paused) {
      audio.play()
      el.classList.add('playing')
    } else {
      audio.pause()
      el.classList.remove('playing')
    }
  })
})


//снимаем активность всех иконок аудио по завершению
document.querySelectorAll('audio').forEach(el => {
  el.addEventListener('ended',(e) => {
    const mute = e.target.previousElementSibling
    if (mute && mute.classList.contains('volume-control')) {
      mute.classList.remove('playing')
    }

    // document.querySelectorAll('.volume-control').forEach(item => {
    //   item.classList.remove('playing')
    // })
    document.querySelector('.screen-slider-volume').classList.remove('playing')
  })
})


const screens = document.querySelector('.screens')
screens.addEventListener('scroll', () => {
  
  document.querySelectorAll('.screen').forEach(el => {
    el.classList.remove('active')
    if (el.getBoundingClientRect().top === 0) {
      el.classList.add('active')

      if (el.classList.contains('main-screen')) return animateScreenOne()
      animateScreenParallax(el)
    }
  })

  //ставим аудио на паузу
  screens.querySelectorAll('audio').forEach(el => {
    el.pause()
    el.currentTime = 0
  })

  document.querySelectorAll('.volume-control').forEach(item => {
    item.classList.remove('playing')
  })
})


//скрываем подсказку для свайпа
let screenTimer, screenMove
document.querySelectorAll('.screen').forEach(el => {
  el.addEventListener('mouseenter',(e) => {
    screenMove = e.clientX
    // setTimeout(()=>{
    //   el.classList.remove('mouseleave')
    // },1100)
  })

  // el.addEventListener('mouseleave',(e) => {
  //   el.classList.add('mouseleave')
  // })

  el.addEventListener('mousemove', (e) => {
    const currentMove = e.clientX
    if (Math.abs(screenMove - currentMove) > 30) {
      el.classList.add('is-moving')
      const hint = el.querySelector('.screen-parallax-hint')
      if (hint) {
        setTimeout(()=>{
          hint.remove()
        },2000)
      }
      // el.classList.add('is-moving')
      // setTimeout(() => {
      //   el.classList.remove('is-moving')
      // }, 45000)
    }
    
  })
})


document.querySelectorAll('.screen-parallax').forEach((el,index) => {
  ScrollTrigger.create({
    trigger: el,
    start: "top bottom",
    // end: "bottom 15%",
    onUpdate: self => {
      if (self.isActive) {
        el.classList.add('m-active')
      } else {
        el.classList.remove('m-active')
      }
      const progress = self.progress
      document.documentElement.style.setProperty(`--screen-${index}-progress`, `${progress}`);
    }
  })
})


document.querySelectorAll('.screen-btn-down').forEach(el => {
  el.addEventListener('click', (e) => {
    e.preventDefault()
    const parent = el.closest('.screen')
    const next = parent.nextElementSibling
    if (next && next.classList.contains('screen')) {
      next.scrollIntoView({behavior: 'smooth'})
      // const audio = next.querySelector('audio')
      // if (audio) audio.play()
    }
  })
})

document.querySelectorAll('.screen-btn-up').forEach(el => {
  el.addEventListener('click', (e) => {
    e.preventDefault()
    const parent = el.closest('.screen')
    const prev = parent.previousElementSibling
    if (prev && prev.classList.contains('screen')) {
      prev.scrollIntoView({behavior: 'smooth'})
      // const audio = prev.querySelector('audio')
      // if (audio) audio.play()
    }
  })
})


function initSlider () {
  if (!document.querySelector('.cf-swiper')) return null

  var swiper = new Swiper(".cf-swiper", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 'auto',
    speed: 1200,
    loop: true,
    coverflowEffect: {
      rotate: 0,
      stretch: 0,
      depth: 120,
      modifier: 3,
      slideShadows: false,
    },
    navigation: {
      nextEl: ".cf-swiper-next",
      prevEl: ".cf-swiper-prev",
    },
    breakpoints: {
      1024: {
        slidesPerView: 3,
      }
    }
  });

  return swiper
}
const slider = initSlider()


//воспроизводим аудио в карусели
function initCarouselAudio () {
  const audio = document.querySelector('.screen-slider-audio')
  const btn = document.querySelector('.screen-slider-volume')

  if (!btn || !audio) return

  btn.addEventListener('click', (e) => {
    e.preventDefault()

    if (audio.paused) {
      audio.play()
      btn.classList.add('playing')
    } else {
      audio.pause()
      btn.classList.remove('playing')
    }
  })
}
initCarouselAudio();


function initMask() {
  const inputs = document.querySelectorAll('.phone-input')
  if (!inputs.length) return

  inputs.forEach(el => {
    IMask(el, {
      mask: [
        {
          mask: '+0 (000) 000-00-00',
          startsWith: '7',
          lazy: false,
          country: 'Russia'
        },
        {
          mask: '+000 (00) 000-00-00',
          startsWith: '375',
          lazy: false,
          country: 'Belarus'
        },
        {
          mask: '0000000000000',
          startsWith: '',
          country: 'unknown'
        }
      ],
      dispatch: (appended, dynamicMasked) => {
        const number = (dynamicMasked.value + appended).replace(/\D/g,'');
    
        return dynamicMasked.compiledMasks.find(m => number.indexOf(m.startsWith) === 0);
      }
    })
  })
  
}
initMask()


(function(){
  if (!document.querySelector('.header-phone-txt') || !document.querySelector('.screen-bottom')) return
  const trg = document.querySelector('.header-phone-txt')
  trg.addEventListener('click', (e) => {
    e.preventDefault()
    document.querySelector('.screen-bottom').scrollIntoView({behavior: 'smooth'})
  })
}())