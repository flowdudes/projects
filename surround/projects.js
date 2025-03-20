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

window.addEventListener('beforeunload', function () {
  gsap.set('[preloader-hide]', { opacity: 0 })
  window.scrollTo(0, 0);
  window.lenis.scrollTo('top', {
    immediate: true,
    force: true
  });
});
window.addEventListener('pageshow', function (event) {
  // This runs when the page is shown, including from browser cache (back button)
  if (event.persisted) {
    gsap.set("[preloader-hide]", {
      opacity: 1
    });
  }
});

const preloaderTl = gsap.timeline()
preloaderTl
  .set("[preloader-hide]", { opacity: 1 })
  .set('.header_lines', { display: 'flex' })
  .from(".header_main-img-wrap", {
    clipPath: 'inset(0% 0% 100% 0%)',
    duration: 1.5,
    ease: 'power4.out'
  })
  .from('.header_main-img', {
    scale: 1.2,
    duration: 1.5,
    ease: 'power4.out'
  }, '<')
  .to('.header_line', {
    clipPath: 'inset(50% 0% 50% 0%)',
    duration: 1.5,
    stagger: 0.1,
    ease: 'power4.out'
  }, '<')
  .addLabel('linesEnd')
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
  .from(SplitType.create('.header_main-name', { types: 'words, chars' }).chars, {
    opacity: 0,
    duration: 1.5,
    stagger: {
      each: 0.05,
      repeat: 1,
      yoyo: true,
      repeatDelay: 0,
      ease: "power1.inOut"
    },
  }, 'linesEnd-=0.5')

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
      yPercent: 130,
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

gsap.to('.header_main-img', {
  yPercent: 20,
  ease: 'linear',
  scrollTrigger: {
    trigger: '.header_main-img',
    start: 'bottom bottom',
    end: 'bottom top',
    scrub: 1
  }
})

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
      start: 'top 110%',
      end: 'top center',
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
    // y: '3rem',
    // bottom: [60, 51, 38, 21, 0],
    clipPath: 'inset(100% 0% 0% 0%)',
    stagger: 0.02,
    ease: 'power2.inOut'
  });

gsap.timeline({
    scrollTrigger: {
      trigger: '.project-header_cta-wrap',
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
    trigger: '.project-header_cta-wrap',
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

new SplitType('.testimonials_name', { types: 'lines, words, chars' });
new SplitType(
  '.testimonials_designation', { types: 'lines, words' });
new SplitType(
  '.testimonials_text', { types: 'lines, words' });
gsap.timeline({
    scrollTrigger: {
      trigger: '.testimonial_content',
      start: 'top center'
    }
  })
  .fromTo(document.querySelector('.testimonial_slide').querySelectorAll(
    '.testimonials_name .char'), {
    opacity: 0
  }, {
    opacity: 1,
    duration: 1.5,
    stagger: 0.02,
    ease: 'power2.out'
  })
  .fromTo(document.querySelector('.testimonial_slide').querySelectorAll(
    '.testimonials_designation .word'), {
    yPercent: -100,
    opacity: 0
  }, {
    yPercent: 0,
    opacity: 1,
    duration: 0.7,
    stagger: 0.02,
    ease: 'back.out(1.2)'
  }, '<0.3')
  .fromTo(document.querySelector('.testimonial_slide').querySelectorAll(
    '.testimonials_text .word'), {
    y: '100%',
    opacity: 0
  }, {
    y: '0%',
    opacity: 1,
    duration: 1,
    stagger: 0.01,
    ease: 'power3.out'
  }, '<0.2')
  .fromTo(document.querySelector('.testimonial_slide').querySelector(
    '.testimonials_icon'), {
    clipPath: 'inset(0 100% 0 0)'
  }, {
    clipPath: 'inset(0 0% 0 0)',
    duration: 0.6,
    ease: 'power2.inOut'
  }, '<0.1')

gsap.timeline({
    scrollTrigger: {
      trigger: '.project-header_cta-wrap',
      start: 'top center',
      toggleActions: 'play none none reverse'
    }
  })
  .from('.project-header_cta-wrap', {
    backgroundColor: '#0c0c0c',
    duration: 2,
    ease: 'power4.inOut',
  })
  .from('.project-header_cta', {
    color: '#f9f9f9',
    duration: 2,
    ease: 'power4.inOut',
  }, 0)
  .from('.project-header_cta-line', {
    backgroundColor: '#f9f9f9',
    duration: 2,
    ease: 'power4.inOut',
  }, 0)

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

const projectCta = document.querySelector('.project-header_cta');
const projectTexts = projectCta.querySelectorAll('.project-header_cta-text');
const projectLine = projectCta.querySelector('.project-header_cta-line');

if (projectCta) {
  projectCta.addEventListener('click', () => {
    const currentHref = projectCta.getAttribute('href') || '';

    if (!currentHref.includes('#work')) {
      if (currentHref.includes('#')) {
        const basePart = currentHref.split('#')[0];
        projectCta.setAttribute('href', `${basePart}#work`);
      } else {
        projectCta.setAttribute('href', `${currentHref}#work`);
      }
    }
  });
}
projectCta.addEventListener('mouseenter', function () {
  gsap.to(projectTexts, { yPercent: -100, duration: 0.4, ease: "power2.out" });
  gsap.to(projectLine, {
    width: projectTexts[1].offsetWidth + "px",
    duration: 0.4,
    ease: "back.out(1.7)"
  });
});

projectCta.addEventListener('mouseleave', function () {
  gsap.to(projectTexts, { yPercent: 0, duration: 0.4, ease: "power2.out" });
  gsap.to(projectLine, { width: "100%", duration: 0.4, ease: "power4.out" });
});

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
  const startOpacity = text.hasAttribute('v2') ? 0.25 : 0;

  gsap.from(split.chars, {
    opacity: startOpacity,
    stagger: 0.015,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: text,
      start: 'top 80%',
      end: 'center center',
      scrub: 1
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
      toggleActions: 'play none none reverse'
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
      stagger: 0.02,
      duration: 0.8,
      ease: 'power3.out'
    });
});

const scaleElements = document.querySelectorAll('[fd-effect="scale"]');

scaleElements.forEach(element => {
  gsap.from(element, {
    scale: 1.3,
    transformOrigin: 'top center',
    ease: 'linear',
    scrollTrigger: {
      trigger: element,
      start: "top bottom",
      end: "bottom center",
      scrub: 1
    }
  });
});

const clipElements = document.querySelectorAll('[fd-effect="clip"]');

clipElements.forEach(element => {
  const images = element.querySelectorAll('img');
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: element,
      start: "top 70%",
      end: "bottom center",
      // scrub: 1
      // toggleActions: "play none none reverse"
    }
  });

  tl.from(element, {
      clipPath: "inset(0% 0% 100% 0%)",
      duration: 2,
      ease: "power3.out"
    })
    .from(images, {
      scale: 1.2,
      duration: 2,
      ease: "power3.out"
    }, 0);
});

const parallaxElements = document.querySelectorAll('[fd-effect="parallax"]');

parallaxElements.forEach(element => {
  gsap.set(element, {
    transformOrigin: "bottom center",
    scale: 1.2
  });

  gsap.to(element, {
    yPercent: 20,
    ease: "none",
    scrollTrigger: {
      trigger: element,
      start: "top bottom",
      end: "bottom top",
      scrub: 1
    }
  });
});
