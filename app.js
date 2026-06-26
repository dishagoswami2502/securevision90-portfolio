/* ─────────────────────────────────────────────
   SecureVision 90 — JavaScript
   Particles · Lightbox · Library Modals · Nav
───────────────────────────────────────────── */

/* ══════════════════════════════════════════
   1. PARTICLE CANVAS BACKGROUND
══════════════════════════════════════════ */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let W, H;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function randomBetween(a, b) { return Math.random() * (b - a) + a; }

  function createParticle() {
    return {
      x: randomBetween(0, W),
      y: randomBetween(0, H),
      r: randomBetween(0.5, 2.2),
      vx: randomBetween(-0.3, 0.3),
      vy: randomBetween(-0.5, -0.1),
      alpha: randomBetween(0.2, 0.8),
      color: ['#3B82F6', '#06B6D4', '#6C63FF', '#F59E0B'][Math.floor(Math.random() * 4)],
    };
  }

  for (let i = 0; i < 120; i++) particles.push(createParticle());

  function drawLine(p1, p2, dist) {
    const alpha = (1 - dist / 120) * 0.15;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.strokeStyle = `rgba(59,130,246,${alpha})`;
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.y < -5) { p.y = H + 5; p.x = randomBetween(0, W); }
      if (p.x < -5) p.x = W + 5;
      if (p.x > W + 5) p.x = -5;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + Math.floor(p.alpha * 255).toString(16).padStart(2, '0');
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = p.x - particles[j].x;
        const dy = p.y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) drawLine(p, particles[j], dist);
      }
    });

    requestAnimationFrame(animate);
  }
  animate();
})();


/* ══════════════════════════════════════════
   2. NAVBAR — Active Link + Hamburger
══════════════════════════════════════════ */
(function initNav() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const links = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.style.background = 'rgba(5,10,20,0.95)';
    } else {
      navbar.style.background = 'rgba(5,10,20,0.8)';
    }

    // Active link highlight
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(sec => {
      const top = sec.offsetTop - 100;
      const bottom = top + sec.offsetHeight;
      if (window.scrollY >= top && window.scrollY < bottom) {
        links.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${sec.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  });

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  // Close menu on link click
  links.forEach(l => {
    l.addEventListener('click', () => navLinks.classList.remove('open'));
  });
})();


/* ══════════════════════════════════════════
   3. SCROLL REVEAL ANIMATIONS
══════════════════════════════════════════ */
(function initReveal() {
  const style = document.createElement('style');
  style.textContent = `
    .reveal { opacity: 0; transform: translateY(30px); transition: opacity 0.7s ease, transform 0.7s ease; }
    .reveal.revealed { opacity: 1; transform: translateY(0); }
  `;
  document.head.appendChild(style);

  const targets = document.querySelectorAll(
    '.feature-card, .lib-card, .gallery-item, .team-card, .spec-card, .about-highlight-cards .highlight-card, .arch-step'
  );

  targets.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 4) * 0.08}s`;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(el => observer.observe(el));
})();


/* ══════════════════════════════════════════
   4. GALLERY LIGHTBOX
══════════════════════════════════════════ */
const galleryData = [
  { src: 'WhatsApp Image 2026-06-26 at 11.15.27 AM.jpeg',    caption: '🖥️ AI Surveillance Dashboard — 4 people detected in real-time' },
  { src: 'WhatsApp Image 2026-06-26 at 11.15.27 AM (1).jpeg', caption: '🎯 Face Recognition — Akshat Prakhar identified with green box' },
  { src: 'WhatsApp Image 2026-06-26 at 11.17.30 AM.jpeg',    caption: '👤 Person Detection — 93% confidence single-person bounding box' },
  { src: 'WhatsApp Image 2026-06-26 at 11.17.31 AM.jpeg',    caption: '🟢 Face Detection — Multi-face green bounding boxes' },
  { src: 'WhatsApp Image 2026-06-26 at 11.17.31 AM (1).jpeg', caption: '⚠️ Weapon Detection — Scissors detected, immediate alert triggered' },
  { src: 'WhatsApp Image 2026-06-26 at 11.17.31 AM (2).jpeg', caption: '🔴 Unknown Faces — Unauthorized persons flagged in red' },
  { src: 'WhatsApp Image 2026-06-26 at 11.17.32 AM.jpeg',    caption: '📊 Live Dashboard — Weapon + face alerts with breakdown stats' },
  { src: 'WhatsApp Image 2026-06-26 at 11.17.32 AM (1).jpeg', caption: '🎪 Exhibition — Live dual-camera demo at engineering event' },
  { src: 'WhatsApp Image 2026-06-26 at 11.33.43 AM.jpeg',    caption: '🏷️ Project Logo — SecureVision 90 official identity' },
];

let currentLbIndex = 0;
const lightbox = document.getElementById('lightbox');
const lbImage = document.getElementById('lbImage');
const lbCaption = document.getElementById('lbCaption');

function openLightbox(index) {
  currentLbIndex = index;
  updateLightbox();
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function shiftLightbox(dir) {
  currentLbIndex = (currentLbIndex + dir + galleryData.length) % galleryData.length;
  updateLightbox();
}

function updateLightbox() {
  const item = galleryData[currentLbIndex];
  lbImage.style.opacity = '0';
  setTimeout(() => {
    lbImage.src = item.src;
    lbCaption.textContent = item.caption;
    lbImage.style.opacity = '1';
    lbImage.style.transition = 'opacity 0.3s';
  }, 150);
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') shiftLightbox(-1);
  if (e.key === 'ArrowRight') shiftLightbox(1);
});


/* ══════════════════════════════════════════
   5. LIBRARY MODAL DATA
══════════════════════════════════════════ */
const libData = {
  yolo: {
    title: 'YOLOv8',
    tagline: 'You Only Look Once — Real-time Object Detection',
    logo: 'https://avatars.githubusercontent.com/u/26833433?v=4',
    logoText: null,
    logoBg: null,
    body: `
      <p><strong>YOLOv8</strong> by Ultralytics is the state-of-the-art object detection model used in SecureVision 90 for real-time person detection and weapon identification.</p>
      <p>In our project, YOLOv8 processes each camera frame and detects:</p>
      <p>• 👤 <strong>Persons</strong> — with bounding boxes and confidence percentages (80-95%)</p>
      <p>• 🔪 <strong>Weapons</strong> — scissors, knives, and other dangerous objects triggering immediate red alerts</p>
      <p>It runs entirely on Raspberry Pi 5 with an optimized model, achieving <strong>3-7 FPS</strong> in real-world testing.</p>
    `,
    tags: ['PyTorch', 'Object Detection', 'Computer Vision', 'Real-time', 'Edge AI'],
    link: 'https://docs.ultralytics.com/',
  },
  mediapipe: {
    title: 'MediaPipe',
    tagline: 'Google\'s Lightweight ML Framework for Pose Estimation',
    logo: 'https://avatars.githubusercontent.com/u/50450676?v=4',
    logoText: null,
    logoBg: null,
    body: `
      <p><strong>MediaPipe</strong> is a Google framework for building multimodal applied ML pipelines. In SecureVision 90, it powers the <strong>Fight/Aggression Detection</strong> module.</p>
      <p>It tracks <strong>33 body keypoints</strong> in real-time — shoulders, elbows, wrists, knees — and analyzes rapid or unusual movements to flag potential fights.</p>
      <p>MediaPipe's <strong>Pose Landmarker</strong> runs on-device with minimal latency, making it perfect for Raspberry Pi deployment.</p>
    `,
    tags: ['Pose Estimation', 'Skeleton Tracking', 'Google', 'Edge ML', 'Fight Detection'],
    link: 'https://mediapipe.readthedocs.io/',
  },
  deepface: {
    title: 'DeepFace',
    tagline: 'Lightweight Face Recognition & Analysis Library',
    logo: null,
    logoText: 'DF',
    logoBg: 'linear-gradient(135deg,#6C63FF,#3B82F6)',
    body: `
      <p><strong>DeepFace</strong> is a Python library that wraps state-of-the-art face recognition models (VGG-Face, FaceNet, OpenFace, DeepID, ArcFace, Dlib).</p>
      <p>In our system, DeepFace:</p>
      <p>• Generates <strong>face embeddings</strong> for enrolled known faces</p>
      <p>• Compares live detections against the enrollment database</p>
      <p>• Returns "Known" (green box) or "Unknown" (orange/red box) in real-time</p>
      <p>The face management panel in our dashboard allows <strong>registering new faces</strong> directly from the live feed.</p>
    `,
    tags: ['Face Recognition', 'FaceNet', 'ArcFace', 'Biometrics', 'Embeddings'],
    link: 'https://github.com/serengil/deepface',
  },
  opencv: {
    title: 'OpenCV',
    tagline: 'Open Source Computer Vision Library',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/3/32/OpenCV_Logo_with_text_svg_version.svg',
    logoText: null,
    logoBg: null,
    body: `
      <p><strong>OpenCV</strong> (Open Source Computer Vision Library) is the backbone of all visual processing in SecureVision 90.</p>
      <p>It handles:</p>
      <p>• 📷 <strong>Camera capture</strong> — reading frames from Logitech webcam via cv2.VideoCapture</p>
      <p>• 🎨 <strong>Drawing overlays</strong> — bounding boxes, labels, confidence text on video frames</p>
      <p>• 🔄 <strong>Frame preprocessing</strong> — resizing, color conversion (BGR → RGB) for model input</p>
      <p>• 📡 <strong>MJPEG streaming</strong> — sending video frames to the web dashboard</p>
    `,
    tags: ['C++', 'Python', 'Video Capture', 'Image Processing', 'Drawing'],
    link: 'https://docs.opencv.org/',
  },
  python: {
    title: 'Python 3.11',
    tagline: 'The Language Powering the Entire System',
    logo: 'https://www.python.org/static/community_logos/python-logo-generic.svg',
    logoText: null,
    logoBg: null,
    body: `
      <p><strong>Python 3.11</strong> serves as the core language for SecureVision 90 — from AI inference to web server to hardware communication.</p>
      <p>The entire backend is written in Python, leveraging:</p>
      <p>• <strong>asyncio</strong> for asynchronous operations</p>
      <p>• <strong>threading</strong> for parallel AI model execution</p>
      <p>• <strong>subprocess</strong> for system-level hardware interfacing</p>
      <p>Python 3.11's improved performance (10-15% faster than 3.10) was critical for running multiple AI models simultaneously on Raspberry Pi.</p>
    `,
    tags: ['Python 3.11', 'AsyncIO', 'Threading', 'Scripting', 'Backend'],
    link: 'https://www.python.org/',
  },
  flask: {
    title: 'Flask',
    tagline: 'Micro Web Framework for the Dashboard Server',
    logo: 'https://flask.palletsprojects.com/en/stable/_images/flask-horizontal.png',
    logoText: null,
    logoBg: '#FFFFFF',
    body: `
      <p><strong>Flask</strong> is the lightweight Python web framework serving the SecureVision 90 dashboard to any browser on the local network.</p>
      <p>Flask provides:</p>
      <p>• 🌐 <strong>HTTP routes</strong> for the dashboard, video stream, and face registration API</p>
      <p>• 📡 <strong>Video streaming endpoint</strong> via multipart/x-mixed-replace for live MJPEG feed</p>
      <p>• 🔗 <strong>Integration with Flask-SocketIO</strong> for real-time event push to browser clients</p>
      <p>The entire dashboard is accessible at <code>http://localhost:5000</code> on the Raspberry Pi's local network.</p>
    `,
    tags: ['HTTP Server', 'REST API', 'MJPEG', 'Routes', 'Python'],
    link: 'https://flask.palletsprojects.com/',
  },
  socketio: {
    title: 'Socket.IO',
    tagline: 'Real-time Bidirectional Event-based Communication',
    logo: null,
    logoText: 'IO',
    logoBg: 'linear-gradient(135deg,#010101,#25D4FE)',
    body: `
      <p><strong>Socket.IO</strong> (via Flask-SocketIO) enables real-time alert pushing from the Python backend to the browser dashboard — without polling.</p>
      <p>In SecureVision 90, Socket.IO broadcasts:</p>
      <p>• 🔔 <strong>New alert events</strong> — face detection, weapon alerts, fight alerts</p>
      <p>• 📊 <strong>Live stats updates</strong> — people count, FPS, total alerts today</p>
      <p>• 📝 <strong>Alert log entries</strong> — timestamped events for the right-panel list</p>
      <p>This gives the dashboard its "live" feeling — events appear within milliseconds of detection.</p>
    `,
    tags: ['WebSocket', 'Real-time', 'Events', 'Push Notifications', 'LAN'],
    link: 'https://flask-socketio.readthedocs.io/',
  },
  threading: {
    title: 'Python Threading',
    tagline: 'Parallel AI Processing on a Single Device',
    logo: null,
    logoText: '⚙️',
    logoBg: 'linear-gradient(135deg,#FF6B6B,#EE5A24)',
    body: `
      <p><strong>Python's threading module</strong> is critical for running multiple AI models simultaneously on the Raspberry Pi without blocking the video stream.</p>
      <p>SecureVision 90 uses separate threads for:</p>
      <p>• 🧵 <strong>Camera capture</strong> — continuous frame grabbing</p>
      <p>• 🧵 <strong>YOLO inference</strong> — person & weapon detection</p>
      <p>• 🧵 <strong>DeepFace recognition</strong> — face matching (runs less frequently)</p>
      <p>• 🧵 <strong>MediaPipe pose</strong> — fight detection analysis</p>
      <p>• 🧵 <strong>Flask server</strong> — dashboard serving</p>
      <p>This parallel architecture ensures no single heavy computation blocks the others.</p>
    `,
    tags: ['Multithreading', 'Concurrency', 'Parallel AI', 'Queue', 'Performance'],
    link: 'https://docs.python.org/3/library/threading.html',
  },
  html5: {
    title: 'HTML5 / CSS3',
    tagline: 'The Dashboard Frontend Interface',
    logo: null,
    logoText: 'HTML',
    logoBg: 'linear-gradient(135deg,#E44D26,#F16529)',
    body: `
      <p>The <strong>AI Surveillance Dashboard</strong> is a pure <strong>HTML5 + CSS3 + JavaScript</strong> web application served by Flask.</p>
      <p>The dashboard displays:</p>
      <p>• 📹 <strong>Live MJPEG video feed</strong> from the camera</p>
      <p>• 📊 <strong>Real-time stats</strong> — People in Frame, FPS, Total Alerts, Known Faces</p>
      <p>• 🔔 <strong>Live alert log</strong> — Unknown Face, Weapon, Fight events with timestamps</p>
      <p>• 📈 <strong>Alert breakdown</strong> — Fights, Weapons, Unknown, Following counters</p>
      <p>• 👤 <strong>Face Management</strong> — Register new known faces from the feed</p>
    `,
    tags: ['Frontend', 'Dashboard', 'HTML5', 'CSS3', 'Web App'],
    link: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
  },
  chartjs: {
    title: 'Chart.js',
    tagline: 'Beautiful Charts for Alert Analytics',
    logo: null,
    logoText: '📈',
    logoBg: 'linear-gradient(135deg,#FF6384,#FF9F40)',
    body: `
      <p><strong>Chart.js</strong> (or similar charting) provides the visual analytics in the alert breakdown section of the SecureVision dashboard.</p>
      <p>Charts display:</p>
      <p>• 🔴 <strong>Fight incidents</strong> over time</p>
      <p>• ⚠️ <strong>Weapon detections</strong> frequency</p>
      <p>• 👤 <strong>Unknown face alerts</strong> per hour</p>
      <p>These live-updating charts give security personnel a quick overview of threat patterns without reviewing individual alerts.</p>
    `,
    tags: ['Charts', 'Analytics', 'Visualization', 'Dashboard', 'JavaScript'],
    link: 'https://www.chartjs.org/',
  },
  rpi: {
    title: 'Raspberry Pi 5',
    tagline: 'The Edge Computing Heart of SecureVision 90',
    logo: null,
    logoText: 'RPi',
    logoBg: 'linear-gradient(135deg,#C51A4A,#8B0000)',
    body: `
      <p>The <strong>Raspberry Pi 5</strong> is the powerful single-board computer running the entire SecureVision 90 system — no cloud, no external servers.</p>
      <p>Hardware specs used:</p>
      <p>• 🧠 <strong>CPU:</strong> Quad-core Cortex-A76 @ 2.4GHz</p>
      <p>• 💾 <strong>RAM:</strong> 8GB LPDDR4X</p>
      <p>• 💿 <strong>Storage:</strong> 64GB MicroSD</p>
      <p>• 🖥️ <strong>Display:</strong> 3.5" TFT LCD touchscreen</p>
      <p>• 📡 <strong>Network:</strong> Gigabit Ethernet + WiFi 5</p>
      <p>The Pi 5's improved CPU allows running YOLOv8 + DeepFace + MediaPipe in parallel at usable frame rates.</p>
    `,
    tags: ['Raspberry Pi', 'ARM', 'Edge Computing', 'Linux', 'IoT', 'Offline AI'],
    link: 'https://www.raspberrypi.com/products/raspberry-pi-5/',
  },
  webcam: {
    title: 'Logitech C270',
    tagline: 'HD Webcam — 720p Video Input',
    logo: null,
    logoText: '📷',
    logoBg: 'linear-gradient(135deg,#2d3436,#636e72)',
    body: `
      <p>The <strong>Logitech C270</strong> HD webcam serves as the primary video input for SecureVision 90.</p>
      <p>Why this webcam?</p>
      <p>• 📹 <strong>720p @ 30fps</strong> — sufficient resolution for accurate AI detection</p>
      <p>• 🔌 <strong>USB plug-and-play</strong> — direct connection to Raspberry Pi without drivers</p>
      <p>• 💡 <strong>Fixed focus</strong> — ideal for fixed surveillance positions</p>
      <p>• 💰 <strong>Low cost</strong> — keeps total system cost minimal</p>
      <p>OpenCV accesses it via <code>cv2.VideoCapture(0)</code> and processes frames at a configurable resolution (typically 640×480 for performance).</p>
    `,
    tags: ['USB Camera', '720p', 'OpenCV', 'Video Capture', 'Hardware'],
    link: 'https://www.logitech.com/en-us/products/webcams/c270-hd-webcam.960-000694.html',
  },
  numpy: {
    title: 'NumPy',
    tagline: 'Numerical Array Processing for AI Pipelines',
    logo: null,
    logoText: 'np',
    logoBg: 'linear-gradient(135deg,#013243,#4DABCF)',
    body: `
      <p><strong>NumPy</strong> is the fundamental package for scientific computing in Python — and an invisible but essential part of SecureVision 90.</p>
      <p>NumPy powers:</p>
      <p>• 🖼️ <strong>Image arrays</strong> — every video frame is a NumPy ndarray (H×W×3 uint8)</p>
      <p>• 📐 <strong>Bounding box math</strong> — coordinate calculations for drawing detection boxes</p>
      <p>• 🧮 <strong>Embedding arithmetic</strong> — cosine similarity for face recognition comparison</p>
      <p>• 🎭 <strong>Pose keypoints</strong> — MediaPipe landmark arrays for fight angle calculations</p>
      <p>Nearly every AI library (PyTorch, OpenCV, MediaPipe) exchanges data as NumPy arrays.</p>
    `,
    tags: ['Arrays', 'Math', 'Image Data', 'Scientific', 'Foundation'],
    link: 'https://numpy.org/doc/stable/',
  },
};

/* ══════════════════════════════════════════
   6. LIBRARY MODAL FUNCTIONS
══════════════════════════════════════════ */
const libModal = document.getElementById('libModal');
const modalLogo = document.getElementById('modalLogo');
const modalLogoText = document.getElementById('modalLogoText');
const modalTitle = document.getElementById('modalTitle');
const modalTagline = document.getElementById('modalTagline');
const modalBody = document.getElementById('modalBody');
const modalTags = document.getElementById('modalTags');
const modalLink = document.getElementById('modalLink');

function openLibModal(key) {
  const data = libData[key];
  if (!data) return;

  // Logo
  if (data.logo) {
    modalLogo.src = data.logo;
    modalLogo.alt = data.title;
    modalLogo.style.display = 'block';
    modalLogoText.style.display = 'none';
  } else if (data.logoText) {
    modalLogoText.textContent = data.logoText;
    modalLogoText.style.background = data.logoBg || '#333';
    modalLogoText.style.display = 'flex';
    modalLogo.style.display = 'none';
  }

  modalTitle.textContent = data.title;
  modalTagline.textContent = data.tagline;
  modalBody.innerHTML = data.body;

  // Tags
  modalTags.innerHTML = data.tags
    .map(t => `<span class="modal-tag">${t}</span>`)
    .join('');

  modalLink.href = data.link;
  modalLink.textContent = `Visit Official Docs →`;

  libModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLibModal() {
  libModal.classList.remove('open');
  document.body.style.overflow = '';
}

// Close modal on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && libModal.classList.contains('open')) {
    closeLibModal();
  }
});


/* ══════════════════════════════════════════
   7. ANIMATED COUNTER (Stats)
══════════════════════════════════════════ */
(function initCounters() {
  function animateValue(el, start, end, duration, suffix) {
    const range = end - start;
    const startTime = performance.now();
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(start + range * eased) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const statsEl = document.querySelector('.hero-stats');
  if (!statsEl) return;

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      // Animate hero stat values
      const statValues = document.querySelectorAll('.stat-value');
      observer.disconnect();
    }
  }, { threshold: 0.5 });

  observer.observe(statsEl);
})();


/* ══════════════════════════════════════════
   8. SMOOTH SECTION TRANSITION GLOW
══════════════════════════════════════════ */
(function addSectionGlows() {
  const glowColors = {
    'hero': 'rgba(59,130,246,0.08)',
    'about': 'rgba(6,182,212,0.06)',
    'features': 'rgba(239,68,68,0.06)',
    'stack': 'rgba(108,99,255,0.07)',
    'gallery': 'rgba(16,185,129,0.06)',
    'architecture': 'rgba(245,158,11,0.06)',
    'team': 'rgba(59,130,246,0.06)',
  };
  // Applied via CSS already
})();


/* ══════════════════════════════════════════
   9. TYPING EFFECT IN HERO
══════════════════════════════════════════ */
(function initTypingEffect() {
  const badge = document.querySelector('.hero-badge');
  if (!badge) return;
  // Badge already has content, just add a blinking cursor effect
})();

console.log('%c🔵 SecureVision 90 Portfolio Loaded', 'color:#3B82F6;font-size:16px;font-weight:bold;');
console.log('%cAI Surveillance System — Engineering Notebook 2026', 'color:#06B6D4;font-size:12px;');


/* ══════════════════════════════════════════
   10. PDF VIEWER — Open / Close
══════════════════════════════════════════ */
const PDF_SRC = "Most surveillance systems are either passive CCTV cameras that only record incidents or expensive AI solutions that rely on cloud servers and constant internet connectivity. Running advanced featu.pdf";

const pdfModal    = document.getElementById('pdfModal');
const pdfBackdrop = document.getElementById('pdfBackdrop');
const pdfIframe   = document.getElementById('pdfIframe');
let pdfLoaded = false;

function openPdfViewer() {
  // Show loading spinner inside iframe wrapper
  const body = pdfModal.querySelector('.pdf-modal-body');

  // Inject a loading overlay only the first time
  if (!pdfLoaded) {
    const loader = document.createElement('div');
    loader.className = 'pdf-loading';
    loader.id = 'pdfLoader';
    loader.innerHTML = `
      <div class="pdf-spinner"></div>
      <span>Loading Engineering Notebook…</span>
    `;
    body.appendChild(loader);

    // Load the PDF into the iframe
    pdfIframe.src = PDF_SRC;

    pdfIframe.addEventListener('load', () => {
      const l = document.getElementById('pdfLoader');
      if (l) {
        l.style.opacity = '0';
        l.style.transition = 'opacity 0.4s';
        setTimeout(() => l.remove(), 400);
      }
      pdfLoaded = true;
    }, { once: true });
  }

  // Open with animation
  pdfModal.classList.add('open');
  pdfBackdrop.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Animate the thumbnail on the section card
  const thumb = document.querySelector('.nb-preview-thumb');
  if (thumb) {
    thumb.style.transform = 'scale(0.97)';
    setTimeout(() => { thumb.style.transform = ''; }, 300);
  }
}

function closePdfViewer() {
  pdfModal.classList.remove('open');
  pdfBackdrop.classList.remove('open');
  document.body.style.overflow = '';
}

// Escape key to close PDF viewer
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && pdfModal.classList.contains('open')) {
    closePdfViewer();
  }
});

// Swipe down to close on mobile
(function initPdfSwipe() {
  let startY = 0;
  pdfModal.addEventListener('touchstart', (e) => {
    startY = e.touches[0].clientY;
  }, { passive: true });
  pdfModal.addEventListener('touchend', (e) => {
    const diff = e.changedTouches[0].clientY - startY;
    if (diff > 80) closePdfViewer(); // swipe down 80px = close
  }, { passive: true });
})();
