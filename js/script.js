// Kinson Busis portfolio interactions (vanilla JavaScript)
// If this file runs, enable scroll-reveal styling. Without JavaScript, content stays visible.
document.documentElement.classList.add("js-ready");
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const navItems = [...document.querySelectorAll(".nav-link")];
  const sections = [...document.querySelectorAll("main section[id]")];
  const toast = document.getElementById("toast");

  // Mobile navigation: open, close, and close after choosing a section.
  function closeMenu() {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
    navLinks.classList.toggle("open", !isOpen);
  });

  navItems.forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
  document.addEventListener("click", (event) => {
    if (!navLinks.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
  });

  // Mark the navigation item that matches the section currently on screen.
  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navItems.forEach((link) => {
          const active = link.getAttribute("href") === `#${entry.target.id}`;
          link.classList.toggle("active", active);
        });
      });
    }, { rootMargin: "-35% 0px -55% 0px", threshold: 0 });
    sections.forEach((section) => sectionObserver.observe(section));

    // Reveal content as it enters the viewport.
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));
  } else {
    document.querySelectorAll(".reveal").forEach((item) => item.classList.add("is-visible"));
  }

  // Keep the footer year current.
  const yearElement = document.getElementById("current-year");
  if (yearElement) yearElement.textContent = new Date().getFullYear();

  // Desktop-only custom cursor and gold spotlight. Touch devices keep native input behavior.
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (finePointer.matches && !reducedMotion.matches) {
    const spotlight = document.createElement("div");
    spotlight.className = "mouse-spotlight";
    spotlight.setAttribute("aria-hidden", "true");
    const cursorDot = document.createElement("div");
    cursorDot.className = "mouse-cursor-dot";
    cursorDot.setAttribute("aria-hidden", "true");
    const cursorRing = document.createElement("div");
    cursorRing.className = "mouse-cursor-ring";
    cursorRing.setAttribute("aria-hidden", "true");

    // Lightweight electric-arc cursor inspired by crackling gold energy.
    // Canvas is decorative and pointer-transparent; it never intercepts clicks.
    const arcCanvas = document.createElement("canvas");
    arcCanvas.className = "arc-cursor-canvas";
    arcCanvas.setAttribute("aria-hidden", "true");
    const arcContext = arcCanvas.getContext("2d", { alpha: true });
    document.body.append(spotlight, arcCanvas, cursorDot, cursorRing);

    let canvasWidth = window.innerWidth;
    let canvasHeight = window.innerHeight;
    let pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    const arcBursts = [];
    let arcFrame = 0;
    let lastArcPoint = null;

    function resizeArcCanvas() {
      canvasWidth = window.innerWidth;
      canvasHeight = window.innerHeight;
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      arcCanvas.width = Math.round(canvasWidth * pixelRatio);
      arcCanvas.height = Math.round(canvasHeight * pixelRatio);
      arcCanvas.style.width = `${canvasWidth}px`;
      arcCanvas.style.height = `${canvasHeight}px`;
      if (arcContext) arcContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    }

    function makeArc(x1, y1, x2, y2, life = 1, width = 1.25) {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const distance = Math.hypot(dx, dy);
      if (distance < 3) return;
      const segments = Math.max(3, Math.min(10, Math.round(distance / 9)));
      const normalX = -dy / distance;
      const normalY = dx / distance;
      const points = [{ x: x1, y: y1 }];
      for (let i = 1; i < segments; i += 1) {
        const t = i / segments;
        const jitter = (Math.random() - 0.5) * Math.min(17, distance * 0.28);
        points.push({ x: x1 + dx * t + normalX * jitter, y: y1 + dy * t + normalY * jitter });
      }
      points.push({ x: x2, y: y2 });
      arcBursts.push({ points, life, width, born: performance.now() });

      // A short fork gives the arc a natural, irregular electrical silhouette.
      if (distance > 15 && Math.random() > 0.42) {
        const forkIndex = Math.max(1, Math.floor(points.length * (0.35 + Math.random() * 0.35)));
        const fork = points[forkIndex];
        const forkLength = 5 + Math.random() * 13;
        const angle = Math.atan2(dy, dx) + (Math.random() > 0.5 ? 1 : -1) * (0.45 + Math.random() * 0.8);
        const end = { x: fork.x + Math.cos(angle) * forkLength, y: fork.y + Math.sin(angle) * forkLength };
        arcBursts.push({ points: [fork, { x: fork.x + (end.x - fork.x) * 0.55 + (Math.random() - 0.5) * 5, y: fork.y + (end.y - fork.y) * 0.55 + (Math.random() - 0.5) * 5 }, end], life: life * 0.8, width: width * 0.65, born: performance.now() });
      }
    }

    function drawArcs(now) {
      arcFrame = 0;
      if (!arcContext) return;
      arcContext.clearRect(0, 0, canvasWidth, canvasHeight);
      for (let i = arcBursts.length - 1; i >= 0; i -= 1) {
        const arc = arcBursts[i];
        const age = (now - arc.born) / 190;
        const alpha = Math.max(0, 1 - age) * arc.life;
        if (alpha <= 0) {
          arcBursts.splice(i, 1);
          continue;
        }
        const points = arc.points;
        arcContext.save();
        arcContext.globalAlpha = alpha;
        arcContext.lineJoin = "round";
        arcContext.lineCap = "round";
        arcContext.beginPath();
        arcContext.moveTo(points[0].x, points[0].y);
        for (let j = 1; j < points.length; j += 1) arcContext.lineTo(points[j].x, points[j].y);
        arcContext.strokeStyle = "rgba(212,175,55,0.95)";
        arcContext.lineWidth = arc.width * 2.5;
        arcContext.shadowColor = "rgba(245,215,110,0.9)";
        arcContext.shadowBlur = 8;
        arcContext.stroke();
        arcContext.shadowBlur = 0;
        arcContext.strokeStyle = "rgba(255,247,210,0.98)";
        arcContext.lineWidth = Math.max(0.45, arc.width * 0.55);
        arcContext.stroke();
        arcContext.restore();
      }
      if (arcBursts.length) arcFrame = requestAnimationFrame(drawArcs);
    }

    function addArcTrail(x, y) {
      if (lastArcPoint) {
        const distance = Math.hypot(x - lastArcPoint.x, y - lastArcPoint.y);
        if (distance > 4) {
          makeArc(lastArcPoint.x, lastArcPoint.y, x, y, 0.9, 1.05);
          if (Math.random() > 0.7) makeArc(x, y, x + (Math.random() - 0.5) * 12, y + (Math.random() - 0.5) * 12, 0.75, 0.75);
          if (!arcFrame) arcFrame = requestAnimationFrame(drawArcs);
        }
      }
      lastArcPoint = { x, y };
    }

    // Shared with Yami: draws the same crackling arcs between two points.
    window.yamiArc = (x1, y1, x2, y2) => {
      makeArc(x1, y1, x2, y2, 0.9, 1.05);
      if (Math.random() > 0.7) makeArc(x2, y2, x2 + (Math.random() - 0.5) * 12, y2 + (Math.random() - 0.5) * 12, 0.75, 0.75);
      if (!arcFrame) arcFrame = requestAnimationFrame(drawArcs);
    };

    resizeArcCanvas();
    window.addEventListener("resize", resizeArcCanvas, { passive: true });

    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;
    let ringX = pointerX;
    let ringY = pointerY;
    let frameRequested = false;

    const renderPointer = () => {
      frameRequested = false;
      document.documentElement.style.setProperty("--pointer-x", `${pointerX}px`);
      document.documentElement.style.setProperty("--pointer-y", `${pointerY}px`);
      cursorDot.style.transform = `translate3d(${pointerX - 2.5}px, ${pointerY - 2.5}px, 0)`;
      ringX += (pointerX - ringX) * 0.19;
      ringY += (pointerY - ringY) * 0.19;
      cursorRing.style.transform = `translate3d(${ringX - 15}px, ${ringY - 15}px, 0)`;
      if (Math.abs(pointerX - ringX) > 0.2 || Math.abs(pointerY - ringY) > 0.2) {
        frameRequested = true;
        requestAnimationFrame(renderPointer);
      }
    };
    const onPointerMove = (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      addArcTrail(pointerX, pointerY);
      document.body.classList.add("cursor-active", "has-mouse-spotlight");
      if (!frameRequested) {
        frameRequested = true;
        requestAnimationFrame(renderPointer);
      }
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerleave", () => {
      document.body.classList.remove("cursor-active", "has-mouse-spotlight");
      lastArcPoint = null;
    });
    document.addEventListener("pointerenter", () => document.body.classList.add("cursor-active", "has-mouse-spotlight"));

    const hoverTargets = "a, button, .project-card, .skill-card, input, textarea, select, label";
    document.addEventListener("pointerover", (event) => {
      if (event.target instanceof Element && event.target.closest(hoverTargets)) document.body.classList.add("cursor-hover");
    }, { passive: true });
    document.addEventListener("pointerout", (event) => {
      if (event.target instanceof Element && event.target.closest(hoverTargets) &&
          (!(event.relatedTarget instanceof Element) || !event.relatedTarget.closest(hoverTargets))) {
        document.body.classList.remove("cursor-hover");
      }
    }, { passive: true });

    // Restrained parallax on the existing profile frame; never changes its dimensions or crop.
    const profileArt = document.querySelector(".profile-art");
    const profileFrame = document.querySelector(".profile-frame");
    if (profileArt && profileFrame) {
      profileArt.addEventListener("pointermove", (event) => {
        const rect = profileArt.getBoundingClientRect();
        const nx = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
        const ny = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
        const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
        const x = clamp(nx * 8, -8, 8);
        const y = clamp(ny * 8, -8, 8);
        const rotateY = clamp(nx * 2.4, -2.4, 2.4);
        const rotateX = clamp(-ny * 2.4, -2.4, 2.4);
        profileFrame.style.setProperty("--photo-x", `${x}px`);
        profileFrame.style.setProperty("--photo-y", `${y}px`);
        profileFrame.style.setProperty("--photo-tilt-x", `${rotateX}deg`);
        profileFrame.style.setProperty("--photo-tilt-y", `${rotateY}deg`);
        profileFrame.classList.add("is-parallaxing");
      }, { passive: true });
      profileArt.addEventListener("pointerleave", () => {
        profileFrame.classList.remove("is-parallaxing");
        profileFrame.style.setProperty("--photo-x", "0px");
        profileFrame.style.setProperty("--photo-y", "0px");
        profileFrame.style.setProperty("--photo-tilt-x", "0deg");
        profileFrame.style.setProperty("--photo-tilt-y", "0deg");
      }, { passive: true });
    }

    // Tiny pointer spotlight inside project cards without layout reads on every frame.
    document.querySelectorAll(".project-card").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--card-x", `${event.clientX - rect.left}px`);
        card.style.setProperty("--card-y", `${event.clientY - rect.top}px`);
      }, { passive: true });
    });
  }

  // Text Scatter: premium gold letter burst on hover, then return to its original position.
  // This is a lightweight vanilla-JS adaptation for this HTML/CSS portfolio; no React required.
  const scatterMotionAllowed = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const scatterTargets = document.querySelectorAll(".hero-copy h1, main section h2, .project-info h3, .timeline-item h3, .skill-card h3, .contact-cta h2");
  if (scatterMotionAllowed && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    scatterTargets.forEach((target) => {
      if (target.dataset.scatterReady === "true") return;
      target.dataset.scatterReady = "true";

      const walker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          return node.nodeValue && node.nodeValue.trim()
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_REJECT;
        }
      });
      const textNodes = [];
      while (walker.nextNode()) textNodes.push(walker.currentNode);

      textNodes.forEach((node) => {
        const fragment = document.createDocumentFragment();
        for (const character of node.nodeValue) {
          if (/\s/.test(character)) {
            fragment.appendChild(document.createTextNode(character));
            continue;
          }
          const letter = document.createElement("span");
          letter.className = "text-scatter-letter";
          letter.textContent = character;
          letter.setAttribute("aria-hidden", "true");
          fragment.appendChild(letter);
        }
        node.parentNode.replaceChild(fragment, node);
      });

      // Keep the original text available to screen readers after visual letters are wrapped.
      target.setAttribute("aria-label", target.textContent.replace(/\s+/g, " ").trim());
      target.querySelectorAll(".text-scatter-letter").forEach((letter) => letter.setAttribute("aria-hidden", "true"));
      let returnTimer;
      let lastScatter = 0;
      const scatter = () => {
        const now = performance.now();
        if (now - lastScatter < 500) return;
        lastScatter = now;
        window.clearTimeout(returnTimer);
        const letters = [...target.querySelectorAll(".text-scatter-letter")];
        letters.forEach((letter) => {
          const angle = Math.random() * Math.PI * 2;
          const distance = 18 + Math.random() * 42;
          const x = Math.cos(angle) * distance;
          const y = Math.sin(angle) * distance - (8 + Math.random() * 18);
          const rotation = (Math.random() - 0.5) * 100;
          letter.style.transitionDuration = `${180 + Math.random() * 220}ms`;
          letter.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${rotation.toFixed(1)}deg) scale(${(0.82 + Math.random() * 0.35).toFixed(2)})`;
        });
        returnTimer = window.setTimeout(() => {
          letters.forEach((letter) => {
            letter.style.transitionDuration = `${1100 + Math.random() * 600}ms`;
            letter.style.transform = "translate3d(0, 0, 0) rotate(0deg) scale(1)";
          });
        }, 850);
      };
      target.addEventListener("pointerenter", scatter, { passive: true });
      target.addEventListener("focusin", scatter);
    });
  }

  // Give clear feedback for project links that still need real URLs.
  let toastTimer;
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("show"), 3600);
  }

  document.querySelectorAll(".placeholder-link").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const project = link.dataset.project || "this project";
      const kind = link.dataset.kind || "link";
      showToast(`Add the real ${kind.toLowerCase()} URL for ${project} in index.html.`);
    });
  });

  // Validate the form, then open a prefilled email draft. No message is sent automatically.
  const form = document.getElementById("contact-form");
  const feedback = document.getElementById("form-feedback");
  if (form && feedback) form.addEventListener("submit", (event) => {
    event.preventDefault();
    feedback.textContent = "";

    if (!form.checkValidity()) {
      form.reportValidity();
      feedback.textContent = "Please complete all fields with a valid email address.";
      return;
    }

    const formData = new FormData(form);
    const name = String(formData.get("name")).trim();
    const email = String(formData.get("email")).trim();
    const subject = String(formData.get("subject")).trim();
    const message = String(formData.get("message")).trim();

    const body = `Hello Kinson,\n\n${message}\n\nBest regards,\n${name}\nReply to: ${email}`;
    const mailto = `mailto:kinsonbusis@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    feedback.textContent = "Opening your email app with a prepared draft. Review it and press Send in your email app.";
    window.location.href = mailto;
  });
});

// Yami, the portfolio assistant
(() => {
  const root = document.getElementById('yamiAssistant');
  if (!root) return;
  const launcher = document.getElementById('yamiLauncher');
  const bubble = document.getElementById('yamiBubble');
  const close = document.getElementById('yamiClose');
  const roamer = document.getElementById('yamiRoamer');

  // Yami roams on its own: picks a spot, runs there, idles, then wanders off again.
  if (roamer) {
    const sprite = roamer.querySelector('.yami-roamer-sprite');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let nextTimer = null;
    let state = '';
    let x = window.innerWidth * 0.12;
    let y = window.innerHeight * 0.38;
    let targetX = x;
    let targetY = y;
    let raf = 0;
    let facingLeft = false;
    let arcPrev = null;

    const setSpriteState = (next) => {
      if (!sprite || state === next) return;
      state = next;
      arcPrev = null;
      sprite.classList.remove('is-running', 'is-idle');
      sprite.classList.add(`is-${next}`);
    };
    const bounds = () => ({
      minX: 8,
      maxX: Math.max(8, window.innerWidth - roamer.offsetWidth - 8),
      minY: 80,
      maxY: Math.max(80, window.innerHeight - roamer.offsetHeight - 8),
    });
    const place = () => {
      roamer.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`;
    };
    const clearTimers = () => {
      window.clearTimeout(nextTimer);
    };

    const pickTarget = () => {
      const b = bounds();
      // Wander a moderate distance so each trip reads as a walk, not a teleport.
      const angle = Math.random() * Math.PI * 2;
      const dist = 160 + Math.random() * 280;
      targetX = Math.min(b.maxX, Math.max(b.minX, x + Math.cos(angle) * dist));
      targetY = Math.min(b.maxY, Math.max(b.minY, y + Math.sin(angle) * dist * 0.7));
      if (Math.hypot(targetX - x, targetY - y) < 80) {
        targetX = b.minX + Math.random() * (b.maxX - b.minX);
        targetY = b.minY + Math.random() * (b.maxY - b.minY);
      }
    };

    const SPEED = 2.2; // px per frame at 60fps
    let last = 0;
    const tick = (now) => {
      const dt = Math.min(3, last ? (now - last) / 16.667 : 1);
      last = now;
      const dx = targetX - x;
      const dy = targetY - y;
      const dist = Math.hypot(dx, dy);
      const step = SPEED * dt;
      if (dist > step) {
        x += (dx / dist) * step;
        y += (dy / dist) * step;
        place();
        // Same lightning the cursor leaves, trailing from Yami while he runs.
        if (window.yamiArc) {
          const ax = x + roamer.offsetWidth * 0.5;
          const ay = y + roamer.offsetHeight * 0.6;
          if (!arcPrev) arcPrev = { x: ax, y: ay };
          else if (Math.hypot(ax - arcPrev.x, ay - arcPrev.y) > 7) {
            window.yamiArc(arcPrev.x, arcPrev.y, ax, ay);
            arcPrev = { x: ax, y: ay };
          }
        }
        const left = dx < 0;
        if (Math.abs(dx) > 4 && left !== facingLeft) {
          facingLeft = left;
          roamer.classList.toggle('is-facing-left', left);
        }
        raf = requestAnimationFrame(tick);
      } else {
        x = targetX;
        y = targetY;
        place();
        raf = 0;
        last = 0;
        setSpriteState('idle');
        // Rest a moment before wandering off again.
        const rest = 1800 + Math.random() * 2600;
        nextTimer = window.setTimeout(wander, rest);
      }
    };

    const wander = () => {
      if (document.hidden || !bubble.hidden || drag) {
        // Hold still while the panel is open or the tab is hidden; check again shortly.
        nextTimer = window.setTimeout(wander, 1500);
        return;
      }
      clearTimers();
      pickTarget();
      setSpriteState('running');
      last = 0;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    setSpriteState('idle');
    const b0 = bounds();
    x = targetX = Math.min(b0.maxX, Math.max(b0.minX, x));
    y = targetY = Math.min(b0.maxY, Math.max(b0.minY, y));
    place();
    if (!reduceMotion) nextTimer = window.setTimeout(wander, 1200);

    // Grab and drag Yami anywhere; roaming resumes from the drop spot.
    let drag = null;
    let suppressClick = false;
    roamer.addEventListener('pointerdown', (event) => {
      if (event.button !== 0) return;
      drag = { id: event.pointerId, sx: event.clientX, sy: event.clientY, ox: event.clientX - x, oy: event.clientY - y, moved: false };
      roamer.setPointerCapture(event.pointerId);
    });
    roamer.addEventListener('pointermove', (event) => {
      if (!drag || event.pointerId !== drag.id) return;
      if (!drag.moved) {
        if (Math.hypot(event.clientX - drag.sx, event.clientY - drag.sy) < 5) return;
        drag.moved = true;
        clearTimers();
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
        roamer.classList.add('is-grabbed');
        setSpriteState('idle');
      }
      const b = bounds();
      const nx = Math.min(b.maxX, Math.max(b.minX, event.clientX - drag.ox));
      const ny = Math.min(b.maxY, Math.max(b.minY, event.clientY - drag.oy));
      if (Math.abs(nx - x) > 2) {
        const left = nx < x;
        if (left !== facingLeft) {
          facingLeft = left;
          roamer.classList.toggle('is-facing-left', left);
        }
      }
      x = targetX = nx;
      y = targetY = ny;
      place();
    });
    const endDrag = (event) => {
      if (!drag || event.pointerId !== drag.id) return;
      const moved = drag.moved;
      drag = null;
      roamer.classList.remove('is-grabbed');
      if (roamer.hasPointerCapture(event.pointerId)) roamer.releasePointerCapture(event.pointerId);
      if (moved) {
        suppressClick = true;
        window.setTimeout(() => { suppressClick = false; }, 0);
        clearTimers();
        if (!reduceMotion) nextTimer = window.setTimeout(wander, 400);
      }
    };
    roamer.addEventListener('pointerup', endDrag);
    roamer.addEventListener('pointercancel', endDrag);
    roamer.addEventListener('click', () => {
      if (suppressClick) return;
      setOpen(bubble.hidden);
    });
    window.addEventListener('resize', () => {
      const b = bounds();
      x = targetX = Math.min(b.maxX, Math.max(b.minX, x));
      y = targetY = Math.min(b.maxY, Math.max(b.minY, y));
      place();
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        clearTimers();
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
        setSpriteState('idle');
        if (!reduceMotion) nextTimer = window.setTimeout(wander, 1500);
      }
    });
  }
  const setOpen = (open) => {
    bubble.hidden = !open;
    if (launcher) launcher.setAttribute('aria-expanded', String(open));
    if (roamer) roamer.setAttribute('aria-expanded', String(open));
  };
  // Do not open automatically. The panel opens only when the roaming Yami is clicked.
  if (launcher) launcher.addEventListener('click', () => setOpen(bubble.hidden));
  if (close) close.addEventListener('click', () => setOpen(false));
  root.querySelectorAll('[data-yami-action]').forEach((button) => {
    button.addEventListener('click', () => {
      const action = button.dataset.yamiAction;
      const target = action === 'projects'
        ? document.querySelector('#projects, [data-section="projects"], a[href="#projects"]')
        : document.querySelector('#contact, [data-section="contact"], a[href="#contact"]');
      if (target) {
        if (target.matches('a')) target.click();
        else target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setOpen(false);
      } else {
        const message = action === 'projects' ? 'Look for the Projects section in the navigation!' : 'Use the Contact section to reach Kinson.';
        bubble.querySelector('p').textContent = message;
      }
    });
  });
})();
