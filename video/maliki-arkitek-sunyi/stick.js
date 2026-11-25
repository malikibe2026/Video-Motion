// Stick-figure engine for the blueprint story. Draws from video time alone (seek contract).
// Angles are degrees from straight down; positive swings toward the way the figure faces.
(() => {
  const NS = 'http://www.w3.org/2000/svg';
  const R = Math.PI / 180;
  const LEN = { torso: 78, neck: 10, head: 21, ua: 42, fa: 40, th: 48, sh: 46 };
  const clamp = (x) => Math.min(1, Math.max(0, x));
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeIO = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  const P = {
    stand: { lean: 0, tilt: 0, aB: [-12, -6], aF: [12, 6], lB: [-9, -6], lF: [9, 6] },
    standSad: { lean: 8, tilt: 22, aB: [-4, -2], aF: [4, 2], lB: [-6, -4], lF: [6, 4] },
    proud: { lean: -3, tilt: -8, aB: [-28, -60], aF: [28, 60], lB: [-12, -8], lF: [12, 8] },
    wave: { lean: 0, tilt: -4, aB: [-12, -6], aF: [150, 175], lB: [-9, -6], lF: [9, 6] },
    point: { lean: 4, tilt: 0, aB: [-14, -8], aF: [92, 96], lB: [-10, -6], lF: [12, 6] },
    yell: { lean: 14, tilt: -6, aB: [-50, -110], aF: [108, 120], lB: [-16, -10], lF: [16, 10] },
    cheer: { lean: -2, tilt: -14, aB: [-160, -172], aF: [160, 172], lB: [-12, -8], lF: [12, 8] },
    think: { lean: 2, tilt: 8, aB: [-6, 60], aF: [24, 160], lB: [-8, -5], lF: [8, 5] },
    shrug: { lean: 0, tilt: 10, aB: [-62, -150], aF: [62, 150], lB: [-9, -6], lF: [9, 6] },
    holdOut: { lean: 4, tilt: 0, aB: [-10, -4], aF: [70, 80], lB: [-9, -6], lF: [9, 6] },
    carry: { lean: 6, tilt: 4, aB: [40, 95], aF: [46, 100], lB: [-9, -6], lF: [9, 6] },
    pray: { lean: 0, tilt: 10, aB: [18, 120], aF: [24, 128], lB: [-5, -3], lF: [5, 3] },
    sit: { lean: 2, tilt: 0, aB: [10, 40], aF: [22, 60], lB: [86, 4], lF: [92, 8], hy: 46 },
    sitType: { lean: 10, tilt: 12, aB: [40, 92], aF: [48, 98], lB: [86, 4], lF: [92, 8], hy: 46 },
    sitSlump: { lean: 30, tilt: 38, aB: [8, 4], aF: [14, 6], lB: [86, 6], lF: [92, 10], hy: 46 },
    sitStraight: { lean: -2, tilt: 0, aB: [20, 75], aF: [30, 80], lB: [86, 4], lF: [92, 8], hy: 46 },
    floor: { lean: 22, tilt: 38, aB: [8, 96], aF: [14, 104], lB: [146, 18], lF: [152, 22], hy: 3 },
    sujud: { lean: 100, tilt: 25, aB: [38, 84], aF: [42, 86], lB: [8, -90], lF: [12, -88], hy: 47 },
    kneel: { lean: 0, tilt: 6, aB: [14, 118], aF: [18, 126], lB: [2, -90], lF: [6, -88], hy: 47 },
    tahiyat: { lean: 2, tilt: 10, aB: [10, 70], aF: [16, 78], lB: [2, -90], lF: [6, -88], hy: 47 },
    doa: { lean: 2, tilt: 14, aB: [22, 150], aF: [30, 155], lB: [-9, -6], lF: [9, 6] },
    sitDoa: { lean: 2, tilt: 14, aB: [22, 150], aF: [30, 155], lB: [86, 4], lF: [92, 8], hy: 46 },
    sitTalk: { lean: 6, tilt: -4, aB: [10, 40], aF: [50, 120], lB: [86, 4], lF: [92, 8], hy: 46 },
    ruku: { lean: 86, tilt: -8, aB: [8, 6], aF: [14, 10], lB: [-4, -4], lF: [4, 4] },
    run: { lean: 22, tilt: -4, aB: [-50, 20], aF: [60, 140], lB: [-40, -90], lF: [50, 10] },
  };

  // Walk cycle overlay, phase in turns.
  function walkPose(base, phase, amt = 1, runFast = false) {
    const s = Math.sin(phase * Math.PI * 2);
    const c = Math.cos(phase * Math.PI * 2);
    const k = runFast ? 1.5 : 1;
    const p = { ...base };
    p.lF = [s * 26 * k * amt, s * 26 * k * amt - Math.max(0, -c) * 40 * amt];
    p.lB = [-s * 26 * k * amt, -s * 26 * k * amt - Math.max(0, c) * 40 * amt];
    p.aF = [lerp(base.aF[0], -s * 24 * k, amt), lerp(base.aF[1], -s * 24 * k + 18, amt)];
    p.aB = [lerp(base.aB[0], s * 24 * k, amt), lerp(base.aB[1], s * 24 * k + 18, amt)];
    p.hy = undefined;
    return p;
  }

  const autoHy = (p) => {
    const f = (l) => Math.cos(l[0] * R) * LEN.th + Math.cos(l[1] * R) * LEN.sh;
    return Math.max(f(p.lB), f(p.lF));
  };

  const pose = (p) => (typeof p === 'string' ? P[p] : p);

  function mix(a, b, t) {
    const out = {};
    for (const k of ['lean', 'tilt']) out[k] = lerp(a[k] ?? 0, b[k] ?? 0, t);
    for (const k of ['aB', 'aF', 'lB', 'lF']) out[k] = [lerp(a[k][0], b[k][0], t), lerp(a[k][1], b[k][1], t)];
    if (a.hy === undefined && b.hy === undefined) out.hy = undefined;
    else out.hy = lerp(a.hy ?? autoHy(a), b.hy ?? autoHy(b), t);
    return out;
  }

  // Generic keyframe sampler: keys = [[t, value], ...]; values numbers or arrays of numbers.
  function kf(keys, t, ease = easeIO) {
    if (!keys || !keys.length) return undefined;
    if (t <= keys[0][0]) return keys[0][1];
    for (let i = 0; i < keys.length - 1; i++) {
      const [t0, v0] = keys[i];
      const [t1, v1, e] = keys[i + 1];
      if (t <= t1) {
        const u = (e || ease)(clamp((t - t0) / Math.max(1e-6, t1 - t0)));
        if (Array.isArray(v0)) return v0.map((v, j) => lerp(v, v1[j], u));
        if (typeof v0 === 'number') return lerp(v0, v1, u);
        return u < 0.5 ? v0 : v1;
      }
    }
    return keys[keys.length - 1][1];
  }

  function el(tag, attrs = {}, parent) {
    const n = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
    if (parent) parent.append(n);
    return n;
  }

  const figs = [];

  function add(o) {
    const host = typeof o.parent === 'string' ? document.querySelector(o.parent) : o.parent;
    const g = el('g', { class: 'fig ' + (o.cls || '') }, host);
    g.style.color = o.color || 'var(--fg)';
    const sw = o.sw || 7;
    const mk = (d) => el('path', { d, pathLength: 1, fill: 'none', stroke: 'currentColor', 'stroke-width': sw, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    const glow = o.glow ? el('path', { fill: 'none', stroke: 'currentColor', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: 0.16 }, g) : null;
    const parts = { body: mk(''), aB: mk(''), aF: mk(''), lB: mk(''), lF: mk('') };
    parts.head = el('circle', { r: LEN.head, fill: o.headFill || 'var(--bg)', stroke: 'currentColor', 'stroke-width': sw, pathLength: 1 }, g);
    const face = el('g', {}, g);
    const eye1 = el('circle', { r: 2.8, fill: 'currentColor' }, face);
    const eye2 = el('circle', { r: 2.8, fill: 'currentColor' }, face);
    const mouth = el('path', { fill: 'none', stroke: 'currentColor', 'stroke-width': 3, 'stroke-linecap': 'round' }, face);
    // Optional accessory drawn by the scene: o.extra(g) returns an updater(j, ms).
    const f = { o, g, glow, parts, face, eye1, eye2, mouth, joints: {}, extra: o.extra ? o.extra(g, el) : null };
    figs.push(f);
    return f;
  }

  function drawFig(f, ms) {
    const o = f.o;
    const t = ms / 1000;
    // Pose from keys.
    const keys = o.keys || [[0, 'stand']];
    let p;
    if (t <= keys[0][0]) p = pose(keys[0][1]);
    else {
      p = pose(keys[keys.length - 1][1]);
      for (let i = 0; i < keys.length - 1; i++) {
        const [t0, a] = keys[i];
        const [t1, b, dur] = keys[i + 1];
        if (t < t1) {
          const d = dur ?? Math.min(0.6, t1 - t0);
          const u = easeIO(clamp((t - (t1 - d)) / d));
          p = mix(pose(a), pose(b), u);
          break;
        }
      }
    }
    p = { ...p, aB: [...p.aB], aF: [...p.aF], lB: [...p.lB], lF: [...p.lF] };
    // Walk intervals: [t0, t1, run?]
    for (const w of o.walk || []) {
      const [w0, w1, fast] = w;
      if (t > w0 && t < w1) {
        const ramp = clamp(Math.min(t - w0, w1 - t) / 0.2);
        p = walkPose(p, (t - w0) * (fast ? 2.6 : 1.7), ramp, fast);
      }
    }
    // Typing jitter on forearms.
    for (const [y0, y1] of o.type || []) {
      if (t > y0 && t < y1) {
        p.aF[1] += Math.sin(t * 31) * 9;
        p.aB[1] += Math.sin(t * 27 + 1.3) * 9;
      }
    }
    // Idle breathing so a still figure never freezes.
    const br = o.idle === false ? 0 : Math.sin(t * 2.1 + (o.seed || 0)) * 1.6;
    p.lean += br * 0.6;
    p.tilt += br;
    // Shake (fear / anger)
    let shake = 0;
    for (const [s0, s1, amp] of o.shake || []) if (t > s0 && t < s1) shake += Math.sin(t * 60) * (amp || 3);

    const pos = kf(o.move || [[0, [o.x, o.y]]], t);
    const dir = kf(o.dirKeys || [[0, o.dir ?? 1]], t) >= 0 ? 1 : -1;
    const s = kf(o.scaleKeys || [[0, o.s ?? 1]], t);
    const hy = p.hy ?? autoHy(p);
    const hip = [pos[0] + shake, pos[1] - hy];
    const v = (ang, len, from) => [from[0] + Math.sin(ang * R) * len, from[1] + Math.cos(ang * R) * len];
    const sh = [hip[0] + Math.sin(p.lean * R) * LEN.torso, hip[1] - Math.cos(p.lean * R) * LEN.torso];
    const neckTop = [sh[0] + Math.sin((p.lean + p.tilt * 0.4) * R) * LEN.neck, sh[1] - Math.cos((p.lean + p.tilt * 0.4) * R) * LEN.neck];
    const hd = [neckTop[0] + Math.sin((p.lean + p.tilt) * R) * LEN.head, neckTop[1] - Math.cos((p.lean + p.tilt) * R) * LEN.head];
    const limb = (a, from) => {
      const e = v(a[0], LEN.ua, from);
      return [from, e, v(a[1], LEN.fa, e)];
    };
    const leg = (a) => {
      const k = v(a[0], LEN.th, hip);
      return [hip, k, v(a[1], LEN.sh, k)];
    };
    const J = { hip, sh, hd, aB: limb(p.aB, sh), aF: limb(p.aF, sh), lB: leg(p.lB), lF: leg(p.lF) };
    // Mirror around hip x for direction and scale around the ground point.
    const T = ([x, y]) => [pos[0] + (x - pos[0]) * dir * s, pos[1] + (y - pos[1]) * s];
    const path = (pts) => 'M' + pts.map((q) => T(q).map((n) => n.toFixed(1)).join(' ')).join(' L');
    f.parts.body.setAttribute('d', path([hip, sh, neckTop]));
    f.parts.aB.setAttribute('d', path(J.aB));
    f.parts.aF.setAttribute('d', path(J.aF));
    f.parts.lB.setAttribute('d', path(J.lB));
    f.parts.lF.setAttribute('d', path(J.lF));
    const H = T(hd);
    if (f.glow) {
      f.glow.setAttribute('d', [J.aB, J.aF, J.lB, J.lF, [hip, sh, neckTop]].map(path).join(' ') + ` M${(H[0] - 0.01).toFixed(1)} ${H[1].toFixed(1)} L${H[0].toFixed(1)} ${H[1].toFixed(1)}`);
      f.glow.setAttribute('stroke-width', (22 * s).toFixed(1));
    }
    f.parts.head.setAttribute('cx', H[0].toFixed(1));
    f.parts.head.setAttribute('cy', H[1].toFixed(1));
    f.parts.head.setAttribute('r', (LEN.head * s).toFixed(1));
    for (const k of Object.keys(f.parts)) f.parts[k].setAttribute('stroke-width', ((o.sw || 7) * Math.max(0.6, s)).toFixed(2));
    // Face
    const faceKind = kf(o.faceKeys || [[0, o.face ?? 'neutral']], t);
    const look = (o.lookX ?? 5) * dir * s;
    const tiltDy = Math.min(8, Math.max(-6, p.tilt * 0.12)) * s;
    const ex = H[0] + look, ey = H[1] - 3 * s + tiltDy;
    const blink = ((t + (o.seed || 0)) % 3.7) < 0.12 ? 0.25 : 1;
    f.eye1.setAttribute('cx', (ex - 7 * s).toFixed(1));
    f.eye2.setAttribute('cx', (ex + 7 * s).toFixed(1));
    f.eye1.setAttribute('cy', ey.toFixed(1));
    f.eye2.setAttribute('cy', ey.toFixed(1));
    f.eye1.setAttribute('transform', `translate(0 ${ey * (1 - blink)}) scale(1 ${blink})`);
    f.eye2.setAttribute('transform', `translate(0 ${ey * (1 - blink)}) scale(1 ${blink})`);
    f.eye1.setAttribute('r', 2.8 * s);
    f.eye2.setAttribute('r', 2.8 * s);
    const mx = ex, my = ey + 10 * s, w = 7 * s;
    const curve = { happy: 6, smile: 4, neutral: 0, sad: -5, worried: -3 }[faceKind] ?? 0;
    if (faceKind === 'shout') f.mouth.setAttribute('d', `M${mx - 5 * s} ${my} a ${5 * s} ${6 * s} 0 1 0 ${10 * s} 0 a ${5 * s} ${6 * s} 0 1 0 ${-10 * s} 0`);
    else if (faceKind === 'none') f.mouth.setAttribute('d', '');
    else f.mouth.setAttribute('d', `M${(mx - w).toFixed(1)} ${(my - curve * s * 0.3).toFixed(1)} Q${mx.toFixed(1)} ${(my + curve * s).toFixed(1)} ${(mx + w).toFixed(1)} ${(my - curve * s * 0.3).toFixed(1)}`);
    f.face.style.opacity = faceKind === 'none' || p.lean > 80 ? 0 : 1;
    // Draw-in
    const dIn = o.draw === undefined ? 1 : clamp((t - o.draw) / (o.drawDur || 0.9));
    const dv = easeOut(dIn);
    for (const k of Object.keys(f.parts)) {
      f.parts[k].style.strokeDasharray = `${dv} 2`;
      f.parts[k].style.strokeOpacity = dv > 0 ? 1 : 0;
    }
    f.face.style.opacity = Number(f.face.style.opacity) * clamp((dIn - 0.7) / 0.3);
    f.parts.head.style.fillOpacity = clamp((dIn - 0.5) / 0.5);
    f.g.style.opacity = kf(o.op || [[0, 1]], t);
    if (f.glow) f.glow.style.opacity = 0.16 * dv;
    f.joints = { hip: T(hip), sh: T(sh), head: H, handF: T(J.aF[2]), handB: T(J.aB[2]), footF: T(J.lF[2]), footB: T(J.lB[2]), s, dir };
    if (f.extra) f.extra(f.joints, ms);
  }

  window.Stick = { add, el, kf, P, easeIO, easeOut, clamp, lerp, figs };
  window.__video.on((ms) => { for (const f of figs) drawFig(f, ms); });
})();
