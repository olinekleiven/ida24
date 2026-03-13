/* ============================================================
   BURSDAGSSIDE — script.js
   ============================================================ */

/* ── YouTube-musikk ─────────────────────────────────────── */
const YOUTUBE_VIDEO_ID = 'SDCTGthx6xs'; // Olga Marie Mikalsen — Hurra for deg

let ytSpiller  = null;
let musikKlar  = false;
let skalSpille = false;

// Laster YouTube IFrame API asynkront
const ytScript = document.createElement('script');
ytScript.src   = 'https://www.youtube.com/iframe_api';
document.head.appendChild(ytScript);

window.onYouTubeIframeAPIReady = function () {
  ytSpiller = new YT.Player('yt-player', {
    videoId: YOUTUBE_VIDEO_ID,
    playerVars: { autoplay: 0, controls: 0, loop: 1, playlist: YOUTUBE_VIDEO_ID, rel: 0 },
    events: {
      onReady: () => {
        musikKlar = true;
        ytSpiller.setVolume(65);
        if (skalSpille) ytSpiller.playVideo();
      },
    },
  });
};

function startMusikk() {
  if (musikKlar && ytSpiller) {
    ytSpiller.playVideo();
  } else {
    skalSpille = true; // Spill så snart spilleren er klar
  }
}

// Start musikk når brukeren klikker "Klikk her" på hero
document.getElementById('heroKnapp').addEventListener('click', () => {
  startMusikk();
});

/* ── Hero-partikler ─────────────────────────────────────── */
(function spawnPartikler() {
  const wrap   = document.getElementById('heroPartikler');
  const farger = [
    'var(--rosa)', 'var(--gull-l)',
    'var(--fersken)', 'rgba(242,167,184,.6)',
  ];
  for (let i = 0; i < 26; i++) {
    const p = document.createElement('div');
    p.className = 'h-partikkel';
    p.style.cssText = `
      --s:${(Math.random() * 5 + 3).toFixed(0)}px;
      --c:${farger[Math.floor(Math.random() * farger.length)]};
      --dur:${(Math.random() * 10 + 8).toFixed(1)}s;
      --delay:${(Math.random() * 10).toFixed(1)}s;
      --tx:${((Math.random() - .5) * 80).toFixed(0)}px;
      --ty:-${(Math.random() * 100 + 40).toFixed(0)}px;
      left:${(Math.random() * 100).toFixed(1)}%;
      top:${(Math.random() * 100).toFixed(1)}%;
    `;
    wrap.appendChild(p);
  }
})();

/* ── Konfetti ────────────────────────────────────────────── */
const Konfetti = (() => {
  const canvas = document.getElementById('confetti-canvas');
  const ctx    = canvas.getContext('2d');
  const FARGER = [
    '#F2A7B8', '#FBBF9A', '#EDD898', '#E0788F',
    '#FAD4DF', '#FDE4CF', '#C9973C', '#FFFFFF',
  ];
  let biter = [];
  let raf   = null;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function r(a, b) { return a + Math.random() * (b - a); }

  function nyBit(x, y) {
    const vinkel = Math.random() * Math.PI * 2;
    const fart   = r(4, 13);
    return {
      x, y,
      vx: Math.cos(vinkel) * fart,
      vy: Math.sin(vinkel) * fart - 5,
      w: r(5, 14), h: r(3, 7),
      farge: FARGER[Math.floor(Math.random() * FARGER.length)],
      vinkel: r(0, Math.PI * 2), spin: r(-.12, .12),
      liv: 1, nedgang: r(.012, .022),
    };
  }

  function tegn() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    biter = biter.filter(b => {
      if (b.liv <= 0) return false;
      ctx.save();
      ctx.translate(b.x, b.y); ctx.rotate(b.vinkel);
      ctx.globalAlpha = Math.max(0, b.liv);
      ctx.fillStyle   = b.farge;
      ctx.fillRect(-b.w / 2, -b.h / 2, b.w, b.h);
      ctx.restore();
      b.x += b.vx; b.y += b.vy; b.vy += .28;
      b.vinkel += b.spin; b.liv -= b.nedgang;
      return true;
    });
    if (biter.length > 0) raf = requestAnimationFrame(tegn);
    else { raf = null; ctx.clearRect(0, 0, canvas.width, canvas.height); }
  }

  return {
    burst(x, y, antall = 90) {
      canvas.style.display    = 'block';
      canvas.style.opacity    = '1';
      canvas.style.transition = 'none';
      for (let i = 0; i < antall; i++) biter.push(nyBit(x, y));
      if (!raf) tegn();
    },
  };
})();

/* ── Ballonger ────────────────────────────────────────────── */
function slippBallonger(rect, antall = 12) {
  const lag    = document.getElementById('balloon-layer');
  const farger = [
    '#F2A7B8', '#FBBF9A', '#EDD898', '#D9607A',
    '#A8D8EA', '#FAD4DF', '#AA96DA', '#C9F7D0',
  ];
  const cx = rect.left + rect.width  / 2;
  const cy = rect.top  + rect.height / 2 + window.scrollY;

  for (let i = 0; i < antall; i++) {
    const b = document.createElement('div');
    b.className = 'balloon';
    const farge = farger[i % farger.length];
    b.style.cssText = `
      left:${cx - 28}px; top:${cy - 35}px;
      --bc:${farge};
      --bx:${((Math.random() - .5) * 420).toFixed(0)}px;
      --by:-${(Math.random() * window.innerHeight * 1.4 + 200).toFixed(0)}px;
      --bdur:${(Math.random() * 2.5 + 3.5).toFixed(1)}s;
      --bdelay:${(Math.random() * .8).toFixed(2)}s;
      --brot:${((Math.random() - .5) * 30).toFixed(0)}deg;
    `;
    const snor = document.createElement('div');
    snor.className = 'balloon-string';
    b.appendChild(snor);
    lag.appendChild(b);
    b.addEventListener('animationend', () => b.remove());
  }
}

/* ── Gave-boks interaksjon ───────────────────────────────── */
(function initGave() {
  const gave      = document.getElementById('giftBox');
  const cta       = document.getElementById('gaveCta');
  const overlay   = document.getElementById('brevOverlay');
  const brevKnapp = document.getElementById('brevKnapp');
  let aapnet = false;

  /* STEG 1 — Klikk på gaven: åpne lokket */
  function aapneGave() {
    if (aapnet) return;
    aapnet = true;

    gave.classList.add('aapnet');
    cta.classList.add('skjult');

    // Konfetti og ballonger fra gave-senteret
    const rect = gave.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;

    slippBallonger(rect, 12);
    Konfetti.burst(cx, cy, 90);
    setTimeout(() => Konfetti.burst(cx, cy, 55), 600);

    // Brevet dukker opp etter at lokket har flydd av
    setTimeout(visBrev, 950);
  }

  /* STEG 2 — Vis brev-overlay */
  function visBrev() {
    overlay.removeAttribute('aria-hidden');
    overlay.classList.add('synlig');
    document.body.style.overflow = 'hidden'; // Lås scroll mens brev leses
  }

  /* STEG 3 — Klikk "Se minner": lukk brev, åpne galleri */
  brevKnapp.addEventListener('click', () => {
    document.body.style.overflow = '';
    overlay.classList.remove('synlig');

    // Etter fade-ut: vis galleriet
    setTimeout(() => {
      overlay.style.display = 'none';
      visMinner();
    }, 460);
  });

  gave.addEventListener('click', aapneGave);
  gave.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); aapneGave(); }
  });
})();

/* ── Vis minner (polaroid-galleri) ──────────────────────── */
function visMinner() {
  const seksjon  = document.getElementById('minner');
  const slideshowSeksjon = document.getElementById('slideshow');
  const header   = seksjon?.querySelector('.minner-header');
  const avsl     = seksjon?.querySelector('.minner-avslutning');
  const footer   = document.getElementById('footer');
  const polaroids = seksjon ? Array.from(seksjon.querySelectorAll('.polaroid')) : [];

  // Gjør seksjonene synlige i DOM
  if (seksjon) {
    seksjon.style.display = 'block';
    seksjon.removeAttribute('aria-hidden');
  }
  if (slideshowSeksjon) {
    slideshowSeksjon.style.display = 'block';
    slideshowSeksjon.removeAttribute('aria-hidden');
  }
  if (footer) footer.style.display = 'block';

  startGalleriMusikk();

  const scrollTarget = seksjon || slideshowSeksjon;
  if (!scrollTarget) return;

  // Scroll til minner-seksjonen (smooth) med litt ekstra offset
  setTimeout(() => {
    const topp = window.scrollY + scrollTarget.getBoundingClientRect().top + 32;
    window.scrollTo({ top: topp, behavior: 'smooth' });
  }, 60);

  // Animer inn header
  if (header) setTimeout(() => header.classList.add('synlig'), 200);
  if (slideshowSeksjon) setTimeout(() => slideshowSeksjon.classList.add('synlig'), 380);

  // Stagger-animer inn hvert polaroid-kort
  polaroids.forEach((p, i) => {
    setTimeout(() => {
      p.classList.add('synlig');
    }, 400 + i * 110);
  });

  // Avslutnings-melding etter alle polaroids
  if (!avsl) return;

  const avslForsinkelse = 400 + polaroids.length * 110 + 300;
  setTimeout(() => {
    // Bruk IntersectionObserver slik at avslutningen kun trigges når synlig
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          avsl.classList.add('synlig');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.2 });
    obs.observe(avsl);
  }, avslForsinkelse);
}

/* ── Rullende bildeserie ────────────────────────────────── */
(function initRullendeSerie() {
  const wrap = document.getElementById('autoSlideshow');
  if (!wrap) return;

  const bildefiler = [
    '15C2C67D-C386-41B8-A3D1-3145843BD6F5.JPG',
    'bilde.jpg',
    'CB3A4625-022F-462C-BEB0-8D64A1FB99F3.JPG',
    'festival.JPG',
    'IDA.JPG',
    'IMG_0141.JPG',
    'IMG_0145.JPG',
    'IMG_0692.JPG',
    'IMG_1265.JPG',
    'IMG_1715.jpg',
    'IMG_3159.jpg',
    'IMG_4033.jpg',
    'IMG_4050.jpg',
    'IMG_4101.PNG',
    'IMG_4108.JPG',
    'IMG_4474.JPG',
    'IMG_6363.jpg',
    'IMG_6384.jpg',
    'IMG_6385.jpg',
    'IMG_6387.jpg',
    'IMG_6389.jpg',
    'IMG_6390.jpg',
    'IMG_6392.jpg',
    'IMG_6393.jpg',
    'IMG_6394.jpg',
    'IMG_6395.jpg',
    'IMG_6397.jpg',
    'IMG_6398.jpg',
    'IMG_6399.jpg',
    'IMG_6400.jpg',
    'IMG_6401.jpg',
    'IMG_6402.jpg',
    'IMG_6403.jpg',
    'IMG_7628.jpg',
    'IMG_8047.jpg',
    'IMG_8177.jpg',
    'IMG_8242.JPG',
    'IMG_8416.jpg',
    'IMG_8441.jpg',
    'IMG_8445.JPG',
    'IMG_8473.JPG',
    'IMG_8477.jpg',
    'IMG_9077.JPG',
    'MIDDAG.JPG',
    'kos.jpg',
    'kosi.jpg',
  ];

  const track = document.createElement('div');
  track.className = 'rull-track';

  const seriebilder = bildefiler.concat(bildefiler);
  seriebilder.forEach((filnavn, index) => {
    const figure = document.createElement('figure');
    figure.className = 'rull-kort';

    const bilde = document.createElement('img');
    bilde.src = `bilder/${filnavn}`;
    bilde.alt = `Minnebilde`;
    bilde.loading = 'eager';
    bilde.style.width = '100%';
    bilde.style.height = '100%';
    bilde.style.objectFit = 'cover';

    // Fjern figuren hvis bildet ikke lastes
    bilde.addEventListener('error', () => {
      figure.remove();
    });

    figure.appendChild(bilde);
    track.appendChild(figure);
  });

  wrap.innerHTML = '';
  wrap.appendChild(track);
})();

/* ── Lokal galleri-musikk ──────────────────────────────── */
const galleriAudio = document.getElementById('galleriAudio');

function startGalleriMusikk() {
  if (!galleriAudio) return;

  if (ytSpiller && musikKlar) {
    const tilstand = ytSpiller.getPlayerState();
    if (tilstand === YT.PlayerState.PLAYING) {
      ytSpiller.pauseVideo();
    }
  }

  const spillForsok = galleriAudio.play();
  if (spillForsok && typeof spillForsok.then === 'function') {
    spillForsok.catch(() => {});
  }
}

if (galleriAudio) {
  galleriAudio.volume = 0.85;

  const forsokAutoStart = () => {
    startGalleriMusikk();
    window.removeEventListener('pointerdown', forsokAutoStart);
  };
  window.addEventListener('pointerdown', forsokAutoStart, { once: true });
}
