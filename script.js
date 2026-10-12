gsap.registerPlugin(ScrollTrigger);

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function buildHeadline() {
  const el = document.getElementById("headline");
  "WELCOME ITZFIZZ".split(" ").forEach((word) => {
    const w = document.createElement("span");
    w.className = "word";
    w.setAttribute("aria-hidden", "true");
    [...word].forEach((ch) => {
      const c = document.createElement("span");
      c.className = "char";
      c.textContent = ch;
      w.appendChild(c);
    });
    el.appendChild(w);
  });
}

function playIntro() {
  gsap.set(".char", { yPercent: 110, opacity: 0 });
  gsap.set(".stat", { y: 40, opacity: 0 });
  gsap.set("#hint", { opacity: 0 });

  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  tl.to(".char", {
    yPercent: 0,
    opacity: 1,
    duration: 1,
    stagger: 0.05,
  })
    .to(".stat", { y: 0, opacity: 1, duration: 0.9, stagger: 0.18 }, "-=0.4")
    .to("#hint", { opacity: 1, duration: 0.8 }, "-=0.4");

  document.querySelectorAll("[data-count]").forEach((span, i) => {
    const target = Number(span.dataset.count);
    const state = { v: 0 };
    tl.to(
      state,
      {
        v: target,
        duration: 1.2,
        ease: "power2.out",
        onUpdate: () => {
          span.textContent = Math.round(state.v);
        },
      },
      0.9 + i * 0.18
    );
  });

  return tl;
}

function initScroll() {
  const car = document.getElementById("car");
  const lanes = document.getElementById("lanes");

  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: "#hero",
      start: "top top",
      end: "+=250%",
      pin: true,
      scrub: 0.6,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });

  tl.to(
    car,
    {
      y: () => -(window.innerHeight + car.offsetHeight * 1.4),
      scale: 1.35,
      duration: 1,
    },
    0
  );

  tl.to(
    car,
    { x: () => window.innerWidth * 0.12, rotation: 6, duration: 0.25, ease: "sine.inOut" },
    0
  );
  tl.to(
    car,
    { x: () => -window.innerWidth * 0.12, rotation: -6, duration: 0.5, ease: "sine.inOut" },
    0.25
  );
  tl.to(car, { x: 0, rotation: 0, duration: 0.25, ease: "sine.inOut" }, 0.75);

  tl.to(lanes, { y: () => window.innerHeight * 1.2, duration: 1 }, 0);

  tl.to("#stats", { y: -30, opacity: 0.15, duration: 0.5 }, 0.45);
  tl.to("#headline", { y: -40, opacity: 0.2, duration: 0.5 }, 0.55);
  tl.to("#hintText", { opacity: 0, duration: 0.1 }, 0);
}

buildHeadline();

if (reduceMotion) {
  document.querySelectorAll("[data-count]").forEach((s) => {
    s.textContent = s.dataset.count;
  });
} else {
  playIntro();
  initScroll();
}