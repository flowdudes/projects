const lenis = new Lenis({
  duration: 1,
  smoothTouch: false,
  touchMultiplier: 0,
  touchInertiaMultiplier: 0,
});
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

const isMobile = window.innerWidth < 768;

const approachItems = gsap.utils.toArray('.approach_item');
const approachTop = document.querySelector('.approach_item-top');
const incrementOffset = approachTop ? approachTop.offsetHeight : 80;
const baseOffset = 128;

approachItems.forEach((item, index) => {
  const offsetTop = baseOffset + (index * incrementOffset);
  const lastItem = approachItems.length - 1
  const lastOffset = baseOffset + (lastItem * incrementOffset)
  ScrollTrigger.create({
    trigger: item,
    start: `top top+=${offsetTop}px`,
    endTrigger: approachItems[lastItem],
    end: `top ${lastOffset}`,
    pin: true,
    pinSpacing: false
  });
});
// const firstGrid = document.querySelector('.background_grid');
// if (firstGrid) {
//   const backgroundLines = firstGrid.querySelectorAll('.background_line');

//   if (backgroundLines.length) {
//     const lastItemIndex = backgroundLines.length - 1;
//     const referenceItemIndex = lastItemIndex - (isMobile ? 8 : 3);

//     if (referenceItemIndex >= 0) {
//       const referenceLine = backgroundLines[referenceItemIndex];
//       const lastLine = backgroundLines[lastItemIndex];
//       const headerTextWrap = document.querySelector('.header_text-wrap');

//       if (referenceLine && lastLine && headerTextWrap) {
//         const referenceRect = referenceLine.getBoundingClientRect();
//         const lastRect = lastLine.getBoundingClientRect();
//         const height = headerTextWrap.offsetHeight
//         gsap.set('.header_text-grid', { height })
//         gsap.set(headerTextWrap, {
//           height,
//           left: referenceRect.right,
//           position: 'absolute'
//         });
//       }
//     }
//   }
// }

window.addEventListener('beforeunload', function () {
  gsap.set('[preloader-hide]', { opacity: 0 })
  window.scrollTo(0, 0);
  window.lenis.scrollTo('top', {
    immediate: true,
    force: true
  });
});
window.addEventListener('pageshow', function (event) {
  if (event.persisted) {
    gsap.set("[preloader-hide]", {
      opacity: 1
    });
  }
});

const preloaderTl = gsap.timeline({
  onComplete: () => {
    gsap.set('body', { cursor: 'auto' })
  }
})
const headerP = new SplitType(".header_text-wrap", { types: ['lines', 'words', 'chars'] });
preloaderTl
  .set('body', { cursor: 'wait' })
  .set("[preloader-hide]", { opacity: 1 })
  .set('.hero_bg', { opacity: 0 })
  .set('.preloader_line', (i, el) => {
    const topOffset = el.offsetTop;
    return {
      position: 'absolute',
      top: topOffset + 'px',
    };
  })
  .set('.preloader_line', { marginTop: 0 })
  .from('.preloader_line', {
    y: '100vh',
    opacity: 0,
    clipPath: 'inset(100% 0% 0% 0%)',
    duration: 2,
    stagger: 0.1,
    ease: 'power4.inOut'
  })
  .to('.preloader_line', {
    height: (i) => {
      const svhValues = [15, 25, 30, 35, 45];
      const viewportHeight = window.innerHeight;
      return `${(svhValues[i % svhValues.length] / 100) * viewportHeight}px`;
    },
    top: (i) => {
      const topValues = [0, 5, 20, 40, 65];
      const viewportHeight = window.innerHeight;
      return `${(topValues[i % topValues.length] / 100) * viewportHeight}px`;
    },
    duration: 1.5,
    stagger: 0.05,
    ease: 'power4.out',
    onComplete: () =>
      gsap.set('.hero_bg', { opacity: 1 })
  }, '<0.6')
  .addLabel('linesEnd')
  .from(".header_surround path", {
    yPercent: 110,
    duration: preloaderTl.duration(),
    stagger: {
      from: 'end',
      each: 0.03,
    },
    ease: 'power4.out'
  }, '<0.8')
  .fromTo(headerP.chars, { opacity: 0 }, {
    opacity: 0.2,
    duration: 1.5,
    stagger: 0.02,
    ease: 'power3.out'
  }, '<0.5')
  .to(headerP.chars, {
    opacity: 1,
    duration: 1.5,
    stagger: 0.02,
    ease: 'power3.out'
  }, '<0.2')
  .from(".nav_component", {
    yPercent: -100,
    opacity: 0,
    duration: 1,
    ease: 'back.out'
  }, 'linesEnd-=0.5')
  .from(".nav_menu_link > *", {
    yPercent: 120,
    duration: 1,
    ease: "power3.out"
  }, '<0.5')
  .from(".nav_menu-line1", {
    width: '0%',
    duration: 0.5,
    ease: 'power4.out'
  }, '<0.5')
  .from('.background_line', {
    clipPath: 'inset(0% 0% 100% 0%)',
    duration: 1.5,
    ease: 'power1.out',
    stagger: {
      grid: 'auto',
      from: 'center',
      each: 0.05
    }
  }, 'linesEnd')
  .from('.hero_lines', {
    opacity: 0,
    duration: 1,
    ease: 'power4.out'
  }, '<')

function initNavMenu() {
  const navButton = document.querySelector('.nav_button');
  const navMenu = document.querySelector('.nav_menu');
  const navMenuLinks = document.querySelectorAll('.nav_menu_link > *');
  const navLinkLine1 = document.querySelectorAll('.nav_link-line1');
  const navText = document.querySelectorAll('.nav_text');
  const navSocialLinks = document.querySelectorAll('.nav_social-link');
  const navSocialDividers = document.querySelectorAll('.nav_social-divider');

  let isOpen = false;
  let navTl = gsap.timeline({
    paused: true,
    onComplete: () => {
      navButton.style.pointerEvents = 'auto';
      navButton.classList.add('active');
      isOpen = true;
    },
    onReverseComplete: () => {
      navMenu.style.display = 'none';
      navButton.style.pointerEvents = 'auto';
      navButton.classList.remove('active');
      isOpen = false;
    }
  });

  navTl
    .set(navMenu, { display: 'block' })
    .fromTo(navMenu, { clipPath: 'inset(0 0 100% 0)' }, {
      clipPath: 'inset(0 0 0% 0)',
      duration: 1.5,
      ease: 'power3.out'
    })
    .fromTo(navLinkLine1, { width: '0%', opacity: 0 }, {
      width: '100%',
      opacity: 1,
      duration: 0.7,
      stagger: 0.05,
      ease: 'power1.out'
    }, '<0.5')
    .from(navText, {
      yPercent: 110,
      opacity: 0,
      duration: 1,
      stagger: 0.03,
      ease: 'power2.out'
    }, '<0.1')
    .from(navSocialLinks, {
      yPercent: 110,
      opacity: 0,
      duration: 1,
      stagger: 0.05,
      ease: 'power2.out'
    }, 0.7)
    .fromTo(navSocialDividers, { clipPath: 'inset(50% 0 50% 0)' }, {
        clipPath: 'inset(0% 0 0% 0)',
        duration: 0.5,
        stagger: 0.04,
        ease: 'power2.inOut'
      },
      '<0.2'
    )
    .to(navMenuLinks, {
      yPercent: 120,
      duration: 0.5,
      ease: 'power2.inOut'
    }, 0)

  navButton.addEventListener('click', () => {
    gsap.set(navLinkLine1, { left: '0%' })
    navButton.style.pointerEvents = 'none';
    gsap.to('.background_line', {
      clipPath: 'inset(50% 0% 50% 0%)',
      duration: 1,
      ease: 'power1.out',
      stagger: {
        grid: 'auto',
        from: 'center',
        each: 0.04,
        repeat: 1,
        yoyo: true
      },
    })
    if (isOpen) {
      navTl.reverse();
    } else {
      navMenu.style.display = 'block';
      navTl.play();
    }

    document.querySelectorAll('.nav_link').forEach(link => {
      link.addEventListener('click', e => {
        if (isOpen) {
          const href = link.getAttribute('href');

          if (href) {
            const hrefUrl = new URL(href, window.location.origin);
            const hrefPathname = hrefUrl.pathname;
            const currentPathname = window.location.pathname;

            if (hrefPathname === currentPathname && href.includes('#')) {
              e.preventDefault();
              const targetId = href.split('#')[1];
              const targetElement = document.getElementById(targetId);

              if (targetElement) {
                navButton.click()

                setTimeout(() => {
                  lenis.scrollTo(targetElement, {
                    offset: 0,
                    duration: 1.2,
                    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                  });
                }, navTl.duration() * 1000 * 0.75);
              }
            } else if (href.includes('#')) {
              e.preventDefault();
              const targetId = href.split('#')[1];
              const baseUrl = window.location.origin;
              const newUrl = `${baseUrl}/#${targetId}`;
              window.location.href = newUrl;
            }
          }
        }
      });
    });
  });

  // Initial setup
  gsap.set(navMenu, { display: 'none' });
  gsap.set(navLinkLine1, { width: 0 });
  gsap.set(navText, { yPercent: 110 });
  gsap.set(navSocialLinks, { yPercent: 110 });
  gsap.set(navSocialDividers, { clipPath: 'inset(50% 0 50% 0)' });
}

// Call this function on page load
initNavMenu();

const heroLinesTl = gsap.timeline({
  scrollTrigger: {
    trigger: '.hero_lines',
    start: 'top bottom',
    end: 'top top',
    scrub: 4
  }
});

heroLinesTl.from('.hero_lines1', {
    top: 0,
    clipPath: 'inset(0% 0% 100% 0%)',
    ease: 'power1'
  })
  .from('.hero_lines2', {
    top: 21,
    clipPath: 'inset(0% 0% 100% 0%)',
    ease: 'power1'
  }, '<0.02')
  .from('.hero_lines3', {
    top: 35,
    clipPath: 'inset(0% 0% 100% 0%)',
    ease: 'power1'
  }, '<0.02')
  .from('.hero_lines4', {
    top: 42,
    clipPath: 'inset(0% 0% 100% 0%)',
    ease: 'power1'
  }, '<0.02');

gsap.timeline({
    scrollTrigger: {
      trigger: '.approach_lines',
      start: 'top bottom',
      end: 'center center',
      scrub: 1
    }
  })
  .from('.approach_lines > *', {
    bottom: (i, el, arr) => {
      if (i === arr.length - 1) return 0;
      const nextEl = arr[i + 1];
      const currentBottom = parseInt(window.getComputedStyle(el).bottom) || 0;
      return -(currentBottom - nextEl.offsetHeight);
    },
    clipPath: 'inset(100% 0% 0% 0%)',
    stagger: 0.02,
    ease: 'power2.inOut'
  });

gsap.timeline({
    scrollTrigger: {
      trigger: '.section_hero',
      start: 'top top',
      end: '+=120%',
      scrub: 1
    }
  })
  .to('.header_text-wrap .line:nth-child(even)', {
    xPercent: 20,
    opacity: 0.25,
    ease: 'linear'
  })
  .to('.header_text-wrap .line:nth-child(odd)', {
    xPercent: -20,
    opacity: 0.25,
    ease: 'linear'
  }, '<')
  .to('.hero_wrapper', {
    yPercent: isMobile ? 0 : 20,
    ease: 'linear'
  }, 0)
  .to('.header_surround', {
    yPercent: isMobile ? 30 : 20,
    ease: 'linear'
  }, 0);

const coverText = new SplitType('.cover_h', { types: ['lines', 'words', 'chars'] });

gsap.from(coverText.chars, {
  opacity: 0.25,
  duration: 1,
  stagger: 0.1,
  ease: 'power2.out',
  scrollTrigger: {
    trigger: '.cover_h',
    start: 'top 80%',
    end: 'top 40%',
    scrub: 1
  }
});

function initWorkSwiper() {
  if (!isMobile) {
    const workSlider = document.querySelector('.work_slider');
    const workCursor = document.querySelector('.work_cursor');
    gsap.set(workCursor, { scale: 0 });
    const moveX = gsap.quickTo(workCursor, 'x', { duration: 0.5, ease: 'power3.out' });
    const moveY = gsap.quickTo(workCursor, 'y', { duration: 0.5, ease: 'power3.out' });
    workSlider.addEventListener('mousemove', (e) => {
      const rect = workSlider.getBoundingClientRect();
      const cursorRect = workCursor.getBoundingClientRect();
      const cursorWidth = cursorRect.width;
      const cursorHeight = cursorRect.height;
      const x = e.clientX - rect.left - (cursorWidth / 2);
      const y = e.clientY - rect.top - (cursorHeight / 2);
      moveX(x);
      moveY(y);
    });
  }
  if (!isMobile) {
    const workSwiper = new Swiper('.swiper.is-work', {
      slidesPerView: 'auto',
      loop: true,
      grabCursor: false,
      draggable: true,
      speed: 800,
      mousewheel: {
        forceToAxis: true
      },
      keyboard: {
        enabled: true,
        onlyInViewport: true
      }
    });
  }

  if (isMobile) {
    // Mobile version - individual triggers
    gsap.utils.toArray('.work_img-wrap').forEach(wrap => {
      gsap.from(wrap, {
        clipPath: 'inset(0% 0% 100% 0%)',
        ease: 'linear',
        scrollTrigger: {
          trigger: wrap,
          start: 'top 90%',
          end: 'top 20%',
          scrub: 1
        }
      });
    });
  } else {
    // Desktop version - group trigger with stagger
    gsap.from('.work_img-wrap', {
      yPercent: 50,
      clipPath: 'inset(100% 0% 0% 0%)',
      xPercent: 100,
      opacity: 0,
      duration: 2,
      stagger: 0.1,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: '.work_img-wrap',
        start: 'top 90%',
        end: 'center center'
      }
    });
  }
}

initWorkSwiper();

function initMarquee() {
  // Create the marquee animation
  const marqueeTween = gsap.to('.marquee_list', {
    xPercent: -100,
    duration: 20,
    ease: 'linear',
    repeat: -1,
    scrollTrigger: {
      trigger: '.section_marquee',
      start: 'top bottom'
    }
  });

  // Scroll animations
  gsap.timeline({
      scrollTrigger: {
        trigger: '.section_marquee',
        start: 'center bottom'
      }
    })
    .from('.marquee_divider', {
      clipPath: 'inset(50% 0% 50% 0%)',
      duration: 1,
      ease: 'power4.inOut',
      stagger: 0.1,
    })
    .from('.marquee_text', {
      yPercent: 110,
      duration: 1,
      stagger: 0.05,
      ease: 'power4.out'
    }, '<0.5');
}

// Initialize the marquee
initMarquee();

const testimonialsSwiper = new Swiper('.swiper.is-testimonials', {
  effect: 'fade',
  grabCursor: true,
  threshold: 10,
  touchRatio: 1.5,
  fadeEffect: {
    crossFade: true
  },
  slidesPerView: 1,
  speed: 800,
  loop: true,
  navigation: {
    nextEl: '.testimonials_next',
    prevEl: '.testimonials_prev'
  },
  on: {
    init: function () {
      const slides = this.slides;

      slides.forEach(slide => {
        const name = slide.querySelector('.testimonials_name');
        const designation = slide.querySelector('.testimonials_designation');
        const text = slide.querySelector('.testimonials_text');

        if (name) new SplitType(name, { types: 'lines, words, chars' });
        if (designation) new SplitType(designation, { types: 'lines, words' });
        if (text) new SplitType(text, { types: 'lines, words' });
      });
    },
    slideChangeTransitionStart: function () {
      const activeSlide = this.slides[this.activeIndex];
      const name = activeSlide.querySelector('.testimonials_name');
      const designation = activeSlide.querySelector('.testimonials_designation');
      const text = activeSlide.querySelector('.testimonials_text');
      const quote = document.querySelectorAll('.testimonials_icon')
      const lines = document.querySelectorAll('.background_line')

      if (name) {
        gsap.set(name.querySelectorAll('.char'), { opacity: 0 });
        gsap.to(name.querySelectorAll('.char'), {
          opacity: 1,
          duration: 1.5,
          stagger: 0.02,
          ease: 'power2.out'
        });
      }

      if (designation) {
        gsap.set(designation.querySelectorAll('.word'), { yPercent: -100, opacity: 0 });
        gsap.to(designation.querySelectorAll('.word'), {
          yPercent: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.02,
          ease: 'back.out(1.2)'
        });
      }

      if (text) {
        gsap.set(text.querySelectorAll('.word'), { y: '100%', opacity: 0 });
        gsap.to(text.querySelectorAll('.word'), {
          y: '0%',
          opacity: 1,
          duration: 1,
          stagger: 0.01,
          ease: 'power3.out',
        });
      }
      if (quote) {
        gsap.to(quote, {
          rotation: -5,
          duration: 0.3,
          ease: 'power1.inOut',
          repeat: 1,
          yoyo: true,
        })
      }
      if (lines) {
        gsap.to(lines, {
          clipPath: 'inset(50% 0% 50% 0%)',
          duration: 0.7,
          ease: 'power1.out',
          stagger: {
            grid: 'auto',
            from: 'center',
            each: 0.03,
            repeat: 1,
            yoyo: true
          },
        })
      }
    }
  }
});

gsap.timeline({
    scrollTrigger: {
      trigger: '.section_marquee',
      start: 'bottom 70%',
      toggleActions: 'play none none reverse'
    }
  })
  .from('.footer_text', {
    yPercent: -100,
    opacity: 0,
    rotation: -10,
    transformOrigin: 'left center',
    stagger: 0.5,
    duration: 1,
    ease: 'power4.out'
  })
  .from('.footer_line1', {
    width: '0%',
    left: '0%',
    duration: 1,
    ease: 'power4.out'
  }, '-=0.5')

gsap.from('.footer_content', {
  yPercent: -40,
  opacity: 0.5,
  ease: 'linear',
  scrollTrigger: {
    trigger: '.section_marquee',
    start: 'bottom bottom',
    end: 'top top',
    scrub: 1,
  }
})
gsap.from(".footer_logo path", {
  yPercent: -160,
  stagger: {
    from: 'end',
    each: 0.03,
  },
  duration: 1.5,
  ease: 'power4.out',
  scrollTrigger: {
    trigger: '.footer_logo',
    start: 'bottom bottom',
    end: '+=50%',
    toggleActions: 'play none none reverse'
  }
})

gsap.from('.section_work', {
  color: '#0c0c0c',
  backgroundColor: '#f9f9f9',
  duration: 2,
  ease: 'power4.inOut',
  scrollTrigger: {
    trigger: '.section_work',
    start: 'top 80%',
    toggleActions: 'play none none reverse'
  }
})

gsap.utils.toArray('.approach_divider2').forEach(divider => {
  gsap.from(divider, {
    width: '0%',
    duration: 1.5,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: divider,
      start: 'top 90%',
      toggleActions: 'play none none reverse'
    }
  });
});

const testimonialActiveSlide = document.querySelector('.swiper-slide.is-testimonials');
const testimonialNameChars = testimonialActiveSlide.querySelectorAll('.testimonials_name .char');
const testimonialDesignationWords = testimonialActiveSlide.querySelectorAll(
  '.testimonials_designation .word');
const testimonialTextWords = testimonialActiveSlide.querySelectorAll('.testimonials_text .word');
const testimonialIconEl = testimonialActiveSlide.querySelector('.testimonials_icon');
const testimonialNavBtns = ['.testimonials_prev', '.testimonials_next'];

const testimonialNamePos = isMobile ? '>-0.5' : '0';
const testimonialDesignationPos = isMobile ? '<0.1' : '<0.3';
const testimonialIconPos = isMobile ? 0.5 : '<0.1'

gsap.timeline({
    scrollTrigger: {
      trigger: '.testimonials_content',
      start: 'top center'
    }
  })
  .fromTo(testimonialTextWords, {
    y: '100%',
    opacity: 0
  }, {
    y: '0%',
    opacity: 1,
    duration: 1,
    stagger: 0.01,
    ease: 'power3.out'
  }, isMobile ? 0 : '0.5')
  .fromTo(testimonialNameChars, {
    opacity: 0
  }, {
    opacity: 1,
    duration: 1.5,
    stagger: 0.02,
    ease: 'power2.out'
  }, testimonialNamePos)
  .fromTo(testimonialDesignationWords, {
    yPercent: -100,
    opacity: 0
  }, {
    yPercent: 0,
    opacity: 1,
    duration: 0.7,
    stagger: 0.02,
    ease: 'back.out(1.2)'
  }, testimonialDesignationPos)
  .fromTo(testimonialIconEl, {
    clipPath: 'inset(0 100% 0 0)'
  }, {
    clipPath: 'inset(0 0% 0 0)',
    duration: 0.6,
    ease: 'power2.inOut'
  }, testimonialIconPos)
  .from(testimonialNavBtns, {
    opacity: 0,
    scale: 0,
    duration: 0.7,
    stagger: 0.05,
    ease: 'power2.out'
  }, '<0.5');

// HOVER EFFECTS

const ctaElements = document.querySelectorAll('[fd-effect=cta]');

ctaElements.forEach(cta => {
  const line1 = cta.querySelector('[class*="line1"]');
  const line2 = cta.querySelector('[class*="line2"]');

  cta.addEventListener('mouseenter', () => {

    const tl = gsap.timeline();
    gsap.set(line1, { left: 'auto' })
    tl.fromTo(line1, { width: '100%' }, {
        width: '0%',
        duration: 0.4,
        ease: 'power2.inOut',
      })
      .fromTo(line2, { width: '0%' }, {
          width: '100%',
          duration: 0.4,
          ease: 'power2.inOut'
        },
        '<0.1'
      );
  });

  cta.addEventListener('mouseleave', () => {

    const tl = gsap.timeline();

    tl
      .fromTo(line2, { width: '100%' }, {
        width: '0%',
        duration: 0.4,
        ease: 'power2.inOut'
      })
      .fromTo(line1, { width: '0%' }, {
        width: '100%',
        duration: 0.4,
        ease: 'power2.inOut'
      }, '<0.1')
  });
});
const trailElements = document.querySelectorAll('[fd-text=trail]');

trailElements.forEach(el => {
  const textBlock = el.querySelector('div');
  let height = el.offsetHeight;

  if (height === 0) {
    const computedStyle = window.getComputedStyle(textBlock);
    const fontSize = parseFloat(computedStyle.fontSize);
    const lineHeight = parseFloat(computedStyle.lineHeight) / fontSize || 1.2;
    height = fontSize * lineHeight;
  }

  el.style.height = `${height}px`;
  el.style.overflow = 'hidden';
  el.style.display = 'flex';
  el.style.flexDirection = 'column';

  const splitText = new SplitType(textBlock, { types: 'chars' });
  const clonedText = textBlock.cloneNode(true);
  el.appendChild(clonedText);
  const splitClone = new SplitType(clonedText, { types: 'chars' });

  const tl = gsap.timeline({ paused: true })
    .to(splitText.chars, {
      yPercent: -110,
      duration: 0.6,
      ease: 'power2.inOut',
      stagger: 0.02
    })
    .to(splitClone.chars, {
      yPercent: -110,
      duration: 0.6,
      ease: 'power2.inOut',
      stagger: 0.02
    }, '<');

  el.addEventListener('mouseenter', () => tl.play());
  el.addEventListener('mouseleave', () => tl.reverse());
});

const navLinks = document.querySelectorAll('.nav_link');

navLinks.forEach(link => {
  link.addEventListener('mouseenter', () => {
    navLinks.forEach(otherLink => {
      if (otherLink !== link) {
        gsap.to(otherLink, {
          opacity: 0.5,
          duration: 0.3
        });
      }
    });
  });

  link.addEventListener('mouseleave', () => {
    navLinks.forEach(otherLink => {
      if (otherLink !== link) {
        gsap.to(otherLink, {
          opacity: 1,
          duration: 0.3
        });
      }
    });
  });
});

const workItems = document.querySelectorAll('.work_item');
const workCursor = document.querySelector('.work_cursor');
const workCursorIcon = document.querySelector('.work_cursor-icon');
const workSlider = document.querySelector('.work_slider');

workItems.forEach(item => {
  if (isMobile) return
  const workItemHover = item.querySelector('.work_item-hover');
  const workLines = item.querySelectorAll('.work_lines > *');

  gsap.set(workLines, {
    clipPath: 'inset(100% 0% 0% 0%)',
  });

  item.addEventListener('mouseenter', () => {
    gsap.to(workLines, {
      clipPath: 'inset(0% 0% 0% 0%)',
      duration: 0.6,
      stagger: 0.02,
      ease: 'power3.out'
    });
  });

  item.addEventListener('mouseleave', () => {
    gsap.to(workLines, {
      clipPath: 'inset(100% 0% 0% 0%)',
      duration: 0.6,
      stagger: 0.02,
      ease: 'power4.out'
    });
  });

  workItemHover.addEventListener('mouseenter', () => {
    gsap.to(workCursor, {
      scale: 0.7,
      duration: 0.4,
      ease: 'power2.out'
    });
    gsap.to(workCursorIcon, {
      clipPath: 'inset(0% 0% 0% 50%)',
      xPercent: -30,
      duration: 0.4,
      ease: 'power2.out'
    });
  });

  workItemHover.addEventListener('mouseleave', () => {
    gsap.to(workCursor, {
      scale: 1,
      duration: 0.4,
      ease: 'power2.out'
    });
    gsap.to(workCursorIcon, {
      clipPath: 'inset(0% 0% 0% 0%)',
      xPercent: 0,
      duration: 0.4,
      ease: 'power2.out'
    });
  });
});
if (!isMobile) {
  workSlider.addEventListener('mouseenter', () => {
    gsap.to(workCursor, {
      scale: 1,
      duration: 0.3,
      ease: 'power2.out'
    });
  });

  workSlider.addEventListener('mouseleave', () => {
    gsap.to(workCursor, {
      scale: 0,
      duration: 0.3,
      ease: 'power2.out'
    });
  });
}
// TEXT EFFECTS

const paragraphs = document.querySelectorAll('[fd-text=paragraph]');

paragraphs.forEach(paragraph => {
  const split = new SplitType(paragraph, { types: 'lines, words' });

  gsap.from(split.words, {
    yPercent: 100,
    opacity: 0,
    stagger: 0.01,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: paragraph,
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    }
  });
});

const wipeTexts = document.querySelectorAll('[fd-text=wipe]');

wipeTexts.forEach(text => {
  const split = new SplitType(text, { types: 'words, chars' });

  gsap.from(split.chars, {
    opacity: 0,
    stagger: 0.015,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: text,
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    }
  });
});

const h2Texts = document.querySelectorAll('[fd-text=h2]');

h2Texts.forEach(text => {
  const split = new SplitType(text, { types: 'lines' });

  split.lines.forEach(line => {
    const wrapper = document.createElement('div');
    wrapper.className = 'overflow-hidden';
    line.parentNode.insertBefore(wrapper, line);
    wrapper.appendChild(line);
  });

  gsap.from(split.lines, {
    yPercent: 100,
    rotation: 15,
    transformOrigin: 'left center',
    duration: 1,
    ease: 'power3.out',
    stagger: 0.1,
    scrollTrigger: {
      trigger: text,
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    }
  });
});

const slideTopTexts = document.querySelectorAll('[fd-text=slidetop]');

slideTopTexts.forEach(text => {
  const split = new SplitType(text, { types: 'words, chars' });

  gsap.timeline({
      scrollTrigger: {
        trigger: text,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse'
      }
    })
    .from(split.chars, {
      yPercent: -100,
      opacity: 0,
      stagger: 0.01,
      duration: 0.8,
      ease: 'power3.out'
    });
});

// CLICK EFFECTS
const navButtons = [
  { el: document.querySelector('.testimonials_prev'), moveX: -5 },
  { el: document.querySelector('.testimonials_next'), moveX: 5 }
];

navButtons.forEach(button => {
  button.el.addEventListener('click', () => {
    const path = button.el.querySelector('path');
    gsap.killTweensOf(path);
    gsap.to(path, {
      x: button.moveX,
      repeat: 1,
      yoyo: true,
      duration: 0.3,
      ease: 'power2.inOut'
    });
  });
});
