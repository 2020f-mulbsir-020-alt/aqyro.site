/**
 * AQYRO — Atmospheric Canvas Effects
 * Cloud Gate, Wind, Rain, Lightning, Aurora, Storm Eye, Horizon
 */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─── Utility ─── */
  function resizeCanvas(canvas) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, w: rect.width, h: rect.height };
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  /* ═══ CLOUD GATE ═══ */
  class CloudGate {
    constructor(canvas) {
      this.canvas = canvas;
      this.clouds = [];
      this.scrollProgress = 0;
      this.init();
    }

    init() {
      const { w, h } = resizeCanvas(this.canvas);
      for (let i = 0; i < 24; i++) {
        this.clouds.push({
          x: Math.random() * w,
          y: Math.random() * h * 0.8,
          radius: 40 + Math.random() * 80,
          speed: 0.2 + Math.random() * 0.4,
          opacity: 0.3 + Math.random() * 0.4,
          layer: Math.floor(Math.random() * 3)
        });
      }
      if (!prefersReducedMotion) this.animate();
      window.addEventListener('scroll', () => this.onScroll(), { passive: true });
      window.addEventListener('resize', () => resizeCanvas(this.canvas));
    }

    onScroll() {
      const section = this.canvas.closest('.section');
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / (rect.height * 0.6)));
      this.scrollProgress = progress;
    }

    animate() {
      const { ctx, w, h } = resizeCanvas(this.canvas);
      ctx.clearRect(0, 0, w, h);

      const parting = this.scrollProgress * h * 0.5;

      this.clouds.forEach(cloud => {
        cloud.x += cloud.speed * (cloud.layer + 1) * 0.3;
        if (cloud.x > w + cloud.radius) cloud.x = -cloud.radius;

        const yOffset = cloud.layer * parting * 0.6;
        const opacity = cloud.opacity * (1 - this.scrollProgress * 0.7);

        ctx.beginPath();
        ctx.arc(cloud.x, cloud.y - yOffset, cloud.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(cloud.x + cloud.radius * 0.5, cloud.y - yOffset + 10, cloud.radius * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(237, 243, 248, ${opacity * 0.8})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(cloud.x - cloud.radius * 0.4, cloud.y - yOffset + 5, cloud.radius * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 220, 240, ${opacity * 0.6})`;
        ctx.fill();
      });

      if (this.scrollProgress > 0.3) {
        const revealOpacity = (this.scrollProgress - 0.3) * 1.4;
        const gradient = ctx.createLinearGradient(0, h * 0.5, 0, h);
        gradient.addColorStop(0, `rgba(143, 183, 217, ${revealOpacity * 0.3})`);
        gradient.addColorStop(1, `rgba(23, 32, 48, ${revealOpacity * 0.15})`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, h * 0.4, w, h * 0.6);
      }

      requestAnimationFrame(() => this.animate());
    }
  }

  /* ═══ WIND PARTICLES ═══ */
  class WindParticles {
    constructor(canvas) {
      this.canvas = canvas;
      this.particles = [];
      this.init();
    }

    init() {
      const { w, h } = resizeCanvas(this.canvas);
      for (let i = 0; i < 60; i++) {
        this.particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          length: 20 + Math.random() * 60,
          speed: 1 + Math.random() * 3,
          opacity: 0.05 + Math.random() * 0.15,
          angle: -0.1 + Math.random() * 0.2
        });
      }
      if (!prefersReducedMotion) this.animate();
      window.addEventListener('resize', () => resizeCanvas(this.canvas));
    }

    animate() {
      const { ctx, w, h } = resizeCanvas(this.canvas);
      ctx.clearRect(0, 0, w, h);

      this.particles.forEach(p => {
        p.x += p.speed;
        if (p.x > w + p.length) {
          p.x = -p.length;
          p.y = Math.random() * h;
        }

        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.length * Math.cos(p.angle), p.y + p.length * Math.sin(p.angle));
        ctx.strokeStyle = `rgba(143, 183, 217, ${p.opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      requestAnimationFrame(() => this.animate());
    }
  }

  /* ═══ RAIN TEMPLE ═══ */
  class RainSimulation {
    constructor(canvas) {
      this.canvas = canvas;
      this.drops = [];
      this.init();
    }

    init() {
      const { w, h } = resizeCanvas(this.canvas);
      for (let i = 0; i < 150; i++) {
        this.drops.push({
          x: Math.random() * w,
          y: Math.random() * h,
          speed: 4 + Math.random() * 8,
          length: 10 + Math.random() * 20,
          opacity: 0.1 + Math.random() * 0.3
        });
      }
      if (!prefersReducedMotion) this.animate();
      window.addEventListener('resize', () => resizeCanvas(this.canvas));
    }

    animate() {
      const { ctx, w, h } = resizeCanvas(this.canvas);
      ctx.clearRect(0, 0, w, h);

      this.drops.forEach(d => {
        d.y += d.speed;
        if (d.y > h) {
          d.y = -d.length;
          d.x = Math.random() * w;
        }

        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - 1, d.y + d.length);
        ctx.strokeStyle = `rgba(143, 183, 217, ${d.opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      requestAnimationFrame(() => this.animate());
    }
  }

  /* ═══ LIGHTNING CATHEDRAL ═══ */
  class LightningEffect {
    constructor(canvas) {
      this.canvas = canvas;
      this.flashTimer = 0;
      this.isFlashing = false;
      this.flashDuration = 0;
      this.boltPoints = [];
      this.onFlash = null;
      this.init();
    }

    init() {
      if (!prefersReducedMotion) this.animate();
      window.addEventListener('resize', () => resizeCanvas(this.canvas));
    }

    setFlashCallback(cb) {
      this.onFlash = cb;
    }

    generateBolt(w, h) {
      const points = [];
      let x = w * 0.3 + Math.random() * w * 0.4;
      let y = 0;
      points.push({ x, y });

      while (y < h * 0.7) {
        x += (Math.random() - 0.5) * 40;
        y += 15 + Math.random() * 25;
        points.push({ x, y });
      }
      return points;
    }

    animate() {
      const { ctx, w, h } = resizeCanvas(this.canvas);
      ctx.clearRect(0, 0, w, h);

      this.flashTimer++;

      if (!this.isFlashing && this.flashTimer > 120 + Math.random() * 180) {
        this.isFlashing = true;
        this.flashDuration = 8 + Math.random() * 12;
        this.boltPoints = this.generateBolt(w, h);
        this.flashTimer = 0;
        if (this.onFlash) this.onFlash(true);
      }

      if (this.isFlashing) {
        this.flashDuration--;

        const intensity = this.flashDuration > 4 ? 0.15 : 0.15 * (this.flashDuration / 4);
        ctx.fillStyle = `rgba(200, 210, 230, ${intensity})`;
        ctx.fillRect(0, 0, w, h);

        if (this.boltPoints.length > 1) {
          ctx.beginPath();
          ctx.moveTo(this.boltPoints[0].x, this.boltPoints[0].y);
          this.boltPoints.forEach(p => ctx.lineTo(p.x, p.y));
          ctx.strokeStyle = `rgba(231, 184, 90, ${intensity * 4})`;
          ctx.lineWidth = 2;
          ctx.shadowColor = 'rgba(231, 184, 90, 0.8)';
          ctx.shadowBlur = 20;
          ctx.stroke();
          ctx.shadowBlur = 0;
        }

        if (this.flashDuration <= 0) {
          this.isFlashing = false;
          if (this.onFlash) this.onFlash(false);
        }
      }

      requestAnimationFrame(() => this.animate());
    }
  }

  /* ═══ AURORA CHAMBER ═══ */
  class AuroraEffect {
    constructor(canvas) {
      this.canvas = canvas;
      this.time = 0;
      this.init();
    }

    init() {
      if (!prefersReducedMotion) this.animate();
      window.addEventListener('resize', () => resizeCanvas(this.canvas));
    }

    animate() {
      const { ctx, w, h } = resizeCanvas(this.canvas);
      ctx.clearRect(0, 0, w, h);
      this.time += 0.008;

      const colors = [
        [78, 205, 196],
        [123, 107, 168],
        [231, 184, 90],
        [143, 183, 217]
      ];

      colors.forEach((color, i) => {
        ctx.beginPath();
        const baseY = h * 0.2 + i * h * 0.12;

        for (let x = 0; x <= w; x += 4) {
          const y = baseY +
            Math.sin(x * 0.005 + this.time + i * 1.5) * 40 +
            Math.sin(x * 0.012 + this.time * 1.3 + i) * 20;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();

        const [r, g, b] = color;
        const gradient = ctx.createLinearGradient(0, baseY - 60, 0, h);
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.25)`);
        gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.08)`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      requestAnimationFrame(() => this.animate());
    }
  }

  /* ═══ EYE OF THE STORM ═══ */
  class StormEye {
    constructor(canvas) {
      this.canvas = canvas;
      this.rotation = 0;
      this.init();
    }

    init() {
      if (!prefersReducedMotion) this.animate();
      window.addEventListener('resize', () => resizeCanvas(this.canvas));
    }

    animate() {
      const { ctx, w, h } = resizeCanvas(this.canvas);
      ctx.clearRect(0, 0, w, h);
      this.rotation += 0.003;

      const cx = w / 2;
      const cy = h / 2;
      const eyeRadius = Math.min(w, h) * 0.15;

      for (let ring = 0; ring < 5; ring++) {
        const radius = eyeRadius + ring * 40 + 20;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);

        const opacity = 0.08 - ring * 0.012;
        ctx.strokeStyle = `rgba(143, 183, 217, ${opacity})`;
        ctx.lineWidth = 2;
        ctx.setLineDash([10, 15]);
        ctx.lineDashOffset = this.rotation * 100 * (ring + 1);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      for (let i = 0; i < 8; i++) {
        const angle = this.rotation * 2 + (i / 8) * Math.PI * 2;
        const startR = eyeRadius + 30;
        const endR = eyeRadius + 120 + Math.sin(this.rotation * 3 + i) * 20;

        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(angle) * startR, cy + Math.sin(angle) * startR);
        ctx.lineTo(cx + Math.cos(angle) * endR, cy + Math.sin(angle) * endR);
        ctx.strokeStyle = `rgba(231, 184, 90, ${0.05 + Math.sin(this.rotation * 5 + i) * 0.03})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      const eyeGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, eyeRadius);
      eyeGrad.addColorStop(0, 'rgba(26, 40, 64, 0.3)');
      eyeGrad.addColorStop(0.7, 'rgba(23, 32, 48, 0.1)');
      eyeGrad.addColorStop(1, 'rgba(23, 32, 48, 0)');
      ctx.fillStyle = eyeGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, eyeRadius, 0, Math.PI * 2);
      ctx.fill();

      requestAnimationFrame(() => this.animate());
    }
  }

  /* ═══ HORIZON OF LIGHT ═══ */
  class HorizonLight {
    constructor(canvas) {
      this.canvas = canvas;
      this.time = 0;
      this.init();
    }

    init() {
      if (!prefersReducedMotion) this.animate();
      window.addEventListener('resize', () => resizeCanvas(this.canvas));
    }

    animate() {
      const { ctx, w, h } = resizeCanvas(this.canvas);
      ctx.clearRect(0, 0, w, h);
      this.time += 0.005;

      const sunY = h * 0.55 + Math.sin(this.time) * 5;
      const sunGrad = ctx.createRadialGradient(w / 2, sunY, 0, w / 2, sunY, w * 0.4);
      sunGrad.addColorStop(0, 'rgba(231, 184, 90, 0.3)');
      sunGrad.addColorStop(0.3, 'rgba(232, 146, 90, 0.15)');
      sunGrad.addColorStop(1, 'rgba(231, 184, 90, 0)');

      ctx.fillStyle = sunGrad;
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < 6; i++) {
        const rayAngle = (i / 6) * Math.PI + Math.sin(this.time + i) * 0.1;
        const rayLen = w * 0.6;
        ctx.beginPath();
        ctx.moveTo(w / 2, sunY);
        ctx.lineTo(
          w / 2 + Math.cos(rayAngle) * rayLen,
          sunY + Math.sin(rayAngle) * rayLen * 0.3
        );
        ctx.strokeStyle = `rgba(231, 184, 90, ${0.03 + Math.sin(this.time * 2 + i) * 0.02})`;
        ctx.lineWidth = 40;
        ctx.stroke();
      }

      requestAnimationFrame(() => this.animate());
    }
  }

  /* ─── Initialize All ─── */
  window.AQYRO = window.AQYRO || {};

  document.addEventListener('DOMContentLoaded', () => {
    const cloudCanvas = document.getElementById('cloudCanvas');
    const windCanvas = document.getElementById('windCanvas');
    const rainCanvas = document.getElementById('rainCanvas');
    const lightningCanvas = document.getElementById('lightningCanvas');
    const auroraCanvas = document.getElementById('auroraCanvas');
    const stormCanvas = document.getElementById('stormCanvas');
    const horizonCanvas = document.getElementById('horizonCanvas');

    if (cloudCanvas) window.AQYRO.cloudGate = new CloudGate(cloudCanvas);
    if (windCanvas) window.AQYRO.wind = new WindParticles(windCanvas);
    if (rainCanvas) window.AQYRO.rain = new RainSimulation(rainCanvas);
    if (lightningCanvas) window.AQYRO.lightning = new LightningEffect(lightningCanvas);
    if (auroraCanvas) window.AQYRO.aurora = new AuroraEffect(auroraCanvas);
    if (stormCanvas) window.AQYRO.stormEye = new StormEye(stormCanvas);
    if (horizonCanvas) window.AQYRO.horizon = new HorizonLight(horizonCanvas);
  });
})();
