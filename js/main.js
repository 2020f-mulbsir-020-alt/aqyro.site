/**
 * AQYRO — Main Interactions
 * Navigation, scroll reveals, section behaviors
 */

(function () {
  'use strict';

  /* ─── Weather Vane Navigation ─── */
  const vaneTrigger = document.getElementById('vaneTrigger');
  const navWheel = document.getElementById('navWheel');

  if (vaneTrigger && navWheel) {
    vaneTrigger.addEventListener('click', () => {
      const isOpen = vaneTrigger.getAttribute('aria-expanded') === 'true';
      vaneTrigger.setAttribute('aria-expanded', String(!isOpen));
      navWheel.hidden = isOpen;
    });

    document.addEventListener('click', (e) => {
      if (!vaneTrigger.contains(e.target) && !navWheel.contains(e.target)) {
        vaneTrigger.setAttribute('aria-expanded', 'false');
        navWheel.hidden = true;
      }
    });

    navWheel.querySelectorAll('.nav-wheel__link').forEach(link => {
      link.addEventListener('click', () => {
        vaneTrigger.setAttribute('aria-expanded', 'false');
        navWheel.hidden = true;
      });
    });
  }

  /* ─── Intersection Observer for Scroll Reveals ─── */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
  );

  document.querySelectorAll('.wind-text, .rain-drop-text, .aurora-text, .horizon-title').forEach(el => {
    revealObserver.observe(el);
  });

  /* ─── Cloud Archive Interactions ─── */
  const cloudFormations = document.querySelectorAll('.cloud-formation');

  cloudFormations.forEach(cloud => {
    cloud.addEventListener('click', () => {
      const isExpanded = cloud.getAttribute('aria-expanded') === 'true';
      const story = cloud.querySelector('.cloud-formation__story');

      cloudFormations.forEach(other => {
        if (other !== cloud) {
          other.setAttribute('aria-expanded', 'false');
          const otherStory = other.querySelector('.cloud-formation__story');
          if (otherStory) otherStory.hidden = true;
        }
      });

      cloud.setAttribute('aria-expanded', String(!isExpanded));
      if (story) story.hidden = isExpanded;
    });
  });

  /* ─── Thunder Cathedral — Lightning Reveals ─── */
  const thunderTitle = document.getElementById('thunderTitle');
  const thunderReveals = document.querySelectorAll('.thunder-reveal');
  let revealIndex = 0;
  let lastRevealTime = 0;

  function revealThunderContent(flashActive) {
    if (!flashActive) return;

    const now = Date.now();
    if (now - lastRevealTime < 800) return;
    lastRevealTime = now;

    if (thunderTitle && !thunderTitle.classList.contains('revealed')) {
      thunderTitle.classList.add('revealed');
      return;
    }

    if (revealIndex < thunderReveals.length) {
      thunderReveals[revealIndex].classList.add('revealed');
      revealIndex++;
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (window.AQYRO && window.AQYRO.lightning) {
      window.AQYRO.lightning.setFlashCallback(revealThunderContent);
    }
  });

  /* ─── Seasonal Orbit ─── */
  const seasonSection = document.querySelector('.section--seasons');
  const seasonTitle = document.getElementById('seasonTitle');
  const seasonDesc = document.getElementById('seasonDesc');
  const orbitNodes = document.querySelectorAll('.orbit-node');

  const seasonData = {
    spring: {
      title: 'Spring Bloom',
      desc: 'Cherry blossoms drift on warming breezes. The atmosphere softens, moisture returns, and the sky dresses in pale green light.'
    },
    summer: {
      title: 'Summer Heat',
      desc: 'High pressure domes expand across the continent. Cumulus towers build in the afternoon heat, promising brief, dramatic releases.'
    },
    autumn: {
      title: 'Autumn Drift',
      desc: 'Cool air descends from the north. Fronts sharpen. The sky takes on amber and violet tones as the year exhales its warmth.'
    },
    winter: {
      title: 'Winter Silence',
      desc: 'Stratus blankets the world. Ice crystals hang in still air. The atmosphere holds its breath, waiting for the return of light.'
    }
  };

  orbitNodes.forEach(node => {
    node.addEventListener('click', () => {
      const season = node.dataset.season;
      if (!season || !seasonData[season]) return;

      orbitNodes.forEach(n => n.classList.remove('active'));
      node.classList.add('active');

      if (seasonSection) seasonSection.dataset.activeSeason = season;

      if (seasonTitle) {
        seasonTitle.style.opacity = '0';
        setTimeout(() => {
          seasonTitle.textContent = seasonData[season].title;
          seasonTitle.style.opacity = '1';
        }, 300);
      }

      if (seasonDesc) {
        seasonDesc.style.opacity = '0';
        setTimeout(() => {
          seasonDesc.textContent = seasonData[season].desc;
          seasonDesc.style.opacity = '0.75';
        }, 300);
      }

      const ring = document.getElementById('orbitRing');
      if (ring) {
        const rotations = { spring: 0, summer: 90, autumn: 180, winter: 270 };
        ring.style.transform = `rotate(${rotations[season]}deg)`;
        ring.querySelectorAll('.orbit-node span').forEach(span => {
          span.style.transform = `rotate(${-rotations[season]}deg)`;
          span.style.display = 'inline-block';
        });
      }
    });
  });

  if (seasonSection) seasonSection.dataset.activeSeason = 'spring';

  /* ─── Wind Text Drift on Scroll ─── */
  const windSection = document.querySelector('.section--wind');
  const windTexts = document.querySelectorAll('.wind-text');

  if (windSection && windTexts.length) {
    window.addEventListener('scroll', () => {
      const rect = windSection.getBoundingClientRect();
      if (rect.top > window.innerHeight || rect.bottom < 0) return;

      const progress = 1 - rect.top / window.innerHeight;
      windTexts.forEach((text, i) => {
        const drift = Math.sin(progress * Math.PI + i * 0.5) * 15;
        text.style.transform = `translateX(${drift}px)`;
      });
    }, { passive: true });
  }

  /* ─── Enter AQYRO Button ─── */
  const enterBtn = document.getElementById('enterAqyro');

  if (enterBtn) {
    enterBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ─── Rain Drop Stagger ─── */
  const rainTexts = document.querySelectorAll('.rain-drop-text');
  const rainObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          rainTexts.forEach((text, i) => {
            setTimeout(() => text.classList.add('visible'), i * 600);
          });
          rainObserver.disconnect();
        }
      });
    },
    { threshold: 0.3 }
  );

  const rainSection = document.querySelector('.section--rain');
  if (rainSection) rainObserver.observe(rainSection);

  /* ─── Aurora Text Stagger ─── */
  const auroraTexts = document.querySelectorAll('.aurora-text');
  const auroraObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          auroraTexts.forEach((text, i) => {
            setTimeout(() => text.classList.add('visible'), i * 800);
          });
          auroraObserver.disconnect();
        }
      });
    },
    { threshold: 0.2 }
  );

  const auroraSection = document.querySelector('.section--aurora');
  if (auroraSection) auroraObserver.observe(auroraSection);

  /* ─── Vane Direction Based on Scroll ─── */
  const vaneArrow = document.querySelector('.vane-arrow');
  let lastScrollY = 0;

  if (vaneArrow) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const direction = scrollY > lastScrollY ? 1 : -1;
      const sections = document.querySelectorAll('.section');
      let currentAngle = 0;

      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.5 && rect.bottom >= window.innerHeight * 0.5) {
          const id = section.id;
          const angles = {
            'cloud-gate': -15,
            'wind-corridor': 45,
            'cloud-archive': 90,
            'temple-rain': 135,
            'thunder-cathedral': 180,
            'seasonal-orbit': 225,
            'aurora-chamber': 270,
            'sky-observatory': 300,
            'eye-storm': 330,
            'horizon-light': 0
          };
          currentAngle = angles[id] || 0;
        }
      });

      vaneArrow.style.transform = `rotate(${currentAngle + direction * 5}deg)`;
      vaneArrow.style.transition = 'transform 0.6s ease';
      lastScrollY = scrollY;
    }, { passive: true });
  }

})();
