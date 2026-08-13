/**
 * Founder+ Survey Embed — widget survey drop-in untuk situs mana pun.
 * Deployed to: https://cdn.founderplus.id/survey.js
 *
 * Pakai (inline embed):
 *   <div data-fp-survey="kualifikasi"></div>
 *   <script src="https://cdn.founderplus.id/survey.js" defer></script>
 *
 * Opsi elemen:
 *   data-fp-survey="<slug>"     wajib — slug survey (dari /lms)
 *   data-fp-accent="#7A3DBE"    opsional — warna aksen tenant (white-label)
 *
 * Vanilla JS, nol dependensi, CSP-aman (semua style di-inject sendiri, ber-
 * namespace .fpq-). Menampilkan satu pertanyaan per layar (best-practice
 * completion), menangkap email sebagai lead, lalu submit ke survey engine.
 * Gabungan survey + newsletter: identity (email) jadi lead; thank-you menawarkan
 * lanjut jadi user Founder+.
 */
(function (window, document) {
  'use strict';

  var API_BASE = 'https://academy.founderplus.id/api/dev';
  var ACADEMY = 'https://academy.founderplus.id';
  var STYLE_ID = 'fpq-styles';

  var CSS =
    '.fpq{--fpq-accent:#7A3DBE;--fpq-ink:#231838;--fpq-muted:#57515f;--fpq-line:#ece7f1;' +
    'max-width:560px;margin:0 auto;background:#fff;border:1px solid var(--fpq-line);border-radius:20px;' +
    'padding:28px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;' +
    'color:var(--fpq-ink);box-shadow:0 1px 2px rgba(35,24,56,.04),0 12px 32px rgba(35,24,56,.06);box-sizing:border-box}' +
    '.fpq *{box-sizing:border-box}' +
    '.fpq-prog{height:4px;background:var(--fpq-line);border-radius:999px;overflow:hidden;margin-bottom:22px}' +
    '.fpq-prog>span{display:block;height:100%;background:var(--fpq-accent);border-radius:999px;transition:width .25s ease}' +
    '.fpq-q{font-size:20px;font-weight:700;line-height:1.3;margin:0 0 6px}' +
    '.fpq-help{font-size:13.5px;color:var(--fpq-muted);margin:0 0 18px}' +
    '.fpq-input{width:100%;background:#f7f6f8;border:none;border-radius:12px;padding:12px 14px;font-size:15px;' +
    'color:var(--fpq-ink);outline:none}.fpq-input:focus{box-shadow:0 0 0 2px color-mix(in srgb,var(--fpq-accent) 40%,#fff)}' +
    'textarea.fpq-input{min-height:96px;resize:vertical}' +
    '.fpq-opts{display:flex;flex-direction:column;gap:10px}' +
    '.fpq-opt{display:flex;align-items:center;gap:10px;width:100%;text-align:left;background:#f7f6f8;border:1.5px solid transparent;' +
    'border-radius:12px;padding:12px 14px;font-size:15px;color:var(--fpq-ink);cursor:pointer;transition:border-color .15s,background .15s}' +
    '.fpq-opt:hover{border-color:color-mix(in srgb,var(--fpq-accent) 35%,#fff)}' +
    '.fpq-opt[aria-checked="true"]{border-color:var(--fpq-accent);background:color-mix(in srgb,var(--fpq-accent) 8%,#fff)}' +
    '.fpq-opt .dot{width:18px;height:18px;border-radius:50%;border:2px solid #cfc9d6;flex:none}' +
    '.fpq-opt[aria-checked="true"] .dot{border-color:var(--fpq-accent);background:var(--fpq-accent);box-shadow:inset 0 0 0 3px #fff}' +
    '.fpq-scale{display:flex;flex-wrap:wrap;gap:8px}' +
    '.fpq-scale button{flex:1;min-width:44px;background:#f7f6f8;border:1.5px solid transparent;border-radius:12px;padding:12px 0;' +
    'font-size:15px;font-weight:600;color:var(--fpq-ink);cursor:pointer}' +
    '.fpq-scale button[aria-pressed="true"]{border-color:var(--fpq-accent);background:color-mix(in srgb,var(--fpq-accent) 10%,#fff);color:var(--fpq-accent)}' +
    '.fpq-scalelabels{display:flex;justify-content:space-between;font-size:12px;color:var(--fpq-muted);margin-top:6px}' +
    '.fpq-err{color:#c0362c;font-size:13px;margin-top:8px}' +
    '.fpq-nav{display:flex;align-items:center;justify-content:space-between;margin-top:22px}' +
    '.fpq-back{background:none;border:none;font-size:14px;font-weight:500;color:var(--fpq-muted);cursor:pointer;padding:8px 4px}' +
    '.fpq-back[hidden]{visibility:hidden}' +
    '.fpq-next{background:var(--fpq-accent);color:#fff;border:none;border-radius:12px;padding:10px 22px;font-size:15px;font-weight:600;cursor:pointer}' +
    '.fpq-next:disabled{opacity:.5;cursor:default}' +
    '.fpq-done{text-align:center;padding:8px 0}' +
    '.fpq-done h3{font-size:22px;font-weight:800;margin:0 0 8px}' +
    '.fpq-done p{font-size:15px;color:var(--fpq-muted);margin:0 0 20px}' +
    '.fpq-voucher{display:inline-flex;align-items:center;gap:10px;background:color-mix(in srgb,var(--fpq-accent) 8%,#fff);' +
    'border-radius:14px;padding:12px 16px;margin-bottom:20px}' +
    '.fpq-voucher code{font-family:ui-monospace,Menlo,monospace;font-weight:700;letter-spacing:.06em;color:var(--fpq-accent)}' +
    '.fpq-cta{display:inline-block;background:var(--fpq-accent);color:#fff;text-decoration:none;border-radius:12px;padding:11px 24px;font-size:15px;font-weight:600}' +
    '.fpq-powered{margin-top:18px;text-align:center;font-size:11.5px;color:#a9a4b2}' +
    '.fpq-powered a{color:inherit}';

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  }

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  // Widget publik untuk situs eksternal → tanpa credentials (wajib agar CORS
  // wildcard '*' berlaku; submit auth-optional, jalan sebagai tamu).
  function getJSON(url) {
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    });
  }

  function postJSON(url, body) {
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then(function (r) {
      return r.json().then(function (j) { return { ok: r.ok, status: r.status, body: j }; });
    });
  }

  // ── Widget ────────────────────────────────────────────────────────────────
  function SurveyWidget(mount, slug, accent) {
    var root = el('div', 'fpq');
    if (accent) root.style.setProperty('--fpq-accent', accent);
    mount.appendChild(root);

    var survey = null;
    var questions = [];
    var idx = 0;
    var values = {}; // uuid -> value

    // Mode preload: host bisa menyediakan data survey inline (window.FP_SURVEY_
    // PRELOAD[slug]) untuk hindari fetch (SSR/perf, atau data tenant sendiri).
    var preload = window.FP_SURVEY_PRELOAD && window.FP_SURVEY_PRELOAD[slug];
    (preload ? Promise.resolve({ data: preload }) : getJSON(API_BASE + '/survey/' + encodeURIComponent(slug)))
      .then(function (j) {
        survey = j.data;
        questions = [];
        (survey.sections || []).forEach(function (sec) {
          (sec.questions || []).forEach(function (q) { questions.push(q); });
        });
        if (questions.length === 0) throw new Error('kosong');
        render();
      })
      .catch(function () {
        root.innerHTML = '';
        root.appendChild(el('p', 'fpq-help', 'Survei tidak tersedia saat ini.'));
      });

    function isEmail(q) { return q.config && q.config.input_format === 'email'; }
    function isName(q) { return q.config && q.config.input_format === 'name'; }

    function valid(q) {
      var v = values[q.uuid];
      if (!q.required) return true;
      if (q.type === 'multi_choice') return Array.isArray(v) && v.length > 0;
      if (q.type === 'scale') return typeof v === 'number';
      if (isEmail(q)) return typeof v === 'string' && /.+@.+\..+/.test(v.trim());
      return typeof v === 'string' ? v.trim() !== '' : v != null;
    }

    function setVal(uuid, v) { values[uuid] = v; }

    function render() {
      var q = questions[idx];
      root.innerHTML = '';

      // progress
      var prog = el('div', 'fpq-prog');
      var bar = el('span');
      bar.style.width = Math.round(((idx) / questions.length) * 100) + '%';
      prog.appendChild(bar);
      root.appendChild(prog);

      root.appendChild(el('h2', 'fpq-q', q.text));
      if (q.help_text) root.appendChild(el('p', 'fpq-help', q.help_text));

      var err = el('div', 'fpq-err');
      err.style.display = 'none';

      renderField(q, err);
      root.appendChild(err);

      // nav
      var nav = el('div', 'fpq-nav');
      var back = el('button', 'fpq-back', 'Kembali');
      back.type = 'button';
      if (idx === 0) back.hidden = true;
      back.onclick = function () { idx = Math.max(0, idx - 1); render(); };
      var next = el('button', 'fpq-next', idx === questions.length - 1 ? 'Kirim' : 'Lanjut');
      next.type = 'button';
      next.onclick = function () {
        if (!valid(q)) { err.textContent = 'Wajib diisi dulu ya.'; err.style.display = 'block'; return; }
        advance();
      };
      nav.appendChild(back);
      nav.appendChild(next);
      root.appendChild(nav);

      var pw = el('div', 'fpq-powered');
      pw.innerHTML = 'Ditenagai <a href="' + ACADEMY + '" target="_blank" rel="noopener">Founder+</a>';
      root.appendChild(pw);
    }

    function renderField(q, err) {
      var v = values[q.uuid];

      if (q.type === 'short_text' || q.type === 'long_text') {
        var input = el(q.type === 'long_text' ? 'textarea' : 'input', 'fpq-input');
        if (q.type !== 'long_text') input.type = isEmail(q) ? 'email' : 'text';
        input.value = v || '';
        input.placeholder = isEmail(q) ? 'nama@email.com' : (isName(q) ? 'Nama kamu' : '');
        input.oninput = function () { setVal(q.uuid, input.value); err.style.display = 'none'; };
        root.appendChild(input);
        setTimeout(function () { input.focus(); }, 30);
        return;
      }

      if (q.type === 'single_choice') {
        var wrap = el('div', 'fpq-opts');
        (q.options || []).forEach(function (opt) {
          var b = el('button', 'fpq-opt');
          b.type = 'button';
          b.setAttribute('aria-checked', String(v === opt.value));
          b.appendChild(el('span', 'dot'));
          b.appendChild(el('span', null, opt.label));
          b.onclick = function () { setVal(q.uuid, opt.value); advance(); };
          wrap.appendChild(b);
        });
        root.appendChild(wrap);
        return;
      }

      if (q.type === 'multi_choice') {
        var arr = Array.isArray(v) ? v.slice() : [];
        var mwrap = el('div', 'fpq-opts');
        (q.options || []).forEach(function (opt) {
          var b = el('button', 'fpq-opt');
          b.type = 'button';
          b.setAttribute('aria-checked', String(arr.indexOf(opt.value) > -1));
          b.appendChild(el('span', 'dot'));
          b.appendChild(el('span', null, opt.label));
          b.onclick = function () {
            var i = arr.indexOf(opt.value);
            if (i > -1) arr.splice(i, 1); else arr.push(opt.value);
            setVal(q.uuid, arr.slice());
            b.setAttribute('aria-checked', String(arr.indexOf(opt.value) > -1));
            err.style.display = 'none';
          };
          mwrap.appendChild(b);
        });
        root.appendChild(mwrap);
        return;
      }

      if (q.type === 'scale') {
        var cfg = q.config || {};
        var min = cfg.scale_min != null ? cfg.scale_min : 1;
        var max = cfg.scale_max != null ? cfg.scale_max : 5;
        var sc = el('div', 'fpq-scale');
        for (var n = min; n <= max; n++) {
          (function (num) {
            var b = el('button', null, String(num));
            b.type = 'button';
            b.setAttribute('aria-pressed', String(v === num));
            b.onclick = function () { setVal(q.uuid, num); advance(); };
            sc.appendChild(b);
          })(n);
        }
        root.appendChild(sc);
        if (cfg.labels) {
          var lbl = el('div', 'fpq-scalelabels');
          lbl.appendChild(el('span', null, cfg.labels[String(min)] || ''));
          lbl.appendChild(el('span', null, cfg.labels[String(max)] || ''));
          root.appendChild(lbl);
        }
        return;
      }
    }

    function advance() {
      var q = questions[idx];
      if (!valid(q)) return;
      if (idx < questions.length - 1) { idx++; render(); return; }
      submit();
    }

    function buildAnswers() {
      var answers = [];
      questions.forEach(function (q) {
        var v = values[q.uuid];
        if (v == null || v === '' || (Array.isArray(v) && v.length === 0)) return;
        if (typeof v === 'string') v = v.trim();
        answers.push({ question: q.uuid, value: v });
      });
      return answers;
    }

    function deriveRespondent() {
      var out = {};
      questions.forEach(function (q) {
        var v = values[q.uuid];
        if (typeof v !== 'string' || !v.trim()) return;
        if (isEmail(q)) out.respondent_email = v.trim();
        else if (isName(q)) out.respondent_name = v.trim();
      });
      return out;
    }

    function submit() {
      root.innerHTML = '';
      root.appendChild(el('p', 'fpq-help', 'Mengirim…'));

      var body = { answers: buildAnswers(), meta: { source: 'cdn_embed', href: window.location.href } };
      var resp = deriveRespondent();
      if (resp.respondent_email) body.respondent_email = resp.respondent_email;
      if (resp.respondent_name) body.respondent_name = resp.respondent_name;

      postJSON(API_BASE + '/survey/' + encodeURIComponent(slug) + '/submit', body)
        .then(function (res) {
          if (!res.ok) throw new Error('submit');
          done(res.body && res.body.message);
        })
        .catch(function () {
          root.innerHTML = '';
          root.appendChild(el('p', 'fpq-err', 'Gagal mengirim. Coba lagi ya.'));
        });
    }

    function done(message) {
      root.innerHTML = '';
      var d = el('div', 'fpq-done');
      d.appendChild(el('h3', null, 'Terima kasih!'));
      d.appendChild(el('p', null, message || 'Jawabanmu sudah kami terima.'));

      var reward = survey.settings && survey.settings.reward;
      if (reward && reward.voucher_code) {
        var vc = el('div', 'fpq-voucher');
        vc.appendChild(el('span', null, 'Kode:'));
        vc.appendChild(el('code', null, reward.voucher_code));
        d.appendChild(vc);
      }

      // Gabungan survey + newsletter: ajak jadi user Founder+.
      var cta = el('a', 'fpq-cta', (reward && reward.cta_label) || 'Coba Founder+');
      cta.href = ACADEMY + ((reward && reward.cta_path) || '/');
      cta.target = '_blank';
      cta.rel = 'noopener';
      d.appendChild(cta);

      root.appendChild(d);
    }
  }

  function init() {
    injectStyles();
    var mounts = document.querySelectorAll('[data-fp-survey]');
    for (var i = 0; i < mounts.length; i++) {
      var m = mounts[i];
      var slug = m.getAttribute('data-fp-survey');
      if (slug && !m.__fpqInit) {
        m.__fpqInit = true;
        try {
          new SurveyWidget(m, slug, m.getAttribute('data-fp-accent'));
        } catch (e) {
          /* jangan pernah menjatuhkan halaman host */
        }
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(window, document);
