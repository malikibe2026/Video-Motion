// The locked subject: one drawing, reused unchanged in every scene. Only pose parameters move.
// White kopiah, white jubah, wooden folding chair. Amber rim from the left, teal rim from the right.
// Pose is driven from scene time only (seek contract): window.MAN.pose(tracks, offsetSeconds).
(function () {
  const INK = '#1b1712', SKIN = '#b8794c', SKIN_D = '#8f5a36', ROBE = '#f7f2e6';
  const AMB = '#f2a33a', TEAL = '#2fb3a8', WOOD = '#9a6638', WOOD_D = '#6e4524';

  // Hand variants, drawn in forearm-local space: wrist at (0,0), fingers toward +y.
  const finger = (x, len, a = 0) =>
    `<g transform="rotate(${a} ${x} 14)"><rect x="${x - 6}" y="10" width="12" height="${len}" rx="6" fill="${SKIN}" stroke="${INK}" stroke-width="4"/></g>`;
  const palm = `<ellipse cx="0" cy="16" rx="22" ry="20" fill="${SKIN}" stroke="${INK}" stroke-width="4.5"/>`;
  const thumb = `<rect x="-30" y="2" width="12" height="26" rx="6" transform="rotate(28 -24 14)" fill="${SKIN}" stroke="${INK}" stroke-width="4"/>`;
  const knuckles = `<path d="M-14 30 q7 6 14 0 q7 6 14 0" fill="none" stroke="${SKIN_D}" stroke-width="3" stroke-linecap="round"/>`;
  const hands = {
    rest: `${palm}${knuckles}`,
    // Counting: the index (and middle) finger on the thumb side, the rest curled as knuckle bumps, thumb tucked.
    one: `${finger(-13, 48, 6)}${palm}<circle cx="1" cy="36" r="8" fill="${SKIN}" stroke="${INK}" stroke-width="3.5"/><circle cx="13" cy="33" r="7.5" fill="${SKIN}" stroke="${INK}" stroke-width="3.5"/>${thumb}`,
    two: `${finger(-13, 46, 12)}${finger(2, 48, -4)}${palm}<circle cx="15" cy="33" r="7.5" fill="${SKIN}" stroke="${INK}" stroke-width="3.5"/>${thumb}`,
    three: `${finger(-14, 40, 12)}${finger(0, 46)}${finger(14, 42, -12)}${palm}`,
    point: `${finger(-4, 52)}${palm}${thumb}${knuckles}`,
    // Index finger toward the lens: foreshortened to a fingertip disc on the fist.
    lens: `${palm}${thumb}<circle cx="0" cy="22" r="11" fill="${SKIN}" stroke="${INK}" stroke-width="4"/><circle cx="0" cy="22" r="4" fill="${SKIN_D}"/>`,
    open: `${finger(-15, 34, 16)}${finger(-5, 40, 5)}${finger(5, 40, -5)}${finger(15, 34, -16)}${palm}${thumb}`,
  };
  const handGroup = (side) =>
    Object.entries(hands).map(([k, v]) => `<g class="h h-${k}" data-side="${side}" style="display:none">${v}</g>`).join('');

  // A robe sleeve as a thick rounded stroke over an ink stroke.
  const sleeve = (x1, y1, x2, y2, tint) =>
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${INK}" stroke-width="72" stroke-linecap="round"/>` +
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${tint}" stroke-width="62" stroke-linecap="round"/>`;

  const SVG = `
<svg class="man-svg" viewBox="0 0 600 900" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <linearGradient id="robe-g" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stop-color="#f8cf96"/><stop offset="0.28" stop-color="${ROBE}"/>
      <stop offset="0.7" stop-color="${ROBE}"/><stop offset="1" stop-color="#a9ddd6"/>
    </linearGradient>
    <pattern id="ht-teal" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="4.5" cy="4.5" r="2.3" fill="${TEAL}" opacity="0.55"/></pattern>
    <pattern id="ht-amb" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="4.5" cy="4.5" r="2.3" fill="${AMB}" opacity="0.6"/></pattern>
    <pattern id="ht-ink" width="8" height="8" patternUnits="userSpaceOnUse"><circle cx="4" cy="4" r="1.6" fill="${INK}" opacity="0.22"/></pattern>
    <pattern id="knit" width="10" height="8" patternUnits="userSpaceOnUse"><circle cx="5" cy="4" r="1.5" fill="#d9d1bf"/></pattern>
  </defs>

  <!-- Folding chair: back posts, X legs, seat -->
  <g class="chair">
    <rect x="160" y="300" width="22" height="300" rx="6" fill="${WOOD}" stroke="${INK}" stroke-width="5"/>
    <rect x="418" y="300" width="22" height="300" rx="6" fill="${WOOD}" stroke="${INK}" stroke-width="5"/>
    <rect x="150" y="300" width="300" height="44" rx="10" fill="${WOOD}" stroke="${INK}" stroke-width="5"/>
    <line x1="180" y1="600" x2="420" y2="880" stroke="${INK}" stroke-width="28" stroke-linecap="round"/>
    <line x1="420" y1="600" x2="180" y2="880" stroke="${INK}" stroke-width="28" stroke-linecap="round"/>
    <line x1="180" y1="600" x2="420" y2="880" stroke="${WOOD}" stroke-width="18" stroke-linecap="round"/>
    <line x1="420" y1="600" x2="180" y2="880" stroke="${WOOD_D}" stroke-width="18" stroke-linecap="round"/>
    <circle cx="300" cy="740" r="9" fill="${INK}"/>
    <rect x="142" y="572" width="316" height="34" rx="8" fill="${WOOD}" stroke="${INK}" stroke-width="5"/>
  </g>

  <!-- Lower robe over the legs, and sandals -->
  <g class="legs">
    <ellipse cx="232" cy="866" rx="40" ry="14" fill="${SKIN}" stroke="${INK}" stroke-width="4.5"/>
    <ellipse cx="368" cy="866" rx="40" ry="14" fill="${SKIN}" stroke="${INK}" stroke-width="4.5"/>
    <path d="M200 866 h64 M336 866 h64" stroke="#5b3a22" stroke-width="7" stroke-linecap="round"/>
    <path d="M150 596 Q300 626 450 596 L440 852 Q300 866 160 852 Z" fill="url(#robe-g)" stroke="${INK}" stroke-width="5.5" stroke-linejoin="round"/>
    <path d="M400 610 L440 600 L432 850 L396 856 Z" fill="url(#ht-teal)"/>
    <path d="M160 600 L198 610 L204 856 L168 852 Z" fill="url(#ht-amb)"/>
    <path d="M300 640 Q296 750 300 858" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
    <path d="M300 660 Q280 760 290 856" fill="url(#ht-ink)" stroke="none"/>
  </g>

  <g class="torso">
    <path d="M212 292 Q300 272 388 292 Q438 306 442 362 L452 604 Q300 632 148 604 L158 362 Q162 306 212 292 Z"
      fill="url(#robe-g)" stroke="${INK}" stroke-width="5.5" stroke-linejoin="round"/>
    <path d="M404 330 Q436 350 438 400 L446 600 L410 606 Z" fill="url(#ht-teal)"/>
    <path d="M196 330 Q166 350 162 400 L154 600 L190 606 Z" fill="url(#ht-amb)"/>
    <path d="M300 340 L300 470" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
    <circle cx="300" cy="372" r="4" fill="${INK}"/><circle cx="300" cy="404" r="4" fill="${INK}"/>

    <g class="head">
      <rect x="274" y="246" width="52" height="56" rx="10" fill="${SKIN_D}" stroke="${INK}" stroke-width="5"/>
      <path d="M262 290 L300 344 L338 290" fill="${ROBE}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
      <ellipse cx="238" cy="212" rx="13" ry="20" fill="${SKIN}" stroke="${INK}" stroke-width="4.5"/>
      <ellipse cx="362" cy="212" rx="13" ry="20" fill="${SKIN}" stroke="${INK}" stroke-width="4.5"/>
      <ellipse cx="300" cy="206" rx="62" ry="76" fill="${SKIN}" stroke="${INK}" stroke-width="5.5"/>
      <path d="M244 176 Q246 150 258 140 L250 186 Z M356 176 Q354 150 342 140 L350 186 Z" fill="${INK}"/>
      <!-- Beard and moustache -->
      <path d="M240 206 Q240 292 300 300 Q360 292 360 206 Q352 246 334 258 Q300 268 266 258 Q248 246 240 206 Z" fill="#231a14" stroke="${INK}" stroke-width="4"/>
      <!-- Mouth: scaled open by the voice envelope -->
      <g class="mouth"><ellipse cx="300" cy="256" rx="15" ry="9" fill="#6b2219" stroke="#c9775f" stroke-width="3"/></g>
      <path class="smile" d="M281 252 Q300 266 319 252" fill="none" stroke="#c9775f" stroke-width="4" stroke-linecap="round" opacity="0"/>
      <path d="M268 244 Q300 228 332 244 Q300 238 268 244 Z" fill="#231a14" stroke="${INK}" stroke-width="3.5"/>
      <path d="M300 202 Q292 226 298 232 Q306 236 312 230" fill="none" stroke="${SKIN_D}" stroke-width="4.5" stroke-linecap="round"/>
      <path class="cheeks" d="M256 230 q6 6 12 4 M344 230 q-6 6 -12 4" fill="none" stroke="${SKIN_D}" stroke-width="3.5" stroke-linecap="round" opacity="0"/>
      <!-- Eyes, lids, brows -->
      <g class="eyes">
        <ellipse cx="276" cy="200" rx="12" ry="8" fill="#fbf6ea" stroke="${INK}" stroke-width="3"/>
        <ellipse cx="324" cy="200" rx="12" ry="8" fill="#fbf6ea" stroke="${INK}" stroke-width="3"/>
        <circle class="pupil" cx="276" cy="200" r="5.5" fill="${INK}"/>
        <circle class="pupil" cx="324" cy="200" r="5.5" fill="${INK}"/>
      </g>
      <g class="lids">
        <rect class="lid" x="262" y="190" width="28" height="20" fill="${SKIN}"/>
        <rect class="lid" x="310" y="190" width="28" height="20" fill="${SKIN}"/>
        <path class="lidline" d="M264 202 q12 6 24 0 M312 202 q12 6 24 0" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>
      </g>
      <g class="brows">
        <path d="M260 180 Q276 170 290 178" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>
        <path d="M310 178 Q324 170 340 180" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>
      </g>
      <!-- White kopiah -->
      <path d="M236 160 Q238 108 300 104 Q362 108 364 160 Q300 150 236 160 Z" fill="${ROBE}" stroke="${INK}" stroke-width="5.5" stroke-linejoin="round"/>
      <path d="M240 156 Q238 112 300 108 Q362 112 360 156 Q300 147 240 156 Z" fill="url(#knit)"/>
      <path d="M238 158 Q300 148 362 158" fill="none" stroke="${INK}" stroke-width="4"/>
      <path d="M340 116 Q358 130 360 156" fill="none" stroke="${TEAL}" stroke-width="5" opacity="0.7"/>
      <path d="M260 116 Q242 130 240 156" fill="none" stroke="${AMB}" stroke-width="5" opacity="0.8"/>
    </g>

    <!-- Arms: upper sleeve from the shoulder, forearm group from the elbow. Rest: hands on the thighs. -->
    <g class="arm arm-l">
      ${sleeve(205, 326, 176, 466, '#f9dcb2')}
      <g class="fore fore-l">
        ${sleeve(176, 466, 176, 556, '#f9dcb2')}
        <g transform="translate(176 584)">${handGroup('l')}</g>
      </g>
    </g>
    <g class="arm arm-r">
      ${sleeve(395, 326, 424, 466, '#d3ece7')}
      <g class="fore fore-r">
        ${sleeve(424, 466, 424, 556, '#d3ece7')}
        <g class="hand-r" transform="translate(424 584)">${handGroup('r')}</g>
      </g>
    </g>
  </g>
</svg>`;

  const lerp = (a, b, k) => a + (b - a) * k;
  const ease = (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
  // A track is [[t, v, easeName?], ...]. Numbers interpolate; strings step.
  function sample(track, t) {
    if (!track || !track.length) return undefined;
    if (t <= track[0][0]) return track[0][1];
    for (let i = 1; i < track.length; i++) {
      const [t1, v1, e] = track[i];
      const [t0, v0] = track[i - 1];
      if (t <= t1) {
        if (typeof v1 !== 'number') return v0;
        const k = (t - t0) / (t1 - t0 || 1);
        const kk = e === 'lin' ? k : e === 'out' ? 1 - Math.pow(1 - k, 3) : ease(k);
        return lerp(v0, v1, kk);
      }
    }
    return track[track.length - 1][1];
  }

  const DEF = { lean: 0, bodyY: 0, bodySY: 1, headR: 0, headY: 0, headSY: 1, lid: 0, brow: 0, look: 0,
    uL: 0, fL: 0, uR: 0, fR: 0, handL: 'rest', handR: 'rest', handRS: 1, smile: 0 };

  function mount(el) {
    el.innerHTML = SVG;
    const q = (s) => el.querySelector(s);
    return {
      torso: q('.torso'), head: q('.head'), mouth: q('.mouth'), smile: q('.smile'), cheeks: q('.cheeks'),
      lids: [...el.querySelectorAll('.lid')], lidline: q('.lidline'), brows: q('.brows'),
      pupils: [...el.querySelectorAll('.pupil')],
      armL: q('.arm-l'), armR: q('.arm-r'), foreL: q('.fore-l'), foreR: q('.fore-r'), handR: q('.hand-r'),
      hands: [...el.querySelectorAll('.h')],
    };
  }

  function draw(p, P, mouthOpen) {
    p.torso.setAttribute('transform', `translate(0 ${P.bodyY}) rotate(${P.lean} 300 600) translate(300 600) scale(1 ${P.bodySY}) translate(-300 -600)`);
    p.head.setAttribute('transform', `translate(0 ${P.headY}) rotate(${P.headR} 300 296) translate(300 296) scale(1 ${P.headSY}) translate(-300 -296)`);
    const lid = Math.max(0, Math.min(1, P.lid));
    p.lids.forEach((l) => { l.setAttribute('height', String(20 * lid)); l.setAttribute('y', '190'); });
    p.lidline.setAttribute('opacity', lid > 0.6 ? '1' : '0');
    p.pupils.forEach((c, i) => c.setAttribute('cx', String((i ? 324 : 276) + P.look)));
    p.brows.setAttribute('transform', `translate(0 ${P.brow})`);
    const m = 0.18 + 0.95 * (mouthOpen || 0);
    p.mouth.setAttribute('transform', `translate(300 256) scale(${0.85 + 0.25 * (mouthOpen || 0)} ${m}) translate(-300 -256)`);
    p.smile.setAttribute('opacity', String(P.smile * (1 - Math.min(1, (mouthOpen || 0) * 2))));
    p.cheeks.setAttribute('opacity', String(P.smile));
    p.armL.setAttribute('transform', `rotate(${P.uL} 205 326)`);
    p.foreL.setAttribute('transform', `rotate(${P.fL} 176 466)`);
    p.armR.setAttribute('transform', `rotate(${P.uR} 395 326)`);
    p.foreR.setAttribute('transform', `rotate(${P.fR} 424 466)`);
    p.handR.setAttribute('transform', `translate(424 584) scale(${P.handRS})`);
    p.hands.forEach((h) => {
      const want = h.dataset.side === 'l' ? P.handL : P.handR;
      h.style.display = h.classList.contains('h-' + want) ? '' : 'none';
    });
  }

  const rot = (x, y, cx, cy, a) => {
    const r = (a * Math.PI) / 180, c = Math.cos(r), s = Math.sin(r);
    return [cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c];
  };
  // Fingertip position in drawing space, from the same pose the drawing uses.
  function tip(P, side, reach) {
    const L = side === 'l';
    const [sx, sy, ex] = L ? [205, 326, 176] : [395, 326, 424];
    let [x, y] = [ex, 584 + reach];
    [x, y] = rot(x, y, ex, 466, L ? P.fL : P.fR);
    [x, y] = rot(x, y, sx, sy, L ? P.uL : P.uR);
    [x, y] = rot(x, y, 300, 600, P.lean);
    return [x, y + P.bodyY];
  }

  window.MAN = {
    tip,
    // tracks: { param: [[t, v], ...] } in scene seconds. offset: this scene's start in video seconds (for the voice).
    // opts.trail: { side, from, to, color, width, reach } draws the fingertip's path in the air, as a brush stroke.
    pose(el, tracks, offset, opts = {}) {
      const parts = mount(el);
      const svg = el.querySelector('svg');
      let trail = null;
      if (opts.trail) {
        trail = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        trail.setAttribute('fill', 'none');
        trail.setAttribute('stroke', opts.trail.color || '#1d2c55');
        trail.setAttribute('stroke-width', String(opts.trail.width || 12));
        trail.setAttribute('stroke-linecap', 'round');
        trail.setAttribute('stroke-linejoin', 'round');
        if (opts.trail.dash) trail.setAttribute('stroke-dasharray', opts.trail.dash);
        svg.appendChild(trail);
      }
      const poseAt = (t) => {
        const P = { ...DEF };
        for (const k in tracks) { const v = sample(tracks[k], t); if (v !== undefined) P[k] = v; }
        return P;
      };
      const fps = 30;
      const at = (t) => {
        const P = poseAt(t);
        if (trail) {
          const T = opts.trail, end = Math.min(t, T.to);
          let d = '';
          if (end > T.from) {
            const lead = T.fade ? Math.max(T.from, end - T.fade) : T.from;
            for (let u = lead; u <= end + 1e-6; u += 1 / 60) {
              const [x, y] = tip(poseAt(u), T.side, T.reach || 40);
              d += (d ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1);
            }
          }
          trail.setAttribute('d', d || 'M0 0');
          trail.setAttribute('opacity', d ? '1' : '0');
        }
        const f = Math.round((offset + t) * fps);
        const env = window.MOUTH || [];
        const mo = env[f] || 0;
        draw(parts, P, mo);
      };
      at(0);
      window.__video.on((ms) => at(ms / 1000));
    },
  };
})();
