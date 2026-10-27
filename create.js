(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const { OCCASIONS, TEMPLATES, renderSite } = PS;

  const SAMPLE = {
    to: "Riya", from: "Ankit", title: "Happy Birthday!", eyebrow: "A little something for",
    message: "Every day with you feels like a celebration.\n\nThank you for being you.",
    surprise: "Dinner is on me tonight! 🍰", date: "", dateLabel: "", accent: "",
  };
  const OCCASION_TEMPLATE_IDS = {
    love: ["love-letter", "midnight-stars", "velvet-rose", "sunset-love"],
    birthday: ["party-pop", "birthday-cinema", "confetti-cake", "polaroid-pals"],
    friendship: ["polaroid-pals", "bestie-scrapbook"],
    anniversary: ["love-letter", "midnight-stars", "anniversary-timeline", "golden-hour"],
    apology: ["love-letter", "midnight-stars", "gentle-bloom", "soft-words"],
    custom: ["midnight-stars", "party-pop", "polaroid-pals", "custom-minimal"],
  };
  const templatesForOccasion = (id) => (OCCASION_TEMPLATE_IDS[id] || TEMPLATES.map((t) => t.id))
    .map((tid) => TEMPLATES.find((t) => t.id === tid)).filter(Boolean);

  let state = { step: 1, occasion: "", templateId: "", photos: [], editId: null, data: {} };

  // restore draft / edit mode / ?template=
  const qs = new URLSearchParams(location.search);
  try {
    const draft = JSON.parse(sessionStorage.getItem("ps_draft") || "null");
    if (draft) state = { ...state, ...draft, step: Math.min(draft.step || 1, 3) };
  } catch {}
 
if (qs.get("edit")) {
  const editId = qs.get("edit");

  (async () => {
    try {
      const row = await window.SurpriseRepository.getMyDraft(editId);

      if (!row) {
        alert("Draft nahi mila. Ho sakta hai draft delete ho gaya ho.");
        return;
      }

      const s = {
        ...row.content,
        id: row.id,
        title: row.title,
        occasion: row.occasion,
        status: row.status
      };

      state = {
        ...state,
        step: 3,
        occasion: s.occasion,
        templateId: s.templateId,
        photos: s.photos || [],
        editId: s.id,
        data: s
      };

      go(3);
    } catch (error) {
      console.error("Draft load failed:", error);
      alert("Draft load nahi hua: " + error.message);
    }
  })();
}

  const persist = () => sessionStorage.setItem("ps_draft", JSON.stringify(state));


  function go(n) {
    state.step = n;
    $$(".panel").forEach((p) => p.classList.toggle("show", +p.dataset.step === n));
    $$("#progress div").forEach((d, i) => d.classList.toggle("on", i < n));
    if (n === 2) renderTemplates();
    if (n === 3) { fillForm(); updatePreview(); }
    persist();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  $$("[data-go]").forEach((b) => (b.onclick = () => go(+b.dataset.go)));

  /* ---------- step 1 ---------- */
  const occGrid = $("#occGrid");
  OCCASIONS.forEach((o) => {
    const c = document.createElement("div");
    c.className = "card choice" + (state.occasion === o.id ? " sel" : "");
    const count = templatesForOccasion(o.id).length;
    c.innerHTML = `<div class="ic">${o.emoji}</div><h3>${o.label}</h3><p>${count} designs to explore</p><span class="tag" style="margin-top:14px">Explore styles ↗</span>`;
    c.onclick = () => { state.occasion = o.id; go(2); };
    occGrid.appendChild(c);
  });

  /* ---------- step 2 ---------- */
  function renderTemplates() {
    const g = $("#tplGrid");
    g.innerHTML = "";
    const list = state.occasion ? templatesForOccasion(state.occasion) : TEMPLATES;
    (list.length ? list : TEMPLATES).forEach((t) => {
      const c = document.createElement("div");
      c.className = "card choice" + (state.templateId === t.id ? " sel" : "");
      c.innerHTML = `<div class="swatch" style="background:${t.preview}"><span class="preview-icon">${t.emoji}</span><span class="preview-label">${t.occasion.length > 1 ? "Versatile" : "Made for this moment"}</span></div><div class="template-meta"><h3>${t.name}</h3><span class="tag">Design</span></div><p>${t.desc}</p>
        <div style="margin-top:14px;display:flex;gap:8px;justify-content:center;flex-wrap:wrap">
          <button class="btn ghost small" data-prev>Preview sample</button><button class="btn small" data-use>Choose design</button></div>`;
      $("[data-use]", c).onclick = () => { state.templateId = t.id; go(3); };
      $("[data-prev]", c).onclick = (e) => {
        e.stopPropagation();
        const w = window.open("", "_blank");
        w.document.write(renderSite({ ...SAMPLE, templateId: t.id, date: "2030-01-01", dateLabel: "Sample countdown" }));
        w.document.close();
      };
      g.appendChild(c);
    });
  }

  /* ---------- step 3 ---------- */
  const form = $("#form");
  function fillForm() {
    const t = TEMPLATES.find((x) => x.id === state.templateId) || TEMPLATES[0];
    state.templateId = t.id;
    ["to", "from", "title", "eyebrow", "message", "date", "dateLabel", "surprise", "password"].forEach((k) => {
      if (form[k] && state.data[k] != null) form[k].value = state.data[k];
    });
    form.accent.value = state.data.accent || t.accent;
    renderThumbs();
  }

  function collect() {
    const d = {};
    new FormData(form).forEach((v, k) => (d[k] = v.toString().trim()));
    return { ...d, templateId: state.templateId, occasion: state.occasion, photos: state.photos };
  }

  let timer;
  function updatePreview() {
    state.data = collect();
    persist();
    clearTimeout(timer);
    timer = setTimeout(() => {
      const d = { ...state.data };
      if (!d.to) d.to = "Someone special";
      $("#pv").srcdoc = renderSite(d);
    }, 250);
  }
  form.addEventListener("input", updatePreview);

  $$("[data-view]").forEach((b) => (b.onclick = () => $("#frame").classList.toggle("desktop", b.dataset.view === "desktop")));

  /* photos: resize to max 900px JPEG so localStorage stays small */
  function resize(file) {
    return new Promise((res) => {
      const r = new FileReader();
      r.onload = () => {
        const img = new Image();
        img.onload = () => {
          const m = 900, k = Math.min(1, m / Math.max(img.width, img.height));
          const c = document.createElement("canvas");
          c.width = img.width * k; c.height = img.height * k;
          c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
          res(c.toDataURL("image/jpeg", 0.78));
        };
        img.src = r.result;
      };
      r.readAsDataURL(file);
    });
  }
  $("#photos").onchange = async (e) => {
    for (const f of [...e.target.files]) {
      if (state.photos.length >= 6) { alert("Maximum 6 photos."); break; }
      state.photos.push(await resize(f));
    }
    e.target.value = "";
    renderThumbs(); updatePreview();
  };
  function renderThumbs() {
    const box = $("#thumbs");
    box.innerHTML = "";
    state.photos.forEach((p, i) => {
      const d = document.createElement("div");
      d.className = "t";
      d.innerHTML = `<img src="${p}" alt=""><button type="button" aria-label="Remove">×</button>`;
      $("button", d).onclick = () => { state.photos.splice(i, 1); renderThumbs(); updatePreview(); };
      box.appendChild(d);
    });
  }

  /* ---------- step 4: publish ---------- */
 
let published = null;

$("#toPublish").onclick = async () => {
  const d = collect();

  if (!d.to) {
    form.to.focus();
    alert("Please enter the recipient's name.");
    return;
  }

  const button = $("#toPublish");
  const originalText = button.textContent;

  button.disabled = true;
  button.textContent = "Saving draft...";

  try {
    const site = {
      ...d,
      ...(state.editId ? { id: state.editId } : {}),
      createdAt: state.data.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: state.data.views || 0
    };

    const row = await window.SurpriseRepository.saveDraft(site);

    published = {
      ...site,
      id: row.id,
      title: row.title,
      occasion: row.occasion,
      status: row.status
    };

    state.editId = row.id;
    state.data = published;
    persist();

    $("#link").value = "";
$("#copy").disabled = true;

$("#open").onclick = () => {
  if (!published) {
    alert("Please save your surprise first.");
    return;
  }

  const w = window.open("", "_blank");

  if (w) {
    w.document.open();
    w.document.write(renderSite(published));
    w.document.close();
  } else {
    alert("Please allow pop-ups to preview your surprise.");
  }
};

    $("#shareWarn").textContent =
      "Draft saved successfully! Public sharing is not enabled yet. You can download the HTML file below.";

    go(4);
    console.log("Supabase draft saved:", row);
  } catch (error) {
    console.error("Supabase save failed:", error);
    alert("Draft save nahi hua: " + error.message);
  } finally {
    button.disabled = false;
    button.textContent = originalText;
  }
};

  $("#copy").onclick = () => { navigator.clipboard.writeText($("#link").value); $("#copy").textContent = "Copied ✓"; setTimeout(() => ($("#copy").textContent = "Copy"), 1500); };
  $("#dl").onclick = () => {
    const blob = new Blob([renderSite(published)], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = (published.to || "surprise").toLowerCase().replace(/\W+/g, "-") + ".html";
    a.click();
  };
  $("#edit").onclick = () => go(3);

  // clear draft after publishing a new one when user starts fresh
  go(state.step || 1);
})();
