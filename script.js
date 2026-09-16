import QRCode from "qrcode";

import { createClient } from "@supabase/supabase-js";

/**
 * Luc Meijerink - Portfolio "Future-proof met AI!"
 * Pure Vanilla JavaScript (ES6+)
 * 
 * Functionaliteiten:
 * - Theme Switcher (Dark/Light met LocalStorage)
 * - Luc Admin Modus (Status beheren, stories & bewijsbestanden toevoegen)
 * - Interactieve 2-Weken Sprint Timeline (Week 1 = 7 sep 2026) met klikbare story cards
 * - Reactive Sprint Matrix & Assessment Score synchronisatie
 * - Bewijzen Filter- en Zoeksysteem
 * - Modals voor Story Details, Story Toevoegen en Bewijsbestand Toevoegen
 */

// 1. Standaard Sprints Definitie (Startdatum: 7 september 2026)
const defaultSprintsData = [
  {
    number: 1,
    id: "sprint-1",
    title: "Sprint 1: Oriëntatie, Verkenning & Portfolio Opzet",
    duration: "2 weken",
    weeks: "Week 1 - 2",
    dates: "7 sep - 20 sep 2026",
    theme: "AI-impact op Finance & Control, Bottleneck analyse & Persoonlijk Portfolio",
    status: "Actief / In uitvoering",
    statusType: "active",
    luFocus: ["LU 1", "LU 4", "LU 5"],
    stories: [
      {
        id: "story-1",
        code: "RS-01",
        type: "RS",
        typeName: "Research Story",
        sprint: "Sprint 1",
        title: "Impact van AI op het beroepenveld van Finance & Control",
        story: "Als Finance & Control student, wil ik de impact van AI op mijn beroepenveld onderzoeken, zodat ik mijzelf hierop voorbereid en een onderbouwd standpunt kan innemen.",
        lus: ["LU 1"],
        status: "Behaald (V)",
        statusType: "completed",
        acceptatiecriteria: [
          "Een beknopt verslag of analyse met minimaal 3 kansen en 3 bedreigingen van AI binnen Finance & Control.",
          "Een geschreven conclusie met een persoonlijk, onderbouwd standpunt over jouw toekomstige rol als controller."
        ],
        kwaliteitscriteria: [
          "Gebruik van ten minste 3 deskundige, relevante en actuele bronnen.",
          "Triangulatie van bronnen (combinatie van vakliteratuur, praktijkvoorbeelden of meerdere LLM's).",
          "Correcte en volledige APA-bronvermelding."
        ],
        links: [] // Geen vooraf ingevulde voorbeeldlinks; Luc voegt via het plusje zijn echte bestanden toe
      },
      {
        id: "story-2",
        code: "RS-02",
        type: "RS",
        typeName: "Research Story",
        sprint: "Sprint 1",
        title: "Verkenning potentiële AI-projectideeën & procesoptimalisatie",
        story: "Als AI Minor student, wil ik potentiële projectideeën binnen mijn beroepenveld of procesoptimalisatie verkennen, zodat ik een concreet en waardevol projectvoorstel formuleer om de komende sprints gestructureerd aan te werken.",
        lus: ["LU 1", "LU 2", "LU 5"],
        status: "Afgerond / Ter review",
        statusType: "review",
        acceptatiecriteria: [
          "Een shortlist van 2 tot 3 verkende projectconcepten.",
          "Eén definitief gekozen projectidee met een heldere probleemomschrijving en de beoogde AI-toepassing(en).",
          "Een gedocumenteerd feedbackmoment met een coach of docent over het gekozen idee."
        ],
        kwaliteitscriteria: [
          "Haalbaarheid: Het gekozen idee is realistisch uit te voeren binnen de resterende sprints.",
          "Koppeling Leeruitkomsten: Het idee sluit aantoonbaar aan bij minimaal twee leeruitkomsten (zoals LU 1 en LU 2).",
          "Afbakening: De scope van het project is scherp gedefinieerd om te grote omvang te voorkomen."
        ],
        links: []
      },
      {
        id: "story-3",
        code: "RS-03",
        type: "RS",
        typeName: "Research Story",
        sprint: "Sprint 1",
        title: "Process Mining Bottlenecks & AI Automatisering (Signavio / Celonis)",
        story: "Als Finance & Control student wil ik onderzoeken hoe inefficiënties en knelpunten uit process mining (zoals SAP Signavio of Celonis) met AI geautomatiseerd kunnen worden, zodat ik een onderbouwde technische keuze kan maken voor het bouwen van een AI-prototype.",
        lus: ["LU 1", "LU 4"],
        status: "In uitvoering",
        statusType: "progress",
        acceptatiecriteria: [
          "Een analyseverslag met minimaal 3 veelvoorkomende financiële knelpunten (bottlenecks) in Signavio/Celonis.",
          "Een uitwerking hoe AI (bijv. LLM's of workflow tools zoals n8n/Make) deze knelpunten kan oplossen.",
          "Een definitieve beslissing voor één specifieke automatisering om als prototype te bouwen, inclusief de benodigde AI-tooling."
        ],
        kwaliteitscriteria: [
          "De analyse is onderbouwd met actuele bronnen over process mining en AI (zoals documentatie van SAP/Celonis of vakliteratuur).",
          "De gekozen oplossing is getoetst op haalbaarheid binnen de kaders en tooling van de minor (zoals Vibe-coding of n8n)."
        ],
        links: []
      },
      {
        id: "story-4",
        code: "US-01",
        type: "US",
        typeName: "User Story",
        sprint: "Sprint 1",
        title: "Persoonlijke, interactieve portfolio website & live Vercel deployment",
        story: "Als AI Minor student, wil ik een persoonlijke, interactieve portfolio website bouwen en live zetten, zodat ik al mijn bewijzen per leeruitkomst overzichtelijk kan presenteren aan docenten en assessoren.",
        lus: ["LU 4", "LU 5"],
        status: "Behaald (V)",
        statusType: "completed",
        acceptatiecriteria: [
          "De website toont een werkende 'Over Mij' sectie met een persoonlijke motivatie, opleiding, leeftijd en contactkanalen.",
          "Er is een interactief overzicht van de 5 leeruitkomsten zichtbaar, met daaraan gekoppeld actuele projecten en stories.",
          "Grote bestanden worden niet lokaal gehost, maar zijn bereikbaar via expliciete externe links (zoals OneDrive of YouTube).",
          "De website is succesvol gedeployd en voor iedereen bereikbaar via een openbare Vercel-URL."
        ],
        kwaliteitscriteria: [
          "Codekwaliteit: Schone HTML5, CSS3 en vanilla JavaScript conform W3C standaarden.",
          "Interactief Design: Responsive schaling en accessibility op desktop en mobiel.",
          "Versiebeheer: Opgeslagen op GitHub met heldere commits."
        ],
        links: []
      },
      {
        id: "story-5",
        code: "US-02",
        type: "US",
        typeName: "User Story",
        sprint: "Sprint 1",
        title: "Werkend AI-prototype voor financieel process mining knelpunt",
        story: "Als Finance & Control professional, wil ik een eerste werkend AI-prototype hebben dat een specifiek financieel knelpunt uit process mining (zoals Celonis/Signavio) automatiseert, zodat de doorlooptijd van dit proces aantoonbaar wordt verkort.",
        lus: ["LU 2", "LU 3", "LU 4"],
        status: "In uitvoering",
        statusType: "progress",
        acceptatiecriteria: [
          "Er is een werkende proof-of-concept interface of no-code workflow gebouwd die een dataset kan inlezen en verwerken.",
          "Er is succesvol een AI-component geïntegreerd die het probleem van de bottleneck oplost.",
          "Het prototype wordt live gedemonstreerd met een realistische test-case."
        ],
        kwaliteitscriteria: [
          "Privacy & Compliance: Uitsluitend gebruik van geanonimiseerde of synthetische testdata conform AVG.",
          "Robuustheid: Bevat basale foutafhandeling.",
          "Deployment: Gekoppeld aan GitHub en live testbaar."
        ],
        links: []
      }
    ]
  },
  {
    number: 2,
    id: "sprint-2",
    title: "Sprint 2: Data-analyse & Architectuur Keuze",
    duration: "2 weken",
    weeks: "Week 3 - 4",
    dates: "21 sep - 4 okt 2026",
    theme: "Dataset synthese, API selectie & Architectuurontwerp",
    status: "Gepland",
    statusType: "planned",
    luFocus: ["LU 2", "LU 3", "LU 4"],
    stories: [] // Leeg template conform gebruikerswens; gereed voor eigen stories
  },
  {
    number: 3,
    id: "sprint-3",
    title: "Sprint 3: AI-Koppeling & Integratie Prototype",
    duration: "2 weken",
    weeks: "Week 5 - 6",
    dates: "5 okt - 18 okt 2026",
    theme: "API implementatie, prompt engineering & validatie",
    status: "Gepland",
    statusType: "planned",
    luFocus: ["LU 2", "LU 4"],
    stories: []
  },
  {
    number: 4,
    id: "sprint-4",
    title: "Sprint 4: Midterm Review & Verfijning",
    duration: "2 weken",
    weeks: "Week 7 - 8",
    dates: "19 okt - 1 nov 2026",
    theme: "Tussentijds assessment, feedbackverwerking en iteratie",
    status: "Gepland",
    statusType: "planned",
    luFocus: ["LU 1", "LU 3", "LU 5"],
    stories: []
  },
  {
    number: 5,
    id: "sprint-5",
    title: "Sprint 5: Workflow Automatisering & Business Case",
    duration: "2 weken",
    weeks: "Week 9 - 10",
    dates: "2 nov - 15 nov 2026",
    theme: "End-to-end automatisering, webhook integraties & ROI analyse",
    status: "Gepland",
    statusType: "planned",
    luFocus: ["LU 1", "LU 2", "LU 4"],
    stories: []
  },
  {
    number: 6,
    id: "sprint-6",
    title: "Sprint 6: Gebruikersvalidatie & Foutafhandeling",
    duration: "2 weken",
    weeks: "Week 11 - 12",
    dates: "16 nov - 29 nov 2026",
    theme: "Usability tests, stresstesten en feedback integratie",
    status: "Gepland",
    statusType: "planned",
    luFocus: ["LU 2", "LU 4", "LU 5"],
    stories: []
  },
  {
    number: 7,
    id: "sprint-7",
    title: "Sprint 7: Eindproductie, Show & Tell Demo & Peer Review",
    duration: "2 weken",
    weeks: "Week 13 - 14",
    dates: "30 nov - 13 dec 2026",
    theme: "Definitieve release, video demo en cross-peer review",
    status: "Gepland",
    statusType: "planned",
    luFocus: ["LU 2", "LU 3", "LU 5"],
    stories: []
  },
  {
    number: 8,
    id: "sprint-8",
    title: "Sprint 8: Portfolio Afronding & Examenvoorbereiding",
    duration: "2 weken",
    weeks: "Week 15 - 16",
    dates: "14 dec - 27 dec 2026",
    theme: "Eindbeoordeling, complete dossiercheck & mondelinge verdediging",
    status: "Gepland",
    statusType: "planned",
    luFocus: ["LU 1", "LU 2", "LU 3", "LU 4", "LU 5"],
    stories: []
  }
];

// 2. Data Initialisatie via LocalStorage & Cloud Synchronisatie (Supabase + Server API)
const STORAGE_KEY = "luc_portfolio_sprints_v3";
let sprintsData = loadSprintsData();

// Gedeelde Supabase client voor realtime synchronisatie van documenten, stories en chat
let supabaseClient = null;
function getSupabaseClient() {
  if (supabaseClient) return supabaseClient;
  try {
    let rawUrl = (import.meta.env.VITE_SUPABASE_URL || "").trim();
    const rawKey = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "").trim();

    // Valideer of herstel naar officieel project endpoint als URL ontbreekt of per ongeluk geen http(s) bevat
    if (!rawUrl || (!rawUrl.startsWith("http://") && !rawUrl.startsWith("https://"))) {
      rawUrl = "https://wllvfqseygzflhxjcbxx.supabase.co";
    }

    // Auto-fix mocht .com per ongeluk ingevuld zijn i.p.v. .co
    if (rawUrl.includes(".supabase.com")) {
      rawUrl = rawUrl.replace(".supabase.com", ".supabase.co");
    }

    // Alleen initialiseren als de key geen lege placeholder of per ongeluk een gemini key is
    if (rawKey && !rawKey.startsWith("AQ.") && !rawKey.startsWith("AIza")) {
      supabaseClient = createClient(rawUrl, rawKey);
    }
  } catch (err) {
    console.warn("Supabase initialisatie:", err);
    supabaseClient = null;
  }
  return supabaseClient;
}

// Visual status indicator voor docenten en assessoren
function updateCloudStatusBadge(isSynced, sourceName = "") {
  const badge = document.getElementById("files-hub-sync-status");
  if (!badge) return;
  if (isSynced) {
    badge.className = "files-hub-sync-badge synced";
    badge.innerHTML = `
      <span class="sync-dot"></span>
      <span class="sync-text">${sourceName ? `${sourceName} gesynchroniseerd` : 'Cloud gesynchroniseerd'}</span>
    `;
    badge.title = `Alle stories en gekoppelde bestanden zijn live gesynchroniseerd via ${sourceName || 'de cloud'} en direct zichtbaar voor docenten op hun laptops.`;
  } else {
    badge.className = "files-hub-sync-badge local";
    badge.innerHTML = `
      <span class="sync-dot"></span>
      <span class="sync-text">Lokaal opgeslagen</span>
    `;
    badge.title = "Data is lokaal in de browser opgeslagen. Zodra verbinding met de cloud gemaakt wordt, synchroniseert dit automatisch.";
  }
}

// Debounced cloud save om zowel naar Supabase als naar de server state te schrijven
let syncTimeout = null;
function triggerCloudSave() {
  clearTimeout(syncTimeout);
  syncTimeout = setTimeout(async () => {
    const payload = {
      sprints_data: sprintsData,
      matrix_data: typeof matrixEvaluations !== "undefined" ? matrixEvaluations : null,
      updated_at: new Date().toISOString()
    };

    const badge = document.getElementById("files-hub-sync-status");
    if (badge) {
      badge.classList.add("syncing");
      const textEl = badge.querySelector(".sync-text");
      if (textEl) textEl.textContent = "Opslaan in cloud...";
    }

    let savedToSupabase = false;
    let savedToServer = false;

    // 1. Schrijf naar Supabase (tabel 'portfolio_state')
    const client = getSupabaseClient();
    if (client) {
      try {
        const { error } = await client
          .from("portfolio_state")
          .upsert({ id: "main", ...payload }, { onConflict: "id" });
        if (!error) {
          savedToSupabase = true;
          console.log("Portfolio data succesvol opgeslagen in Supabase.");
        } else {
          console.warn("Supabase upsert melding:", error.message);
        }
      } catch (err) {
        console.warn("Supabase upsert fout:", err);
      }
    }

    // 2. Schrijf naar server state API (altijd als redundante backup voor docenten)
    try {
      const resp = await fetch("/api/portfolio/state", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (resp.ok) {
        savedToServer = true;
      }
    } catch (err) {
      console.warn("Server state opslaan fout:", err);
    }

    if (savedToSupabase) {
      updateCloudStatusBadge(true, "Supabase");
    } else if (savedToServer) {
      updateCloudStatusBadge(true, "Cloud");
    } else {
      updateCloudStatusBadge(false);
    }
  }, 350);
}

// Haal de meest actuele portfolio documenten en data op vanuit de cloud bij het laden van de pagina
async function syncPortfolioDataFromCloud() {
  const badge = document.getElementById("files-hub-sync-status");
  if (badge) {
    badge.classList.add("syncing");
    const textEl = badge.querySelector(".sync-text");
    if (textEl) textEl.textContent = "Cloud data ophalen...";
  }

  let cloudSprints = null;
  let cloudMatrix = null;
  let source = "";

  // 1. Probeer Supabase
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from("portfolio_state")
        .select("sprints_data, matrix_data")
        .eq("id", "main")
        .maybeSingle();

      if (!error && data?.sprints_data && Array.isArray(data.sprints_data) && data.sprints_data.length === 8) {
        cloudSprints = data.sprints_data;
        if (data.matrix_data) cloudMatrix = data.matrix_data;
        source = "Supabase";
      } else if (!data) {
        // Eerste keer: Supabase tabel is nog leeg, sla huidige portfolio data direct op
        triggerCloudSave();
      }
    } catch (err) {
      console.warn("Supabase ophalen:", err);
    }
  }

  // 2. Probeer server state API als fallback
  if (!cloudSprints) {
    try {
      const resp = await fetch("/api/portfolio/state");
      if (resp.ok) {
        const serverData = await resp.json();
        if (serverData?.sprints_data && Array.isArray(serverData.sprints_data) && serverData.sprints_data.length === 8) {
          cloudSprints = serverData.sprints_data;
          if (serverData.matrix_data) cloudMatrix = serverData.matrix_data;
          source = "Cloud";
        }
      }
    } catch (err) {
      console.warn("Server sync ophalen:", err);
    }
  }

  // Als er cloud data aanwezig is, update lokale data en her-render alle componenten
  if (cloudSprints) {
    sprintsData = cloudSprints;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sprintsData));
    if (cloudMatrix && typeof matrixEvaluations !== "undefined") {
      matrixEvaluations = cloudMatrix;
      localStorage.setItem("luc_portfolio_manual_matrix_evaluations", JSON.stringify(matrixEvaluations));
    }
    updateAllStoriesData();
    renderActiveSprint();
    renderStories();
    renderDashboardFilesHub();
    updateMatrixAndScore();
    if (typeof renderCurrentFocusWidget === "function") {
      renderCurrentFocusWidget();
    }
    updateCloudStatusBadge(true, source);
  } else {
    updateCloudStatusBadge(false);
  }
}

function loadSprintsData() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length === 8) {
        return parsed;
      }
    } catch (e) {
      console.warn("Fout bij parsen van opgeslagen data, default wordt geladen", e);
    }
  }
  return JSON.parse(JSON.stringify(defaultSprintsData));
}

function saveSprintsData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sprintsData));
  updateAllStoriesData();
  if (typeof renderCurrentFocusWidget === "function") {
    renderCurrentFocusWidget();
  }
  // Synchroniseer direct naar cloud zodat docenten en assessoren altijd de actuele bestanden zien
  triggerCloudSave();
}

// Flat list van alle stories
let allStoriesData = [];
function updateAllStoriesData() {
  allStoriesData = sprintsData.flatMap(s => s.stories);
}
updateAllStoriesData();

// 3. State Management
let currentLuFilter = localStorage.getItem("luc_portfolio_lu_filter") || "all";
let currentTypeFilter = "all";
let currentSearchQuery = "";

/**
 * Automatische selectie van de juiste sprint op basis van de huidige kalenderdatum.
 * Sprint 1 start officieel op maandag 7 september 2026.
 * Elke sprint beslaat een vaste cyclus van exact 2 weken (14 dagen).
 *
 * Sprint 1: 07 sep - 20 sep 2026 (index 0)
 * Sprint 2: 21 sep - 04 okt 2026 (index 1)
 * Sprint 3: 05 okt - 18 okt 2026 (index 2)
 * Sprint 4: 19 okt - 01 nov 2026 (index 3)
 * Sprint 5: 02 nov - 15 nov 2026 (index 4)
 * Sprint 6: 16 nov - 29 nov 2026 (index 5)
 * Sprint 7: 30 nov - 13 dec 2026 (index 6)
 * Sprint 8: 14 dec - 27 dec 2026 (index 7)
 *
 * @param {Date} [currentDate=new Date()]
 * @returns {number} sprintIndex (0 = Sprint 1 t/m 7 = Sprint 8)
 */
function getAutoSprintIndex(currentDate = new Date()) {
  const currentYear = currentDate.getFullYear();
  let checkDate = new Date(currentDate);

  // Indien getest in een testomgeving of jaar vóór 2026, projecteer naar minorjaar 2026
  if (currentYear < 2026) {
    checkDate = new Date(2026, currentDate.getMonth(), currentDate.getDate(), 12, 0, 0);
  } else if (currentYear > 2026) {
    // Na afloop van het minorjaar 2026 staat het portfolio definitief op eindsprint 8
    return 7;
  }

  // Normaliseer naar middag 12:00:00 om zomertijd/wintertijd verschuivingen (DST) te ondervangen
  const dTarget = new Date(checkDate.getFullYear(), checkDate.getMonth(), checkDate.getDate(), 12, 0, 0);
  const dSprint1Start = new Date(2026, 8, 7, 12, 0, 0); // Maandag 7 september 2026

  // Vóór 7 september 2026 -> toon Sprint 1
  if (dTarget < dSprint1Start) {
    return 0;
  }

  // Verschil in kalenderdagen sinds 7 september 2026
  const diffDays = Math.round((dTarget.getTime() - dSprint1Start.getTime()) / (1000 * 60 * 60 * 24));
  const sprintIndex = Math.floor(diffDays / 14);

  // Begrens tussen 0 (Sprint 1) en 7 (Sprint 8)
  return Math.min(Math.max(sprintIndex, 0), 7);
}

// Exporteer globale helper zodat ook via de console of evaluaties een testdatum kan worden aangeroepen
window.getAutoSprintIndex = getAutoSprintIndex;

// Automatisch geïnitialiseerd op basis van de huidige datum
let currentSprintIndex = getAutoSprintIndex();

// Admin Modus: Standaard UIT bij binnenkomst conform wens gebruiker
let isAdminMode = false;

// 4. Luc Admin Mode & PC-Verificatie
function initAdminMode() {
  const adminToggleBtn = document.getElementById("admin-mode-toggle");
  const authModal = document.getElementById("admin-auth-modal");
  const authForm = document.getElementById("admin-auth-form");
  const pinInput = document.getElementById("admin-pin-input");
  const authError = document.getElementById("admin-auth-error");
  const authCloseBtn = document.getElementById("admin-auth-close-btn");
  const authCancelBtn = document.getElementById("admin-auth-cancel-btn");
  const rememberDeviceCheck = document.getElementById("admin-remember-device");

  function openAuthModal() {
    if (!authModal) return;
    authModal.classList.add("open");
    authModal.classList.add("active");
    if (authError) authError.style.display = "none";
    if (pinInput) {
      pinInput.value = "";
      setTimeout(() => pinInput.focus(), 150);
    }
    document.body.style.overflow = "hidden";
  }

  function closeAuthModal() {
    if (!authModal) return;
    authModal.classList.remove("open");
    authModal.classList.remove("active");
    if (authError) authError.style.display = "none";
    document.body.style.overflow = "";
  }

  if (authCloseBtn) authCloseBtn.addEventListener("click", closeAuthModal);
  if (authCancelBtn) authCancelBtn.addEventListener("click", closeAuthModal);
  if (authModal) {
    authModal.addEventListener("click", (e) => {
      if (e.target === authModal) closeAuthModal();
    });
  }

  if (authForm) {
    authForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const enteredCode = (pinInput ? pinInput.value : "").trim().toLowerCase();
      // Geaccepteerde wachtwoorden/pincodes voor Luc Meijerink
      const validCodes = ["luc", "luc2025", "lucmeijerink", "1234", "admin", "futureproof"];
      
      if (validCodes.includes(enteredCode)) {
        if (rememberDeviceCheck && rememberDeviceCheck.checked) {
          localStorage.setItem("luc_portfolio_pc_authorized", "true");
        }
        isAdminMode = true;
        closeAuthModal();
        updateAdminButtonUI();
        renderActiveSprint();
        renderStories();
        renderDashboardFilesHub();
        updateMatrixAndScore();
        showToast("Geautoriseerd als Luc Meijerink! Beheerdersmodus is nu ontgrendeld.", "success");
      } else {
        if (authError) authError.style.display = "block";
        if (pinInput) {
          pinInput.focus();
          pinInput.select();
        }
      }
    });
  }

  if (adminToggleBtn) {
    updateAdminButtonUI();
    adminToggleBtn.addEventListener("click", () => {
      if (isAdminMode) {
        // Uitschakelen terug naar normale modus
        isAdminMode = false;
        updateAdminButtonUI();
        renderActiveSprint();
        renderStories();
        renderDashboardFilesHub();
        updateMatrixAndScore();
        showToast("Beheerdersmodus uitgeschakeld. Normale weergave actief.", "info");
      } else {
        // Inschakelen: controleer of deze PC reeds geautoriseerd is voor Luc
        const isDeviceAuthorized = localStorage.getItem("luc_portfolio_pc_authorized") === "true";
        if (isDeviceAuthorized) {
          isAdminMode = true;
          updateAdminButtonUI();
          renderActiveSprint();
          renderStories();
          renderDashboardFilesHub();
          updateMatrixAndScore();
          showToast("Beheerdersmodus ingeschakeld op jouw geautoriseerde PC.", "success");
        } else {
          openAuthModal();
        }
      }
    });
  }
}

function updateAdminButtonUI() {
  const adminToggleBtn = document.getElementById("admin-mode-toggle");
  if (!adminToggleBtn) return;
  if (isAdminMode) {
    adminToggleBtn.classList.add("active");
    adminToggleBtn.innerHTML = `
      <span class="admin-pulse-dot"></span>
      <span>Admin Actief (Luc)</span>
    `;
    adminToggleBtn.title = "Admin modus is actief: je kunt stories toevoegen, statussen wijzigen en bewijsbestanden koppelen.";
  } else {
    adminToggleBtn.classList.remove("active");
    adminToggleBtn.innerHTML = `
      <span>🔒 Admin Modus</span>
    `;
    adminToggleBtn.title = "Klik om Admin Modus in te schakelen (uitsluitend geautoriseerd voor Luc).";
  }
}

// 5. Theme Toggle
function initTheme() {
  const savedTheme = localStorage.getItem("luc_portfolio_theme");
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = savedTheme || (prefersDark ? "dark" : "light");

  applyTheme(initialTheme);

  const toggleBtn = document.getElementById("theme-toggle-btn");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") || "light";
      const next = current === "dark" ? "light" : "dark";
      applyTheme(next);
      localStorage.setItem("luc_portfolio_theme", next);
    });
  }
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const iconSun = document.getElementById("icon-sun");
  const iconMoon = document.getElementById("icon-moon");
  if (iconSun && iconMoon) {
    if (theme === "dark") {
      iconSun.style.display = "block";
      iconMoon.style.display = "none";
    } else {
      iconSun.style.display = "none";
      iconMoon.style.display = "block";
    }
  }
}

// 6. Interactive Timeline (2-weken cyclus met datums)
function initTimeline() {
  // Automatisch de juiste sprint selecteren op basis van huidige datum (Sprint 1 start op 7 sept)
  currentSprintIndex = getAutoSprintIndex();
  updateTimelineView();

  const prevBtn = document.getElementById("timeline-prev-btn");
  const nextBtn = document.getElementById("timeline-next-btn");

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (currentSprintIndex > 0) {
        currentSprintIndex--;
        updateTimelineView();
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (currentSprintIndex < sprintsData.length - 1) {
        currentSprintIndex++;
        updateTimelineView();
      }
    });
  }
}

function updateTimelineView() {
  renderTimelineSteps();
  renderActiveSprint();
  updateTimelineControls();
  updateDashboardSprintBadge();

  // Zorg ervoor dat het geselecteerde sprint-blokje op mobiel altijd netjes centraal in beeld staat
  setTimeout(() => {
    const selectedNode = document.querySelector(`.timeline-step-node[data-sprint-index="${currentSprintIndex}"]`);
    if (selectedNode) {
      selectedNode.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, 50);
}

function updateDashboardSprintBadge() {
  const dashBadgeText = document.getElementById("dash-sprint-badge-text");
  if (dashBadgeText) {
    const calendarIdx = getAutoSprintIndex();
    dashBadgeText.textContent = `Minor "Future-proof met AI!" • Sprint ${calendarIdx + 1} Actief (2 weken ritme)`;
  }
}

function updateTimelineControls() {
  const prevBtn = document.getElementById("timeline-prev-btn");
  const nextBtn = document.getElementById("timeline-next-btn");
  const sprintCounter = document.getElementById("timeline-sprint-counter");
  const calendarIdx = getAutoSprintIndex();

  if (prevBtn) {
    prevBtn.disabled = currentSprintIndex === 0;
    prevBtn.classList.toggle("disabled", currentSprintIndex === 0);
  }
  if (nextBtn) {
    nextBtn.disabled = currentSprintIndex === sprintsData.length - 1;
    nextBtn.classList.toggle("disabled", currentSprintIndex === sprintsData.length - 1);
  }
  if (sprintCounter) {
    const isNow = currentSprintIndex === calendarIdx;
    sprintCounter.textContent = `Sprint ${currentSprintIndex + 1} van 8 (${sprintsData[currentSprintIndex].duration})${isNow ? ' • Huidige datum' : ''}`;
  }
}

function renderTimelineSteps() {
  const stepsContainer = document.getElementById("timeline-steps-track");
  if (!stepsContainer) return;

  const calendarIdx = getAutoSprintIndex();

  stepsContainer.innerHTML = sprintsData.map((sprint, idx) => {
    const isSelected = idx === currentSprintIndex;
    const isCalendarCurrent = idx === calendarIdx;

    let stateClass = "future";
    if (idx < calendarIdx) {
      stateClass = "past";
    } else if (isCalendarCurrent) {
      stateClass = "current-sprint";
    }

    if (isSelected) {
      stateClass += " selected";
    }

    return `
      <button class="timeline-step-node ${stateClass}" data-sprint-index="${idx}" title="${sprint.title} (${sprint.weeks} • ${sprint.dates})">
        <span class="step-badge">S${sprint.number}</span>
        <span class="step-label">${sprint.weeks}</span>
        <span class="step-date-label">${sprint.dates}</span>
        ${isCalendarCurrent ? '<span class="sprint-live-pill" title="Huidige sprint volgens kalender">Nu</span>' : ''}
      </button>
    `;
  }).join('');

  stepsContainer.querySelectorAll(".timeline-step-node").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.getAttribute("data-sprint-index"), 10);
      currentSprintIndex = idx;
      updateTimelineView();
    });
  });
}

// Helper voor status weergave
function getStatusLabel(statusType) {
  switch (statusType) {
    case "completed": return "✓ Behaald (V)";
    case "progress": return "⏳ In uitvoering";
    case "review": return "📋 Afgerond / Ter review";
    case "planned": return "📅 Gepland";
    default: return "Gepland";
  }
}

function renderActiveSprint() {
  const sprint = sprintsData[currentSprintIndex];
  const container = document.getElementById("active-sprint-view");
  if (!container || !sprint) return;

  const calendarIdx = getAutoSprintIndex();
  const isCurrentLive = sprint.number === (calendarIdx + 1);

  container.innerHTML = `
    <div class="sprint-detail-banner">
      <div class="sprint-banner-left">
        <div class="sprint-meta-chips">
          <span class="sprint-badge-pill">Sprint ${sprint.number} • ${sprint.duration}</span>
          <span class="sprint-weeks-pill">${sprint.weeks}</span>
          <span class="sprint-dates-pill">📅 ${sprint.dates}</span>
          <span class="sprint-status-tag ${isCurrentLive ? 'active' : sprint.statusType}">
            ${isCurrentLive ? '🔥 Actief / In uitvoering (Vandaag)' : '📅 ' + sprint.status}
          </span>
        </div>
        <h3 class="sprint-banner-title">${escapeHtml(sprint.title)}</h3>
        <p class="sprint-banner-theme">
          <strong>Thema & Doel:</strong> ${escapeHtml(sprint.theme)}
        </p>
      </div>

      <div class="sprint-banner-right">
        <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
          <div class="sprint-stat-pill">
            <span class="stat-num">${sprint.stories.length}</span>
            <span class="stat-txt">Stories in deze sprint</span>
          </div>
          ${isAdminMode ? `
            <button class="btn-dash primary" id="btn-add-story-top" style="padding: 0.5rem 0.9rem; font-size: 0.8rem;">
              <span>+ Story Toevoegen</span>
            </button>
          ` : ''}
        </div>
        <div class="sprint-focus-lus">
          <span class="focus-label">Doel LU's:</span>
          ${sprint.luFocus.map(lu => `<span class="sprint-lu-chip">${lu}</span>`).join('')}
        </div>
      </div>
    </div>

    <!-- Stories Grid van de geselecteerde sprint -->
    ${sprint.stories.length === 0 ? `
      <div class="empty-sprint-container">
        <div class="empty-sprint-icon">📌</div>
        <h4 class="empty-sprint-title">Nog geen stories in Sprint ${sprint.number}</h4>
        <p class="empty-sprint-desc">
          Deze sprint (${sprint.weeks} • ${sprint.dates}) is momenteel leeg. Als beheerder kun je eenvoudig nieuwe Research Stories (RS) of User Stories (US) aanmaken.
        </p>
        ${isAdminMode ? `
          <button class="btn-add-story-hero" id="btn-add-story-empty">
            <span>+ Nieuwe Story Toevoegen aan Sprint ${sprint.number}</span>
          </button>
        ` : `
          <p style="font-size: 0.85rem; color: var(--text-muted); font-style: italic;">
            Schakel de Admin Modus in om nieuwe stories aan deze sprint toe te voegen.
          </p>
        `}
      </div>
    ` : `
      <div class="timeline-stories-grid">
        ${sprint.stories.map(story => {
          return `
            <article class="timeline-story-card clickable ${story.statusType}" data-story-id="${story.id}" title="Klik op deze kaart om alle criteria en details te openen">
              <div class="story-top">
                <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                  <span class="story-type-badge ${story.type.toLowerCase()}">${story.typeName} (${story.code})</span>
                  <span class="story-sprint-badge">${story.sprint}</span>
                </div>
                
                ${isAdminMode ? `
                  <select class="admin-inline-status-select" data-story-id="${story.id}" title="Wijzig status (Admin)">
                    <option value="completed" ${story.statusType === 'completed' ? 'selected' : ''}>✓ Behaald (V)</option>
                    <option value="progress" ${story.statusType === 'progress' ? 'selected' : ''}>⏳ In uitvoering</option>
                    <option value="review" ${story.statusType === 'review' ? 'selected' : ''}>📋 Afgerond / Ter review</option>
                    <option value="planned" ${story.statusType === 'planned' ? 'selected' : ''}>📅 Gepland</option>
                  </select>
                ` : `
                  <span class="status-pill ${story.statusType}">
                    ${getStatusLabel(story.statusType)}
                  </span>
                `}
              </div>

              <h4 class="story-card-title">${escapeHtml(story.title)}</h4>

              <p class="story-card-user-formula">
                "${escapeHtml(story.story)}"
              </p>

              <div class="story-card-lus">
                ${story.lus.map(lu => `<span class="story-lu-pill">${lu}</span>`).join('')}
              </div>

              <div class="story-criteria-sneak">
                <div class="sneak-title">Criteria Focus:</div>
                <ul class="sneak-list">
                  ${story.acceptatiecriteria && story.acceptatiecriteria.length > 0 ? story.acceptatiecriteria.slice(0, 2).map(ac => `
                    <li><span class="dot">•</span> <span>${escapeHtml(ac)}</span></li>
                  `).join('') : '<li><span class="dot">•</span> <span>Nog geen criteria ingevoerd</span></li>'}
                </ul>
              </div>

              <!-- Bewijslast & Bestanden toevoegen -->
              <div class="story-card-action-row" style="margin-bottom: 0.25rem;">
                <div class="mini-ext-links">
                  ${story.links && story.links.length > 0 ? story.links.map(l => `
                    <a href="${l.url}" target="_blank" rel="noopener noreferrer" class="mini-link-btn" title="${escapeHtml(l.note || l.label)}" onclick="event.stopPropagation()">
                      ${getExternalIcon(l.type)} ${escapeHtml(l.label.split(' ')[0])}
                    </a>
                  `).join('') : `
                    <span style="font-size: 0.75rem; color: var(--text-muted); font-style: italic;">Geen bestanden</span>
                  `}
                </div>

                ${isAdminMode ? `
                  <button class="add-story-file-btn" data-story-id="${story.id}" title="Voeg een bewijsbestand of externe link toe" onclick="event.stopPropagation()">
                    + Bestand toevoegen
                  </button>
                ` : ''}
              </div>

              <!-- Duidelijke klik-instructie onderaan conform gebruikerswens -->
              <div class="story-card-click-hint">
                <span>ℹ️ Klik op dit blok voor alle details & criteria</span>
              </div>
            </article>
          `;
        }).join('')}
      </div>
    `}
  `;

  // Story kaart klikbaar maken voor het openen van details
  container.querySelectorAll(".timeline-story-card").forEach(card => {
    card.addEventListener("click", (e) => {
      // Als er op een interactief element geklikt is, niet de modal openen
      if (e.target.closest("select") || e.target.closest("button") || e.target.closest("a")) {
        return;
      }
      const storyId = card.getAttribute("data-story-id");
      if (storyId) openStoryModal(storyId);
    });
  });

  // Inline status selector handlers
  container.querySelectorAll(".admin-inline-status-select").forEach(sel => {
    sel.addEventListener("click", (e) => e.stopPropagation());
    sel.addEventListener("change", (e) => {
      e.stopPropagation();
      const storyId = sel.getAttribute("data-story-id");
      const newStatusType = sel.value;
      updateStoryStatus(storyId, newStatusType);
    });
  });

  // Plusje: Bewijsbestand toevoegen aan story
  container.querySelectorAll(".add-story-file-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const storyId = btn.getAttribute("data-story-id");
      openAddLinkModal(storyId);
    });
  });

  // Knoppen voor nieuwe story toevoegen
  const btnAddStoryTop = document.getElementById("btn-add-story-top");
  if (btnAddStoryTop) {
    btnAddStoryTop.addEventListener("click", () => openAddStoryModal(currentSprintIndex));
  }
  const btnAddStoryEmpty = document.getElementById("btn-add-story-empty");
  if (btnAddStoryEmpty) {
    btnAddStoryEmpty.addEventListener("click", () => openAddStoryModal(currentSprintIndex));
  }
}

// 7. Update Story Status & Sync met de Sprint Matrix & Assessment Score
function updateStoryStatus(storyId, newStatusType) {
  let updated = false;
  for (const sprint of sprintsData) {
    const story = sprint.stories.find(s => s.id === storyId);
    if (story) {
      story.statusType = newStatusType;
      story.status = getStatusLabel(newStatusType);
      updated = true;
      break;
    }
  }

  if (updated) {
    saveSprintsData();
    renderActiveSprint();
    renderStories();
    updateMatrixAndScore();
  }
}

// ==========================================================================
// 8. Handmatige Sprint Matrix Evaluaties & Real-time Voortgangsmeter
// Volledig handmatig instelbaar in Admin Modus en gekoppeld aan LocalStorage
// ==========================================================================
const MATRIX_STORAGE_KEY = "luc_portfolio_manual_matrix_evaluations";

// Laad opgeslagen handmatige beoordelingen of initialiseer met standaard (Sprint 1 LU 1)
function loadMatrixEvaluations() {
  try {
    const raw = localStorage.getItem(MATRIX_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Fout bij laden van matrix evaluaties:", e);
  }
  // Standaard startwaarde voor Luc's portfolio: 1 voldoende behaald in Sprint 1 voor LU 1
  return {
    "LU 1": { 1: true },
    "LU 2": {},
    "LU 3": {},
    "LU 4": {},
    "LU 5": {}
  };
}

let matrixEvaluations = loadMatrixEvaluations();

function saveMatrixEvaluations() {
  try {
    localStorage.setItem(MATRIX_STORAGE_KEY, JSON.stringify(matrixEvaluations));
    triggerCloudSave();
  } catch (e) {
    console.error("Fout bij opslaan van matrix evaluaties:", e);
    showToast("Kon wijzigingen niet opslaan in LocalStorage", "error");
  }
}

function toggleMatrixCell(luCode, sprintNum) {
  if (!isAdminMode) {
    showToast("Schakel Admin Modus in (knop rechtsboven) om beoordelingen handmatig aan te passen", "info");
    return;
  }

  if (!matrixEvaluations[luCode]) {
    matrixEvaluations[luCode] = {};
  }

  const currentVal = !!matrixEvaluations[luCode][sprintNum];
  const newVal = !currentVal;
  matrixEvaluations[luCode][sprintNum] = newVal;
  saveMatrixEvaluations();

  // Herbereken direct de score, update meter animatie en herrender tabel
  updateMatrixAndScore();

  if (newVal) {
    showToast(`${luCode} in Sprint ${sprintNum} op "Voldoende (V)" gezet! ✓`, "success");
  } else {
    showToast(`Beoordeling voor ${luCode} in Sprint ${sprintNum} ingetrokken`, "info");
  }
}

function updateMatrixAndScore() {
  const matrixBody = document.getElementById("matrix-table-body");
  const totalEarnedCell = document.getElementById("matrix-total-earned-cell");
  const totalAchievedSummary = document.getElementById("matrix-total-achieved");
  const kpiPtsVal = document.getElementById("kpi-pts-val");
  const kpiPtsSub = document.getElementById("kpi-pts-sub");
  const kpiLiveStories = document.getElementById("kpi-live-stories");

  // Leeruitkomsten configuratie (totaal 18 pt doel)
  const luConfig = [
    { code: "LU 1", name: "LU 1: AI-Impact", maxPts: 2, num: 1 },
    { code: "LU 2", name: "LU 2: Oplossing", maxPts: 4, num: 2 },
    { code: "LU 3", name: "LU 3: Ethiek", maxPts: 2, num: 3 },
    { code: "LU 4", name: "LU 4: Tools", maxPts: 4, num: 4 },
    { code: "LU 5", name: "LU 5: Zelfsturing", maxPts: 6, num: 5 }
  ];

  let totalEarnedOverall = 0;
  const sprintEarnedCounts = [0, 0, 0, 0, 0, 0, 0, 0];
  let voldaanLuCount = 0;

  const allStories = sprintsData.flatMap(s => s.stories);
  const totalStoriesAll = allStories.length;
  const completedStoriesAll = allStories.filter(st => st.statusType === "completed").length;

  const rowsHtml = luConfig.map(lu => {
    let luEarnedCount = 0;

    // Sprint 1 t/m 8 cellen genereren
    const sprintCells = [1, 2, 3, 4, 5, 6, 7, 8].map(sprintNum => {
      const isAchieved = !!(matrixEvaluations[lu.code] && matrixEvaluations[lu.code][sprintNum]);
      if (isAchieved) {
        luEarnedCount++;
        sprintEarnedCounts[sprintNum - 1]++;
      }

      if (isAdminMode) {
        return `
          <td>
            <button 
              type="button" 
              class="matrix-cell-toggle ${isAchieved ? 'is-achieved' : 'is-pending'}" 
              data-lu="${lu.code}" 
              data-sprint="${sprintNum}"
              role="checkbox"
              aria-checked="${isAchieved}"
              aria-label="${lu.name}, Sprint ${sprintNum}: ${isAchieved ? 'Voldoende behaald' : 'Niet beoordeeld'}"
              title="Sprint ${sprintNum} (${lu.code}): ${isAchieved ? 'Voldoende behaald (klik om in te trekken)' : 'Klik om Voldoende toe te kennen'}"
            >
              <span class="matrix-cell-icon">${isAchieved ? '✓' : '−'}</span>
              <span class="matrix-cell-label">${isAchieved ? 'V' : ''}</span>
            </button>
          </td>
        `;
      }

      return `
        <td>
          ${isAchieved 
            ? `<span class="check-mark" title="${lu.name}: Voldaan in Sprint ${sprintNum}">V</span>` 
            : `<span class="dash" title="Niet beoordeeld">−</span>`
          }
        </td>
      `;
    }).join('');

    const earnedPts = luEarnedCount;
    totalEarnedOverall += earnedPts;

    if (earnedPts >= lu.maxPts) {
      voldaanLuCount++;
    }

    const percent = Math.min(100, Math.round((earnedPts / lu.maxPts) * 100));

    // Update bijbehorende interactieve LU Card op het scherm
    const badgeEl = document.getElementById(`lu-score-badge-${lu.num}`);
    const progressBarEl = document.getElementById(`lu-progress-bar-${lu.num}`);
    const statusTextEl = document.getElementById(`lu-status-text-${lu.num}`);
    const percentEl = document.getElementById(`lu-percent-${lu.num}`);
    const countEl = document.getElementById(`lu-stories-count-${lu.num}`);
    const matchingStories = allStories.filter(st => st.lus && st.lus.includes(lu.code));

    if (badgeEl) {
      badgeEl.className = "lu-score-badge";
      if (earnedPts >= lu.maxPts) {
        badgeEl.classList.add("achieved");
        badgeEl.textContent = `✓ ${earnedPts} / ${lu.maxPts} pt Voldaan!`;
      } else if (earnedPts > 0) {
        badgeEl.classList.add("in-progress");
        badgeEl.textContent = `⏳ ${earnedPts} / ${lu.maxPts} pt Behaald`;
      } else {
        badgeEl.textContent = `0 / ${lu.maxPts} pt Doel`;
      }
    }

    if (progressBarEl) {
      progressBarEl.style.width = `${percent}%`;
      progressBarEl.className = `lu-progress-bar ${earnedPts >= lu.maxPts ? 'achieved' : ''}`;
    }

    if (statusTextEl) {
      statusTextEl.className = "lu-status-text";
      if (earnedPts >= lu.maxPts) {
        statusTextEl.classList.add("achieved");
        statusTextEl.textContent = "Volledig voldaan ✓";
      } else if (earnedPts > 0) {
        statusTextEl.classList.add("in-progress");
        statusTextEl.textContent = `Deels behaald (${earnedPts}/${lu.maxPts} pt)`;
      } else {
        statusTextEl.textContent = `Nog te behalen (${lu.maxPts} pt)`;
      }
    }

    if (percentEl) {
      percentEl.textContent = `${percent}%`;
    }

    if (countEl) {
      countEl.textContent = `${matchingStories.length} ${matchingStories.length === 1 ? 'story' : 'stories'} gekoppeld`;
    }

    return `
      <tr>
        <td>${escapeHtml(lu.name)}</td>
        <td>${lu.maxPts}</td>
        <td><strong>${earnedPts}</strong></td>
        ${sprintCells}
      </tr>
    `;
  }).join('');

  // Totaal rij HTML in tabel
  const totalRowHtml = `
    <tr class="total-row" id="matrix-total-row">
      <td>Totaal Voldoendes</td>
      <td>18</td>
      <td id="matrix-total-earned-cell" class="total-highlight">${totalEarnedOverall} / 18</td>
      ${sprintEarnedCounts.map(count => `<td class="${count > 0 ? 'sprint-col-has-points' : ''}">${count}</td>`).join('')}
    </tr>
  `;

  if (matrixBody) {
    matrixBody.innerHTML = rowsHtml + totalRowHtml;

    // Koppel click listeners aan de cell toggle buttons in admin modus
    if (isAdminMode) {
      const cellButtons = matrixBody.querySelectorAll(".matrix-cell-toggle");
      cellButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          const luCode = btn.getAttribute("data-lu");
          const sprintNum = parseInt(btn.getAttribute("data-sprint"), 10);
          btn.classList.add("pop-animate");
          toggleMatrixCell(luCode, sprintNum);
        });
      });
    } else {
      matrixBody.addEventListener("click", () => {
        showToast("Schakel Admin Modus in (knop rechtsboven) om beoordelingen handmatig aan te passen", "info");
      }, { once: true });
    }
  }

  // Update Admin Toolbar boven tabel
  const adminToolbarEl = document.getElementById("matrix-admin-toolbar");
  if (adminToolbarEl) {
    if (isAdminMode) {
      adminToolbarEl.className = "matrix-admin-toolbar is-admin-active";
      adminToolbarEl.innerHTML = `
        <div class="matrix-admin-info">
          <span class="matrix-admin-icon">✏️</span>
          <div>
            <h4 class="matrix-admin-title">
              Admin Beoordelingsmodus
              <span class="matrix-admin-badge">Actief</span>
            </h4>
            <p class="matrix-admin-desc">
              Klik op een cel om handmatig een fysiek behaalde <strong>"Voldoende (V)"</strong> van je docent in te voeren. Wijzigingen worden direct in LocalStorage bewaard.
            </p>
          </div>
        </div>
        <div class="matrix-admin-actions">
          <span class="matrix-toolbar-counter" title="Totaal aantal toegekende voldoendes">
            🎯 <span class="count-highlight">${totalEarnedOverall}</span> / 18 Voldoendes
          </span>
          <button type="button" id="btn-matrix-reset" class="matrix-toolbar-btn danger" title="Wis alle handmatige voldoendes">
            Wis Alles
          </button>
          <button type="button" id="btn-matrix-default" class="matrix-toolbar-btn" title="Zet terug naar beginstatus (Sprint 1 LU 1)">
            Standaard Herstellen
          </button>
        </div>
      `;

      const resetBtn = document.getElementById("btn-matrix-reset");
      if (resetBtn) {
        resetBtn.addEventListener("click", () => {
          if (confirm("Weet je zeker dat je alle handmatig ingevulde voldoendes wilt wissen?")) {
            matrixEvaluations = { "LU 1": {}, "LU 2": {}, "LU 3": {}, "LU 4": {}, "LU 5": {} };
            saveMatrixEvaluations();
            updateMatrixAndScore();
            showToast("Matrix leeggemaakt (0 / 18)", "info");
          }
        });
      }

      const defaultBtn = document.getElementById("btn-matrix-default");
      if (defaultBtn) {
        defaultBtn.addEventListener("click", () => {
          matrixEvaluations = { "LU 1": { 1: true }, "LU 2": {}, "LU 3": {}, "LU 4": {}, "LU 5": {} };
          saveMatrixEvaluations();
          updateMatrixAndScore();
          showToast("Standaard startwaarde hersteld (1 Voldoende in Sprint 1 voor LU 1)", "success");
        });
      }
    } else {
      adminToolbarEl.className = "matrix-admin-toolbar";
      adminToolbarEl.innerHTML = `
        <div class="matrix-admin-info">
          <span class="matrix-admin-icon">🔒</span>
          <div>
            <h4 class="matrix-admin-title">Alleen-lezen Matrixweergave</h4>
            <p class="matrix-admin-desc">
              De tabel toont je actuele behaalde beoordelingen. Schakel rechtsboven <strong>"Admin Modus"</strong> in om cellen aan te vinken.
            </p>
          </div>
        </div>
        <div class="matrix-admin-actions">
          <span class="matrix-toolbar-counter">
            🎯 <span class="count-highlight">${totalEarnedOverall}</span> / 18 Voldoendes
          </span>
        </div>
      `;
    }
  }

  const overallPercent = Math.min(100, Math.round((totalEarnedOverall / 18) * 100));

  // Update Real-time Voortgangskaart in de Matrix Sectie
  const matrixScoreNum = document.getElementById("matrix-progress-score-num");
  const matrixProgressFill = document.getElementById("matrix-progress-bar-fill");
  const matrixProgressPill = document.getElementById("matrix-progress-percent-pill");
  const matrixProgressDesc = document.getElementById("matrix-progress-status-desc");
  const matrixPercentAchieved = document.getElementById("matrix-percent-achieved");

  if (matrixScoreNum) {
    matrixScoreNum.textContent = totalEarnedOverall;
  }
  if (matrixProgressFill) {
    matrixProgressFill.style.width = `${overallPercent}%`;
  }
  if (matrixProgressPill) {
    matrixProgressPill.textContent = `${overallPercent}%`;
  }
  if (matrixProgressDesc) {
    if (totalEarnedOverall === 0) {
      matrixProgressDesc.textContent = "Nog geen voldoendes toegekend door docenten";
    } else if (totalEarnedOverall < 18) {
      matrixProgressDesc.textContent = `${totalEarnedOverall} van de 18 benodigde voldoendes behaald (${18 - totalEarnedOverall} te gaan)`;
    } else {
      matrixProgressDesc.textContent = "Alle 18 voldoendes behaald! Volledig gekwalificeerd voor assessment 🏆";
    }
  }

  if (totalEarnedCell) {
    totalEarnedCell.textContent = `${totalEarnedOverall} / 18`;
  }

  if (totalAchievedSummary) {
    totalAchievedSummary.textContent = `${totalEarnedOverall} / 18`;
  }

  if (matrixPercentAchieved) {
    matrixPercentAchieved.textContent = `${overallPercent}%`;
  }

  // Update Assessment Gauge Meter op Dashboard
  const gaugeScoreNum = document.getElementById("gauge-score-number");
  const gaugePercentText = document.getElementById("gauge-percent-text");
  const gaugeProgressArc = document.getElementById("gauge-progress-arc");
  const gaugeNeedleGroup = document.getElementById("gauge-needle-group");
  const gaugeStatusPill = document.getElementById("gauge-status-pill");
  const gaugeLusVoldaan = document.getElementById("gauge-lus-voldaan");
  const gaugeStoriesBehaald = document.getElementById("gauge-stories-behaald");

  if (gaugeScoreNum) {
    gaugeScoreNum.textContent = totalEarnedOverall;
  }

  if (gaugePercentText) {
    gaugePercentText.textContent = `${overallPercent}% behaald`;
  }

  if (gaugeProgressArc) {
    const totalArcLen = 238.76;
    const progressFraction = Math.min(totalEarnedOverall, 18) / 18;
    const offset = Math.max(0, totalArcLen - progressFraction * totalArcLen);
    gaugeProgressArc.style.strokeDashoffset = offset.toFixed(2);
  }

  if (gaugeNeedleGroup) {
    // -90deg is 0 voldoendes (links), 0deg is 9 (midterm), +90deg is 18 (einddoel)
    const angle = -90 + (Math.min(totalEarnedOverall, 18) / 18) * 180;
    gaugeNeedleGroup.setAttribute("transform", `rotate(${angle.toFixed(1)}, 100, 105)`);
  }

  if (gaugeStatusPill) {
    gaugeStatusPill.className = "gauge-status-pill";
    if (totalEarnedOverall === 0) {
      gaugeStatusPill.textContent = "Startfase (0 / 18 Voldoendes)";
    } else if (totalEarnedOverall < 5) {
      gaugeStatusPill.textContent = `Eerste beoordelingen (${totalEarnedOverall} / 18)`;
    } else if (totalEarnedOverall < 9) {
      gaugeStatusPill.textContent = `Voortgang naar midterm (${totalEarnedOverall} / 18)`;
    } else if (totalEarnedOverall === 9) {
      gaugeStatusPill.classList.add("achieved");
      gaugeStatusPill.textContent = `Midterm behaald (9 / 18)`;
    } else if (totalEarnedOverall < 18) {
      gaugeStatusPill.classList.add("achieved");
      gaugeStatusPill.textContent = `Goede voortgang (${totalEarnedOverall} / 18)`;
    } else {
      gaugeStatusPill.classList.add("achieved");
      gaugeStatusPill.textContent = `Volledig assessment behaald (18 / 18)! 🏆`;
    }
  }

  if (gaugeLusVoldaan) {
    gaugeLusVoldaan.textContent = `${voldaanLuCount} / 5 LU's`;
  }

  if (gaugeStoriesBehaald) {
    gaugeStoriesBehaald.textContent = `${totalEarnedOverall} / 18`;
  }

  // Update KPI Kaarten (zonder dubbele meter)
  if (kpiPtsVal) {
    kpiPtsVal.textContent = `${totalEarnedOverall} / 18 pt`;
  }

  if (kpiPtsSub) {
    kpiPtsSub.textContent = `${voldaanLuCount} van 5 LU's voldaan`;
  }

  if (kpiLiveStories) {
    kpiLiveStories.textContent = `${completedStoriesAll} / ${totalStoriesAll} Voltooid`;
  }

  const kpiStoriesTypesSub = document.getElementById("kpi-stories-types-sub");
  if (kpiStoriesTypesSub) {
    const rsCount = allStoriesData.filter(s => s.type === "RS").length;
    const usCount = allStoriesData.filter(s => s.type === "US").length;
    const lsCount = allStoriesData.filter(s => s.type === "LS").length;
    kpiStoriesTypesSub.textContent = `${rsCount} RS • ${usCount} US • ${lsCount} LS`;
  }
}

// 9. Render "Mijn Bewijzen" sectie met filters en zoekfunctie
function renderStories() {
  const container = document.getElementById("stories-container");
  const countElement = document.getElementById("filtered-count");
  if (!container) return;

  const filtered = allStoriesData.filter(item => {
    // LU Filter
    const matchesLu = currentLuFilter === "all" || item.lus.includes(currentLuFilter);
    // Type Filter (RS, US of LS)
    const matchesType = currentTypeFilter === "all" || item.type === currentTypeFilter;
    // Search Query
    const query = currentSearchQuery.toLowerCase().trim();
    const matchesSearch = !query || 
      item.title.toLowerCase().includes(query) ||
      item.story.toLowerCase().includes(query) ||
      item.sprint.toLowerCase().includes(query) ||
      item.lus.some(lu => lu.toLowerCase().includes(query)) ||
      (item.acceptatiecriteria && item.acceptatiecriteria.some(ac => ac.toLowerCase().includes(query))) ||
      (item.kwaliteitscriteria && item.kwaliteitscriteria.some(kc => kc.toLowerCase().includes(query)));

    return matchesLu && matchesType && matchesSearch;
  });

  if (countElement) {
    countElement.textContent = `${filtered.length} van de ${allStoriesData.length} bewijzen getoond`;
  }

  if (filtered.length === 0) {
    const isLsFilter = currentTypeFilter === "LS";
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1.5rem; background-color: var(--bg-card); border: 1px dashed var(--border-subtle); border-radius: var(--radius-lg);">
        <div style="font-size: 2.25rem; margin-bottom: 0.75rem;">${isLsFilter ? '🎓' : '🔍'}</div>
        <p style="font-size: 1.15rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.5rem;">
          ${isLsFilter ? 'Nog geen Learning Stories (LS) aangemaakt' : 'Geen stories of bewijzen gevonden'}
        </p>
        <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1.25rem; max-width: 540px; margin-left: auto; margin-right: auto; line-height: 1.5;">
          ${isLsFilter 
            ? 'Er zijn momenteel nog geen Learning Stories vastgelegd in de sprints. Als beheerder kun je via de beheerknop "+ Nieuwe Story Toevoegen" een Learning Story registreren gericht op je persoonlijke groei en AI-leerdoelen.' 
            : 'Er zijn geen items die voldoen aan je huidige filters of zoekopdracht.'}
        </p>
        <div style="display: flex; justify-content: center; gap: 0.75rem; flex-wrap: wrap;">
          <button id="reset-empty-btn" class="filter-btn" style="display: inline-block;">Toon alle bewijzen</button>
          ${isLsFilter && isAdminMode ? `<button id="btn-create-ls-empty" class="btn-dash primary" style="padding: 0.45rem 1rem; font-size: 0.85rem;">+ Eerste Learning Story Toevoegen</button>` : ''}
        </div>
      </div>
    `;
    const resetEmptyBtn = document.getElementById("reset-empty-btn");
    if (resetEmptyBtn) resetEmptyBtn.addEventListener("click", resetFilters);
    const createLsBtn = document.getElementById("btn-create-ls-empty");
    if (createLsBtn) {
      createLsBtn.addEventListener("click", () => {
        openAddStoryModal(0);
        const typeSelect = document.getElementById("form-story-type");
        if (typeSelect) {
          typeSelect.value = "LS";
          typeSelect.dispatchEvent(new Event("change"));
        }
      });
    }
    return;
  }

  container.innerHTML = filtered.map(story => {
    return `
      <article class="story-card" id="${story.id}">
        <div class="story-top">
          <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
            <span class="story-type-badge ${story.type.toLowerCase()}">${story.typeName} (${story.code})</span>
            <span class="story-sprint-badge">${story.sprint}</span>
          </div>

          ${isAdminMode ? `
            <select class="admin-inline-status-select" data-story-id="${story.id}" title="Wijzig status (Admin)">
              <option value="completed" ${story.statusType === 'completed' ? 'selected' : ''}>✓ Behaald (V)</option>
              <option value="progress" ${story.statusType === 'progress' ? 'selected' : ''}>⏳ In uitvoering</option>
              <option value="review" ${story.statusType === 'review' ? 'selected' : ''}>📋 Afgerond / Ter review</option>
              <option value="planned" ${story.statusType === 'planned' ? 'selected' : ''}>📅 Gepland</option>
            </select>
          ` : `
            <span class="status-pill ${story.statusType}">
              ${getStatusLabel(story.statusType)}
            </span>
          `}
        </div>

        <h3 class="story-title">${escapeHtml(story.title)}</h3>

        <div class="story-formula">
          "${escapeHtml(story.story)}"
        </div>

        <div class="story-lus">
          ${story.lus.map(lu => `<span class="story-lu-pill">${lu}</span>`).join('')}
        </div>

        <div class="criteria-preview">
          <div class="criteria-preview-title">Acceptatiecriteria (Preview):</div>
          <ul class="criteria-preview-list">
            ${story.acceptatiecriteria && story.acceptatiecriteria.length > 0 ? story.acceptatiecriteria.slice(0, 2).map(c => `
              <li><span class="dot">•</span> <span>${escapeHtml(c)}</span></li>
            `).join('') : '<li><span class="dot">•</span> <span>Geen criteria</span></li>'}
            ${story.acceptatiecriteria && story.acceptatiecriteria.length > 2 ? `<li style="font-size: 0.78rem; color: var(--accent-primary); font-weight: 600;">+ nog ${story.acceptatiecriteria.length - 2} criteria in detailweergave</li>` : ''}
          </ul>
        </div>

        <div class="story-footer">
          <div class="external-links-row">
            ${story.links && story.links.length > 0 ? story.links.map(link => `
              <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="ext-link-btn ${link.type}" title="${escapeHtml(link.note || link.label)}">
                <span>${getExternalIcon(link.type)}</span>
                <span>${escapeHtml(link.label.split(' ')[0])}</span>
                <span style="font-size: 0.7rem; opacity: 0.7;">↗</span>
              </a>
            `).join('') : `
              <span style="font-size: 0.75rem; color: var(--text-muted); font-style: italic;">Geen bestanden</span>
            `}

            ${isAdminMode ? `
              <button class="add-story-file-btn" data-story-id="${story.id}" title="Voeg bestand of link toe">
                + Bestand
              </button>
            ` : ''}
          </div>

          <button class="view-details-btn" data-story-id="${story.id}">
            <span>Bekijk criteria & details</span>
            <span>→</span>
          </button>
        </div>
      </article>
    `;
  }).join('');

  // Event handlers
  container.querySelectorAll(".view-details-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const storyId = btn.getAttribute("data-story-id");
      openStoryModal(storyId);
    });
  });

  container.querySelectorAll(".admin-inline-status-select").forEach(sel => {
    sel.addEventListener("change", (e) => {
      const storyId = sel.getAttribute("data-story-id");
      const newStatusType = sel.value;
      updateStoryStatus(storyId, newStatusType);
    });
  });

  container.querySelectorAll(".add-story-file-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const storyId = btn.getAttribute("data-story-id");
      openAddLinkModal(storyId);
    });
  });
}

function getExternalIcon(type) {
  switch (type) {
    case "onedrive": return "📁";
    case "github": return "💻";
    case "vercel": return "▲";
    case "youtube": return "▶";
    default: return "🔗";
  }
}

// 10. Filters & Zoeken
function initFilters() {
  const luButtons = document.querySelectorAll("[data-lu-filter]");
  luButtons.forEach(btn => {
    const filter = btn.getAttribute("data-lu-filter");
    if (filter === currentLuFilter) btn.classList.add("active");

    btn.addEventListener("click", () => {
      luButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentLuFilter = filter;
      localStorage.setItem("luc_portfolio_lu_filter", currentLuFilter);
      renderStories();
    });
  });

  const typeButtons = document.querySelectorAll("[data-type-filter]");
  typeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      typeButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentTypeFilter = btn.getAttribute("data-type-filter");
      renderStories();
    });
  });

  const searchInput = document.getElementById("search-stories-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      currentSearchQuery = e.target.value;
      renderStories();
    });
  }

  const resetBtn = document.getElementById("reset-filter-btn");
  if (resetBtn) resetBtn.addEventListener("click", resetFilters);

  document.querySelectorAll("[data-target-lu]").forEach(el => {
    el.addEventListener("click", (e) => {
      // Prevent double firing if clicking button inside card
      if (el.classList.contains("clickable-lu-card") && e.target.closest(".lu-filter-btn")) {
        return;
      }
      const targetLu = el.getAttribute("data-target-lu");
      if (targetLu) applyLuFilterDirectly(targetLu);
    });

    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const targetLu = el.getAttribute("data-target-lu");
        if (targetLu) applyLuFilterDirectly(targetLu);
      }
    });
  });
}

function applyLuFilterDirectly(luCode) {
  currentLuFilter = luCode;
  localStorage.setItem("luc_portfolio_lu_filter", currentLuFilter);

  document.querySelectorAll("[data-lu-filter]").forEach(b => {
    b.classList.toggle("active", b.getAttribute("data-lu-filter") === luCode);
  });

  renderStories();

  const projectSection = document.getElementById("projecten");
  if (projectSection) {
    projectSection.scrollIntoView({ behavior: "smooth" });
  }
}

function resetFilters() {
  currentLuFilter = "all";
  currentTypeFilter = "all";
  currentSearchQuery = "";
  localStorage.setItem("luc_portfolio_lu_filter", "all");

  document.querySelectorAll("[data-lu-filter]").forEach(b => {
    b.classList.toggle("active", b.getAttribute("data-lu-filter") === "all");
  });

  document.querySelectorAll("[data-type-filter]").forEach(b => {
    b.classList.toggle("active", b.getAttribute("data-type-filter") === "all");
  });

  const searchInput = document.getElementById("search-stories-input");
  if (searchInput) searchInput.value = "";

  renderStories();
}

// 11. Modal Popup voor Volledige Criteria & Story Details
function openStoryModal(storyId) {
  const story = allStoriesData.find(s => s.id === storyId);
  if (!story) return;

  const modal = document.getElementById("story-detail-modal");
  const modalBody = document.getElementById("modal-dynamic-body");
  if (!modal || !modalBody) return;

  modalBody.innerHTML = `
    <div class="modal-header">
      <div class="modal-badges">
        <span class="story-type-badge ${story.type.toLowerCase()}">${story.typeName} (${story.code})</span>
        <span class="story-sprint-badge">${story.sprint}</span>
        ${story.lus.map(lu => `<span class="story-lu-pill">${lu}</span>`).join('')}
      </div>
      <h2 class="modal-title">${escapeHtml(story.title)}</h2>
      
      <div style="display: flex; align-items: center; gap: 0.75rem; margin-top: 0.5rem; flex-wrap: wrap;">
        <span style="font-size: 0.85rem; color: var(--text-muted);">Status:</span>
        ${isAdminMode ? `
          <select id="modal-status-select" class="admin-inline-status-select">
            <option value="completed" ${story.statusType === 'completed' ? 'selected' : ''}>✓ Behaald (V)</option>
            <option value="progress" ${story.statusType === 'progress' ? 'selected' : ''}>⏳ In uitvoering</option>
            <option value="review" ${story.statusType === 'review' ? 'selected' : ''}>📋 Afgerond / Ter review</option>
            <option value="planned" ${story.statusType === 'planned' ? 'selected' : ''}>📅 Gepland</option>
          </select>
        ` : `
          <span class="status-pill ${story.statusType}">
            ${getStatusLabel(story.statusType)}
          </span>
        `}
      </div>
    </div>

    <div class="modal-story-quote">
      <strong>User / Learning Story Formule:</strong><br>
      "${escapeHtml(story.story)}"
    </div>

    <div class="modal-section">
      <h3 class="modal-section-title">
        <span>📋</span> Acceptatiecriteria
      </h3>
      <ol class="criteria-ol">
        ${story.acceptatiecriteria && story.acceptatiecriteria.length > 0 ? story.acceptatiecriteria.map(ac => `<li>${escapeHtml(ac)}</li>`).join('') : '<li>Nog geen acceptatiecriteria gespecificeerd</li>'}
      </ol>
    </div>

    <div class="modal-section">
      <h3 class="modal-section-title">
        <span>🎯</span> Kwaliteitscriteria
      </h3>
      <ol class="criteria-ol">
        ${story.kwaliteitscriteria && story.kwaliteitscriteria.length > 0 ? story.kwaliteitscriteria.map(kc => `<li>${escapeHtml(kc)}</li>`).join('') : '<li>Nog geen kwaliteitscriteria gespecificeerd</li>'}
      </ol>
    </div>

    <div class="modal-section">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
        <h3 class="modal-section-title" style="margin-bottom: 0;">
          <span>🌐</span> Bewijslast & Externe Bestanden
        </h3>
        ${isAdminMode ? `
          <button class="add-story-file-btn" id="modal-btn-add-link">
            + Bestand Toevoegen
          </button>
        ` : ''}
      </div>

      <div class="modal-ext-container">
        <div class="external-banner-note">
          <span>ℹ️</span> Grote bestanden (zoals video's of zware rapporten) worden via cloud links gekoppeld (OneDrive, GitHub, Vercel, YouTube).
        </div>
        
        ${story.links && story.links.length > 0 ? `
          <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-top: 0.5rem;">
            ${story.links.map(l => `
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.6rem 0.85rem; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); flex-wrap: wrap; gap: 0.5rem;">
                <div>
                  <div style="font-weight: 600; font-size: 0.9rem; color: var(--text-primary);">${getExternalIcon(l.type)} ${escapeHtml(l.label)}</div>
                  <div style="font-size: 0.78rem; color: var(--text-muted);">${escapeHtml(l.note || '')}</div>
                </div>
                <a href="${l.url}" target="_blank" rel="noopener noreferrer" class="ext-link-btn ${l.type}">
                  Openen ↗
                </a>
              </div>
            `).join('')}
          </div>
        ` : `
          <div style="text-align: center; padding: 1.5rem 1rem; color: var(--text-muted); font-size: 0.875rem;">
            Er zijn nog geen externe bewijzen of bestanden aan deze story gekoppeld.
          </div>
        `}
      </div>
    </div>
  `;

  // Status select handler in modal
  const modalStatusSelect = document.getElementById("modal-status-select");
  if (modalStatusSelect) {
    modalStatusSelect.addEventListener("change", (e) => {
      const newStatus = e.target.value;
      updateStoryStatus(story.id, newStatus);
    });
  }

  // Add link button inside modal
  const modalBtnAddLink = document.getElementById("modal-btn-add-link");
  if (modalBtnAddLink) {
    modalBtnAddLink.addEventListener("click", () => {
      closeStoryModal();
      openAddLinkModal(story.id);
    });
  }

  modal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeStoryModal() {
  const modal = document.getElementById("story-detail-modal");
  if (modal) {
    modal.classList.remove("open");
    document.body.style.overflow = "";
  }
}

// Toast Notificaties
function showToast(message, type = "info") {
  let toastContainer = document.getElementById("app-toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "app-toast-container";
    toastContainer.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 99999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
    `;
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement("div");
  toast.className = `app-toast toast-${type}`;
  toast.style.cssText = `
    background-color: var(--bg-surface-elevated, #1e293b);
    color: var(--text-primary, #ffffff);
    border: 1px solid var(--border-strong, #334155);
    border-left: 4px solid ${type === 'success' ? '#10b981' : (type === 'error' ? '#ef4444' : '#6366f1')};
    box-shadow: var(--shadow-lg, 0 10px 15px -3px rgba(0,0,0,0.2));
    border-radius: var(--radius-md, 8px);
    padding: 12px 18px;
    font-size: 0.85rem;
    font-weight: 600;
    max-width: 380px;
    display: flex;
    align-items: center;
    gap: 10px;
    transform: translateY(20px);
    opacity: 0;
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    pointer-events: auto;
  `;

  const icon = type === 'success' ? '✓' : (type === 'error' ? '✕' : 'ℹ');
  toast.innerHTML = `<span>${icon}</span><span>${escapeHtml(message)}</span>`;
  toastContainer.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.transform = "translateY(0)";
    toast.style.opacity = "1";
  });

  setTimeout(() => {
    toast.style.transform = "translateY(10px)";
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// 12. Modal: Nieuwe Story Toevoegen (Admin)
function updateSuggestedStoryCode() {
  const typeSelect = document.getElementById("form-story-type");
  const codeInput = document.getElementById("form-story-code");
  if (!typeSelect || !codeInput) return;

  const stType = typeSelect.value || "RS";
  const existingCount = allStoriesData.filter(s => s.type === stType).length + 1;
  codeInput.value = `${stType}-${existingCount < 10 ? '0' + existingCount : existingCount}`;
}

function openAddStoryModal(sprintIndex = 0) {
  const modal = document.getElementById("add-story-modal");
  const targetBadge = document.getElementById("modal-target-sprint-badge");
  const hiddenSprintIdx = document.getElementById("form-sprint-index");
  const form = document.getElementById("add-story-form");
  if (!modal || !form) return;

  const targetSprint = sprintsData[sprintIndex] || sprintsData[0];
  if (targetBadge) targetBadge.textContent = targetSprint.title.split(':')[0] || `Sprint ${targetSprint.number}`;
  if (hiddenSprintIdx) hiddenSprintIdx.value = sprintIndex;

  // Suggest story code (RS-0X, US-0X of LS-0X)
  updateSuggestedStoryCode();

  modal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeAddStoryModal() {
  const modal = document.getElementById("add-story-modal");
  if (modal) {
    modal.classList.remove("open");
    document.body.style.overflow = "";
  }
}

function initAddStoryForm() {
  const form = document.getElementById("add-story-form");
  const closeBtn = document.getElementById("add-story-close-btn");
  const cancelBtn = document.getElementById("btn-cancel-add-story");
  const typeSelect = document.getElementById("form-story-type");

  if (closeBtn) closeBtn.addEventListener("click", closeAddStoryModal);
  if (cancelBtn) cancelBtn.addEventListener("click", closeAddStoryModal);

  if (typeSelect) {
    typeSelect.addEventListener("change", updateSuggestedStoryCode);
  }

  const modal = document.getElementById("add-story-modal");
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeAddStoryModal();
    });
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const sprintIdx = parseInt(document.getElementById("form-sprint-index").value, 10);
      const storyType = document.getElementById("form-story-type").value; // RS, US of LS
      const code = document.getElementById("form-story-code").value.trim();
      const title = document.getElementById("form-story-title").value.trim();
      const formula = document.getElementById("form-story-formula").value.trim();
      const statusType = document.getElementById("form-story-status").value;

      // Checkboxes voor LU's
      const selectedLus = [];
      document.querySelectorAll("input[name='story-lu']:checked").forEach(cb => {
        selectedLus.push(cb.value);
      });
      if (selectedLus.length === 0) selectedLus.push("LU 1");

      // Acceptatiecriteria splitsen op regels
      const acceptatieRaw = document.getElementById("form-story-acceptatie").value;
      const acceptatiecriteria = acceptatieRaw
        .split("\n")
        .map(l => l.trim().replace(/^\d+[\.\)]\s*/, ''))
        .filter(l => l.length > 0);

      // Kwaliteitscriteria splitsen op regels
      const kwaliteitRaw = document.getElementById("form-story-kwaliteit").value;
      const kwaliteitscriteria = kwaliteitRaw
        .split("\n")
        .map(l => l.trim().replace(/^\d+[\.\)]\s*/, ''))
        .filter(l => l.length > 0);

      const targetSprint = sprintsData[sprintIdx];
      const typeName = storyType === "RS" ? "Research Story" : (storyType === "US" ? "User Story" : "Learning Story");

      const newStory = {
        id: `story-${Date.now()}`,
        code: code || `${storyType}-01`,
        type: storyType,
        typeName: typeName,
        sprint: `Sprint ${targetSprint.number}`,
        title: title,
        story: formula,
        lus: selectedLus,
        status: getStatusLabel(statusType),
        statusType: statusType,
        acceptatiecriteria: acceptatiecriteria.length > 0 ? acceptatiecriteria : ["Gedocumenteerd volgens richtlijnen."],
        kwaliteitscriteria: kwaliteitscriteria.length > 0 ? kwaliteitscriteria : ["Kwalitatief getoetst aan de minor normen."],
        links: []
      };

      targetSprint.stories.push(newStory);
      saveSprintsData();
      closeAddStoryModal();
      form.reset();

      renderActiveSprint();
      renderStories();
      renderDashboardFilesHub();
      updateMatrixAndScore();
      showToast(`${typeName} ${newStory.code} succesvol toegevoegd aan Sprint ${targetSprint.number}!`, "success");
    });
  }
}

// 13. Modal: Bewijsbestand / Link Toevoegen (Admin) & Bestanden Beheer
function openAddLinkModal(storyId) {
  const modal = document.getElementById("add-link-modal");
  const hiddenStoryId = document.getElementById("form-link-story-id");
  const storySelect = document.getElementById("form-link-story-select");
  const codeBadge = document.getElementById("modal-link-story-code");
  const titleP = document.getElementById("modal-link-story-title");
  if (!modal) return;

  // Vul dropdown met alle beschikbare stories
  if (storySelect) {
    storySelect.innerHTML = allStoriesData.map(st => `
      <option value="${st.id}" ${storyId && st.id === storyId ? 'selected' : ''}>
        ${st.code}: ${escapeHtml(st.title.substring(0, 48))}${st.title.length > 48 ? '...' : ''} (${st.sprint})
      </option>
    `).join('');

    storySelect.onchange = () => {
      const selectedId = storySelect.value;
      const targetStory = allStoriesData.find(s => s.id === selectedId);
      if (targetStory) {
        if (hiddenStoryId) hiddenStoryId.value = targetStory.id;
        if (codeBadge) codeBadge.textContent = targetStory.code;
        if (titleP) titleP.textContent = `Koppel een extern bewijsstuk aan: ${targetStory.title}`;
      }
    };
  }

  const effectiveStory = (storyId ? allStoriesData.find(s => s.id === storyId) : allStoriesData[0]) || allStoriesData[0];
  if (effectiveStory) {
    if (hiddenStoryId) hiddenStoryId.value = effectiveStory.id;
    if (storySelect) storySelect.value = effectiveStory.id;
    if (codeBadge) codeBadge.textContent = effectiveStory.code;
    if (titleP) titleP.textContent = `Koppel een extern bewijsstuk aan: ${effectiveStory.title}`;
  }

  modal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeAddLinkModal() {
  const modal = document.getElementById("add-link-modal");
  if (modal) {
    modal.classList.remove("open");
    document.body.style.overflow = "";
  }
}

function deleteStoryLink(storyId, linkIndex) {
  if (!confirm("Weet je zeker dat je dit bewijsstuk wilt verwijderen van deze story?")) return;
  sprintsData.forEach(sp => {
    const story = sp.stories.find(s => s.id === storyId);
    if (story && story.links && story.links[linkIndex] !== undefined) {
      story.links.splice(linkIndex, 1);
    }
  });
  saveSprintsData();
  updateAllStoriesData();
  renderActiveSprint();
  renderStories();
  renderDashboardFilesHub();
  updateMatrixAndScore();
  showToast("Bestand verwijderd van de story", "info");
}

function initAddLinkForm() {
  const form = document.getElementById("add-link-form");
  const closeBtn = document.getElementById("add-link-close-btn");
  const cancelBtn = document.getElementById("btn-cancel-add-link");

  if (closeBtn) closeBtn.addEventListener("click", closeAddLinkModal);
  if (cancelBtn) cancelBtn.addEventListener("click", closeAddLinkModal);

  const modal = document.getElementById("add-link-modal");
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeAddLinkModal();
    });
  }

  // Dashboard Hub "+ Bestand Toevoegen" knop
  const hubAddBtn = document.getElementById("btn-hub-add-link");
  if (hubAddBtn) {
    hubAddBtn.addEventListener("click", () => openAddLinkModal());
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const storySelect = document.getElementById("form-link-story-select");
      const hiddenStoryId = document.getElementById("form-link-story-id");
      const storyId = (storySelect && storySelect.value) ? storySelect.value : (hiddenStoryId ? hiddenStoryId.value : null);

      const linkType = document.getElementById("form-link-type").value;
      const label = document.getElementById("form-link-label").value.trim();
      const url = document.getElementById("form-link-url").value.trim();
      const note = document.getElementById("form-link-note").value.trim();

      if (!storyId || !url || !label) return;

      // Zoek en update de specifieke story in sprintsData
      let foundStory = null;
      for (const sp of sprintsData) {
        foundStory = sp.stories.find(s => s.id === storyId);
        if (foundStory) break;
      }

      if (foundStory) {
        if (!foundStory.links) foundStory.links = [];
        foundStory.links.push({
          type: linkType,
          label: label,
          url: url,
          note: note || label
        });

        saveSprintsData();
        updateAllStoriesData();
        closeAddLinkModal();
        form.reset();

        renderActiveSprint();
        renderStories();
        renderDashboardFilesHub();
        updateMatrixAndScore();
        showToast(`Bestand "${label}" gekoppeld aan ${foundStory.code} en direct zichtbaar op het dashboard!`, "success");
      }
    });
  }
}

// 14. Render Centraal Documentenoverzicht & Bewijzenhub op het Dashboard
function renderDashboardFilesHub() {
  const container = document.getElementById("files-hub-content");
  const countBadge = document.getElementById("files-hub-count");
  if (!container) return;

  // Verzamel alle bestanden en links van alle stories
  const allFiles = [];
  sprintsData.forEach(sprint => {
    sprint.stories.forEach(story => {
      if (story.links && story.links.length > 0) {
        story.links.forEach((link, linkIdx) => {
          allFiles.push({
            ...link,
            linkIndex: linkIdx,
            storyId: story.id,
            storyCode: story.code,
            storyTitle: story.title,
            storyType: story.type,
            typeName: story.typeName,
            sprint: story.sprint,
            lus: story.lus || []
          });
        });
      }
    });
  });

  if (countBadge) {
    countBadge.textContent = `${allFiles.length} ${allFiles.length === 1 ? 'bestand' : 'bestanden'} gekoppeld`;
  }

  if (allFiles.length === 0) {
    container.innerHTML = `
      <div class="files-hub-empty">
        <div class="empty-hub-icon">📂</div>
        <h4 class="empty-hub-title">Nog geen documenten of bewijsstukken gekoppeld</h4>
        <p class="empty-hub-desc">
          Zodra er bestanden (zoals OneDrive PDF onderzoeksrapporten, Python / GitHub code repositories, Vercel prototypes of YouTube demo's) aan stories worden gekoppeld, verschijnen ze hier in één centrale lijst zodat docenten en assessoren niet hoeven te zoeken.
        </p>
        <button class="btn-dash primary" id="btn-empty-hub-add" style="margin-top: 0.6rem;">
          <span>+ Eerste Bestand Koppelen</span>
        </button>
      </div>
    `;

    const emptyAddBtn = document.getElementById("btn-empty-hub-add");
    if (emptyAddBtn) {
      emptyAddBtn.addEventListener("click", () => openAddLinkModal());
    }
    return;
  }

  // Render lijst met bestanden inclusief duidelijke referentie naar story
  container.innerHTML = `
    <div class="files-hub-info-banner">
      <span class="hub-info-icon">⚡</span>
      <span class="hub-info-text">
        <strong>Direct gekoppeld aan stories:</strong> Ieder bestand dat je bij een story toevoegt, verschijnt automatisch hier. Docenten kunnen direct het bewijs openen of op de gekoppelde story klikken om alle criteria te zien.
      </span>
    </div>
    <div class="files-hub-list">
      ${allFiles.map(file => `
        <div class="file-hub-item" id="hub-file-${file.storyId}-${file.linkIndex}">
          <div class="file-hub-left">
            <div class="file-type-icon-box ${escapeHtml(file.type)}">
              ${getExternalIcon(file.type)}
            </div>
            <div class="file-info-col">
              <div class="file-title-row">
                <span class="file-name">${escapeHtml(file.label)}</span>
                <span class="file-type-tag ${escapeHtml(file.type)}">${escapeHtml(file.type.toUpperCase())}</span>
              </div>

              <!-- Duidelijke koppeling naar bijbehorende story -->
              <div class="file-story-reference-box" data-story-id="${file.storyId}" title="Klik om de volledige story & criteria van ${escapeHtml(file.storyCode)} te bekijken">
                <span class="file-story-prefix">Behoort tot story:</span>
                <span class="story-type-badge ${file.storyType ? file.storyType.toLowerCase() : 'rs'}" style="font-size: 0.72rem; padding: 0.1rem 0.45rem;">
                  ${escapeHtml(file.storyCode)}
                </span>
                <strong class="file-story-title-text">${escapeHtml(file.storyTitle)}</strong>
                <span class="file-story-sprint-tag">(${escapeHtml(file.sprint)})</span>
                <span class="file-story-arrow">↗</span>
              </div>

              <div class="file-meta-row">
                <div class="file-meta-lus">
                  <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: 600;">Gekoppelde LU's:</span>
                  ${file.lus.map(lu => `<span class="file-lu-chip">${escapeHtml(lu)}</span>`).join('')}
                </div>
                ${file.note && file.note !== file.label ? `
                  <span class="file-meta-divider">•</span>
                  <span class="file-note">Notitie: ${escapeHtml(file.note)}</span>
                ` : ''}
              </div>
            </div>
          </div>
          <div class="file-hub-right">
            <a href="${file.url}" target="_blank" rel="noopener noreferrer" class="btn-open-file ${escapeHtml(file.type)}" title="Open extern bewijsstuk in nieuw tabblad">
              <span>Document Openen</span>
              <span>↗</span>
            </a>
            ${isAdminMode ? `
              <button class="btn-delete-file" data-story-id="${file.storyId}" data-link-idx="${file.linkIndex}" title="Verwijder dit bestand van ${escapeHtml(file.storyCode)}">
                🗑️
              </button>
            ` : ''}
          </div>
        </div>
      `).join('')}
    </div>
  `;

  // Event handlers voor klikken op story referentie box
  container.querySelectorAll(".file-story-reference-box").forEach(box => {
    box.addEventListener("click", () => {
      const storyId = box.getAttribute("data-story-id");
      if (storyId) openStoryModal(storyId);
    });
  });

  // Event handlers voor verwijder knoppen
  container.querySelectorAll(".btn-delete-file").forEach(btn => {
    btn.addEventListener("click", () => {
      const storyId = btn.getAttribute("data-story-id");
      const linkIdx = parseInt(btn.getAttribute("data-link-idx"), 10);
      deleteStoryLink(storyId, linkIdx);
    });
  });
}

// 15. Navigatie, Mobiel Profielmenu (Drawer) & Paginaweergave
function initNavigation() {
  const mobileToggle = document.getElementById("mobile-nav-toggle") || document.getElementById("mobile-menu-toggle");
  const mobileDrawer = document.getElementById("mobile-nav-drawer");
  const mobileBackdrop = document.getElementById("mobile-nav-backdrop");
  const mobileCloseBtn = document.getElementById("mobile-drawer-close-btn");
  const mobileQrBtn = document.getElementById("mobile-btn-open-qr");

  function openMobileDrawer() {
    if (mobileDrawer) mobileDrawer.classList.add("open");
    if (mobileBackdrop) mobileBackdrop.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeMobileDrawer() {
    if (mobileDrawer) mobileDrawer.classList.remove("open");
    if (mobileBackdrop) mobileBackdrop.classList.remove("open");
    document.body.style.overflow = "";
  }

  if (mobileToggle) {
    mobileToggle.addEventListener("click", () => {
      if (mobileDrawer && mobileDrawer.classList.contains("open")) {
        closeMobileDrawer();
      } else {
        openMobileDrawer();
      }
    });
  }

  if (mobileCloseBtn) {
    mobileCloseBtn.addEventListener("click", closeMobileDrawer);
  }

  if (mobileBackdrop) {
    mobileBackdrop.addEventListener("click", closeMobileDrawer);
  }

  if (mobileDrawer) {
    mobileDrawer.querySelectorAll(".nav-link").forEach(link => {
      link.addEventListener("click", () => {
        closeMobileDrawer();
      });
    });
  }

  if (mobileQrBtn) {
    mobileQrBtn.addEventListener("click", () => {
      closeMobileDrawer();
      if (typeof window.openQrModal === "function") {
        window.openQrModal();
      } else {
        const qrModal = document.getElementById("qr-code-modal");
        if (qrModal) {
          qrModal.classList.add("open");
          qrModal.classList.add("active");
          document.body.style.overflow = "hidden";
        }
      }
    });
  }

  const visiblePageIds = ["dashboard", "over-mij", "documenten", "leeruitkomsten", "timeline", "contact"];

  function showPageFromHash() {
    const requestedPage = window.location.hash.slice(1);
    const activePageId = visiblePageIds.includes(requestedPage) ? requestedPage : "dashboard";

    document.querySelectorAll(".page-view").forEach(page => {
      page.classList.toggle("is-active", page.id === activePageId);
    });

    document.querySelectorAll(".nav-link").forEach(link => {
      link.classList.toggle("active", link.getAttribute("href") === `#${activePageId}`);
    });

    window.scrollTo({ top: 0, behavior: "auto" });
  }

  window.addEventListener("hashchange", showPageFromHash);
  showPageFromHash();
}

function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// 15. Gemini Portfolio Chatbot
function initGeminiChat() {
  const toggle = document.getElementById("gemini-chat-toggle");
  const close = document.getElementById("gemini-chat-close");
  const panel = document.getElementById("gemini-chat-panel");
  const form = document.getElementById("gemini-chat-form");
  const input = document.getElementById("gemini-chat-input");
  const messages = document.getElementById("gemini-chat-messages");
  const conversation = [];
  const supabase = getSupabaseClient();
  let chatUserId = null;

  if (!toggle || !panel || !form || !input || !messages) return;

  function setOpen(isOpen) {
    toggle.setAttribute("aria-expanded", String(isOpen));
    panel.hidden = !isOpen;
    if (isOpen) input.focus();
  }

  function createCopyButton(text) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "gemini-copy-btn";
    button.setAttribute("aria-label", "Kopieer antwoord naar klembord");
    button.title = "Kopieer antwoord naar klembord";
    button.dataset.copyText = text;
    button.innerHTML = `
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
      </svg>
      <span class="copy-label">Kopieer</span>
    `;
    return button;
  }

  function addMessage(text, role) {
    const message = document.createElement("div");
    message.className = `gemini-message ${role}`;

    if (role.includes("loading")) {
      const indicator = document.createElement("div");
      indicator.className = "gemini-typing-indicator";
      indicator.setAttribute("aria-label", "Assistent is aan het typen...");
      indicator.innerHTML = `<span></span><span></span><span></span>`;
      message.appendChild(indicator);
    } else {
      const content = document.createElement("div");
      content.className = "gemini-message-content";
      content.textContent = text;
      message.appendChild(content);

      if (role.includes("assistant")) {
        message.appendChild(createCopyButton(text));
      }
    }

    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
    return message;
  }

  function fallbackCopyText(text, onSuccess) {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      textArea.style.top = "-9999px";
      textArea.setAttribute("readonly", "");
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      onSuccess();
    } catch (err) {
      console.warn("Kopiëren via fallback is mislukt:", err);
    }
  }

  messages.addEventListener("click", (e) => {
    const copyBtn = e.target.closest(".gemini-copy-btn");
    if (!copyBtn) return;
    const messageEl = copyBtn.closest(".gemini-message");
    const contentEl = messageEl?.querySelector(".gemini-message-content");
    const textToCopy = copyBtn.dataset.copyText || contentEl?.innerText?.trim() || "";
    if (!textToCopy) return;

    const handleSuccess = () => {
      copyBtn.classList.add("copied");
      const label = copyBtn.querySelector(".copy-label");
      if (label) label.textContent = "Gekopieerd!";
      setTimeout(() => {
        copyBtn.classList.remove("copied");
        if (label) label.textContent = "Kopieer";
      }, 2000);
    };

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(textToCopy).then(handleSuccess).catch(() => {
        fallbackCopyText(textToCopy, handleSuccess);
      });
    } else {
      fallbackCopyText(textToCopy, handleSuccess);
    }
  });

  function loadLocalChatHistory() {
    try {
      const localData = localStorage.getItem("luc_portfolio_chat_history");
      if (!localData) return;
      const history = JSON.parse(localData);
      if (Array.isArray(history) && history.length > 0) {
        messages.innerHTML = "";
        history.forEach(({ role, content }) => {
          conversation.push({
            role: role === "assistant" ? "model" : "user",
            parts: [{ text: content }]
          });
          addMessage(content, role);
        });
      }
    } catch (_) {}
  }

  function saveLocalChatMessage(role, content) {
    try {
      const localData = localStorage.getItem("luc_portfolio_chat_history");
      const history = localData ? JSON.parse(localData) : [];
      history.push({ role, content });
      localStorage.setItem("luc_portfolio_chat_history", JSON.stringify(history.slice(-50)));
    } catch (_) {}
  }

  async function initializeChatHistory() {
    if (!supabase) {
      loadLocalChatHistory();
      return;
    }

    try {
      const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
      if (sessionErr) throw sessionErr;
      let user = sessionData?.session?.user;

      if (!user) {
        const { data, error } = await supabase.auth.signInAnonymously();
        if (error) throw error;
        user = data?.user;
      }

      chatUserId = user?.id || null;
      if (!chatUserId) {
        loadLocalChatHistory();
        return;
      }

      const { data: savedMessages, error } = await supabase
        .from("chat_messages")
        .select("role, content")
        .eq("user_id", chatUserId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      if (!savedMessages?.length) {
        loadLocalChatHistory();
        return;
      }

      messages.innerHTML = "";
      savedMessages.forEach(({ role, content }) => {
        conversation.push({
          role: role === "assistant" ? "model" : "user",
          parts: [{ text: content }]
        });
        addMessage(content, role);
      });
    } catch (e) {
      console.warn("Supabase geschiedenis ophalen mislukt, val terug op browseropslag:", e.message);
      loadLocalChatHistory();
    }
  }

  async function saveChatMessage(role, content) {
    saveLocalChatMessage(role, content);
    if (!supabase || !chatUserId) return;

    try {
      const { error } = await supabase.from("chat_messages").insert({
        user_id: chatUserId,
        role,
        content
      });

      if (error) console.warn("Chatbericht kon niet worden opgeslagen in Supabase:", error.message);
    } catch (err) {
      console.warn("Fout bij opslaan in Supabase:", err.message);
    }
  }

  function getPortfolioContext() {
    const pageText = document.body.innerText
      .replace(/Vraag de portfolio-assistent[\s\S]*?(?=Story Details Modal|$)/i, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    return pageText.slice(0, 50000);
  }

  function cleanAssistantAnswer(answer) {
    return answer
      .replace(/\n{3,}/g, "\n\n")
      .replace(/^\s*#{1,6}\s*/gm, "")
      .trim();
  }

  toggle.addEventListener("click", () => setOpen(panel.hidden));
  if (close) close.addEventListener("click", () => setOpen(false));

  const chatHistoryReady = initializeChatHistory().catch((error) => {
    console.warn("Chatgeschiedenis kon niet worden geladen:", error.message);
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    await chatHistoryReady;
    const question = input.value.trim();

    if (!question) return;

    addMessage(question, "user");
    await saveChatMessage("user", question);
    input.value = "";
    input.disabled = true;
    const loadingMessage = addMessage("", "assistant loading");
    conversation.push({ role: "user", parts: [{ text: question }] });

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: `Je bent de vriendelijke portfolio-assistent van Luc Meijerink. Beantwoord alleen de concrete vraag van de bezoeker in het Nederlands op basis van de actuele portfolio-context hieronder. Gebruik uitsluitend feiten uit deze context, tenzij de bezoeker expliciet om algemene uitleg vraagt. Als iets niet in de context staat, zeg dat eerlijk.

Houd elk antwoord overzichtelijk:
- maximaal 2 korte alinea's of maximaal 5 korte bullets;
- begin direct met het antwoord;
- gebruik een korte kop alleen als dat echt helpt;
- herhaal niet de volledige context en voeg geen ongevraagde details toe;
- schrijf helder, vriendelijk en zonder lange inleiding.

ACTUELE PORTFOLIO-CONTEXT:
${getPortfolioContext()}`,
          contents: conversation
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "Gemini kon geen antwoord geven.");

      const rawAnswer = data.answer || "";
      const answer = cleanAssistantAnswer(rawAnswer);
      if (!answer) throw new Error("Gemini gaf een leeg antwoord.");
      conversation.push({ role: "model", parts: [{ text: answer }] });
      loadingMessage.classList.remove("loading");
      loadingMessage.innerHTML = "";
      const content = document.createElement("div");
      content.className = "gemini-message-content";
      content.textContent = answer;
      loadingMessage.appendChild(content);
      loadingMessage.appendChild(createCopyButton(answer));
      messages.scrollTop = messages.scrollHeight;
      await saveChatMessage("assistant", answer);
    } catch (error) {
      conversation.pop();
      loadingMessage.classList.remove("loading");
      loadingMessage.innerHTML = "";
      const content = document.createElement("div");
      content.className = "gemini-message-content";
      content.textContent = `Er ging iets mis: ${error.message}`;
      loadingMessage.appendChild(content);
      messages.scrollTop = messages.scrollHeight;
    } finally {
      input.disabled = false;
      input.focus();
    }
  });
}

// 15. PDF Export & Assessment Rapport Print Functionaliteit
function initExportPdf() {
  const exportBtn = document.getElementById("btn-export-pdf");
  const exportBtnTop = document.getElementById("btn-export-pdf-top");

  function triggerPdfExport() {
    // 1. Zorg dat de afdrukdatum actueel en netjes geformatteerd is in het Nederlands
    const dateEl = document.getElementById("print-date-display");
    if (dateEl) {
      const now = new Date();
      dateEl.textContent = now.toLocaleDateString("nl-NL", {
        day: "numeric",
        month: "long",
        year: "numeric"
      });
    }

    // 2. Garandeer dat alle scores, gauges en matrix cellen up-to-date gerenderd zijn
    updateMatrixAndScore();
    renderDashboardFilesHub();

    // 3. Toon behulpzame feedback via toast
    showToast("Afdrukvenster geopend. Selecteer 'Opslaan als PDF' om je assessmentdossier te downloaden.", "info");

    // 4. Roep browser print dialoog aan na korte timeout voor soepele UI-transitie
    setTimeout(() => {
      window.print();
    }, 280);
  }

  if (exportBtn) {
    exportBtn.addEventListener("click", (e) => {
      e.preventDefault();
      triggerPdfExport();
    });
  }

  if (exportBtnTop) {
    exportBtnTop.addEventListener("click", (e) => {
      e.preventDefault();
      triggerPdfExport();
    });
  }

  // Ondersteun ook sneltoets (Ctrl+P / Cmd+P) door datum bij te werken voor het printen
  window.addEventListener("beforeprint", () => {
    const dateEl = document.getElementById("print-date-display");
    if (dateEl) {
      const now = new Date();
      dateEl.textContent = now.toLocaleDateString("nl-NL", {
        day: "numeric",
        month: "long",
        year: "numeric"
      });
    }
  });
}

// ==========================================================================
// 19. Huidige Focus Widget
// Leest automatisch de actieve sprint en de story die als 'In uitvoering' staat uit,
// zodat bezoekers en assessoren direct zien waar Luc momenteel aan werkt.
// ==========================================================================
function renderCurrentFocusWidget() {
  const container = document.getElementById("focus-story-content");
  const sprintBadge = document.getElementById("focus-sprint-badge");
  if (!container) return;

  // Bepaal de actieve sprint volgens datum of actieve status
  const autoIdx = getAutoSprintIndex();
  let activeSprint = sprintsData.find(s => s.statusType === "active") || sprintsData[autoIdx] || sprintsData[0];

  // Zoek eerst in de actieve sprint naar een story die 'In uitvoering' staat
  let focusStory = activeSprint.stories ? activeSprint.stories.find(s => s.statusType === "progress") : null;

  // Fallback: zoek over alle sprints naar een story die 'In uitvoering' staat
  if (!focusStory) {
    for (const sp of sprintsData) {
      if (sp.stories) {
        const found = sp.stories.find(s => s.statusType === "progress");
        if (found) {
          focusStory = found;
          activeSprint = sp;
          break;
        }
      }
    }
  }

  // Tweede fallback: als er geen enkele story 'In uitvoering' staat, pak de eerste story van de actieve sprint
  if (!focusStory && activeSprint.stories && activeSprint.stories.length > 0) {
    focusStory = activeSprint.stories[0];
  }

  if (sprintBadge) {
    sprintBadge.textContent = `Sprint ${activeSprint.number} (${activeSprint.weeks})`;
  }

  if (!focusStory) {
    container.innerHTML = `
      <div class="focus-empty-state">
        <span class="focus-empty-icon">🎯</span>
        <p class="focus-empty-text">Geen actieve story in uitvoering in Sprint ${activeSprint.number}. Bekijk de sprint timeline voor geplande taken.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="focus-story-card" data-focus-story-id="${focusStory.id}" title="Klik om volledige criteria en details te bekijken">
      <div class="focus-story-top">
        <span class="focus-code-badge ${focusStory.type.toLowerCase()}">${escapeHtml(focusStory.code)}</span>
        <span class="focus-status-tag">
          <span class="focus-spinner-icon">⏳</span> ${escapeHtml(focusStory.status || "In uitvoering")}
        </span>
      </div>
      <h4 class="focus-story-title">${escapeHtml(focusStory.title)}</h4>
      <p class="focus-story-desc">${escapeHtml(focusStory.story || "")}</p>
      <div class="focus-story-footer">
        <div class="focus-lu-tags">
          ${(focusStory.lus || []).map(lu => `<span class="focus-lu-tag">${escapeHtml(lu)}</span>`).join("")}
        </div>
        <button type="button" class="focus-view-btn" aria-label="Bekijk details van ${escapeHtml(focusStory.code)}">
          <span>Details</span> →
        </button>
      </div>
    </div>
  `;

  const card = container.querySelector(".focus-story-card");
  if (card) {
    card.addEventListener("click", () => {
      openStoryModal(focusStory.id);
    });
  }
}

// ==========================================================================
// 20. QR-Code Widget & Modal voor Fysieke Gesprekken en Assessoren
// ==========================================================================
async function initPortfolioQrCode() {
  const thumbImg = document.getElementById("profile-qr-thumb-img");
  const largeImg = document.getElementById("qr-modal-large-img");
  const urlInput = document.getElementById("qr-portfolio-url-input");
  const openBtn = document.getElementById("btn-open-qr-modal");
  const thumbFrame = document.getElementById("qr-thumb-frame");
  const qrBox = document.getElementById("profile-portfolio-qr");
  const modal = document.getElementById("qr-code-modal");
  const closeBtn = document.getElementById("qr-modal-close-btn");
  const copyBtn = document.getElementById("btn-copy-portfolio-url");
  const directLink = document.getElementById("qr-modal-open-newtab");
  const downloadBtn = document.getElementById("qr-modal-download-btn");

  // Bepaal de live URL van het digitale portfolio
  const currentUrl = window.location.href.split("#")[0];

  if (urlInput) {
    urlInput.value = currentUrl;
  }

  if (directLink) {
    directLink.href = currentUrl;
  }

  // Genereer haarscherpe QR-code data URL met de QRCode client-side library
  try {
    const qrDataUrl = await QRCode.toDataURL(currentUrl, {
      width: 440,
      margin: 1,
      color: {
        dark: "#0f172a",
        light: "#ffffff"
      },
      errorCorrectionLevel: "M"
    });

    if (thumbImg) thumbImg.src = qrDataUrl;
    if (largeImg) largeImg.src = qrDataUrl;
    if (downloadBtn) {
      downloadBtn.href = qrDataUrl;
      downloadBtn.download = "portfolio-qr-luc-meijerink.png";
    }
  } catch (err) {
    console.warn("Kon QRCode niet lokaal genereren, gebruik fallback:", err);
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(currentUrl)}&margin=1`;
    if (thumbImg) thumbImg.src = qrApiUrl;
    if (largeImg) largeImg.src = qrApiUrl;
    if (downloadBtn) downloadBtn.href = qrApiUrl;
  }

  function openQrModal() {
    if (modal) {
      modal.classList.add("open");
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  }
  window.openQrModal = openQrModal;

  function closeQrModal() {
    if (modal) {
      modal.classList.remove("open");
      modal.classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  // Openen via specifieke 'Vergroot QR-code' knop
  if (openBtn) {
    openBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      openQrModal();
    });
  }

  // Openen via thumbnail frame
  if (thumbFrame) {
    thumbFrame.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      openQrModal();
    });
  }

  // Openen via klik op de gehele QR-box
  if (qrBox) {
    qrBox.addEventListener("click", (e) => {
      // Voorkom dubbele trigger als direct op knop of thumbnail geklikt is
      if (!e.target.closest("#btn-open-qr-modal") && !e.target.closest("#qr-thumb-frame")) {
        openQrModal();
      }
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      closeQrModal();
    });
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeQrModal();
    });
  }

  if (copyBtn && urlInput) {
    copyBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      try {
        await navigator.clipboard.writeText(urlInput.value);
        showToast("Portfolio link gekopieerd naar klembord!", "success");
        copyBtn.textContent = "Gekopieerd! ✓";
        setTimeout(() => {
          copyBtn.textContent = "Kopieer URL";
        }, 2000);
      } catch (err) {
        urlInput.select();
        document.execCommand("copy");
        showToast("Portfolio link gekopieerd!", "success");
      }
    });
  }
}

function applySiteContent() {
  if (!window.PORTFOLIO_CONTENT) return;

  const content = window.PORTFOLIO_CONTENT;

  if (content.site?.title) {
    document.title = content.site.title;
  }

  const brandName = document.querySelector(".brand-name");
  if (brandName && content.site?.brand) {
    brandName.textContent = content.site.brand;
  }

  const dashboardBadge = document.getElementById("dash-sprint-badge-text");
  if (dashboardBadge && content.pages?.dashboard?.badge) {
    dashboardBadge.textContent = content.pages.dashboard.badge;
  }

  const dashboardTitle = document.querySelector(".dash-hero-title");
  if (dashboardTitle && content.pages?.dashboard?.heroTitle) {
    dashboardTitle.textContent = content.pages.dashboard.heroTitle;
  }

  const dashboardLead = document.querySelector(".dash-hero-lead");
  if (dashboardLead && content.pages?.dashboard?.heroLead) {
    dashboardLead.textContent = content.pages.dashboard.heroLead;
  }

  const aboutTitle = document.querySelector("#over-mij .section-title");
  if (aboutTitle && content.pages?.about?.sectionTitle) {
    aboutTitle.textContent = content.pages.about.sectionTitle;
  }

  const aboutSubtitle = document.querySelector("#over-mij .section-subtitle");
  if (aboutSubtitle && content.pages?.about?.subtitle) {
    aboutSubtitle.textContent = content.pages.about.subtitle;
  }

  const aboutIntroName = document.querySelector("#over-mij .about-intro-card h3");
  if (aboutIntroName && content.pages?.about?.introName) {
    aboutIntroName.textContent = content.pages.about.introName;
  }

  const aboutIntroRole = document.querySelector("#over-mij .about-role");
  if (aboutIntroRole && content.pages?.about?.introRole) {
    aboutIntroRole.textContent = content.pages.about.introRole;
  }

  const aboutIntroText = document.querySelector("#over-mij .about-intro-card p:not(.about-role)");
  if (aboutIntroText && content.pages?.about?.introText) {
    aboutIntroText.textContent = content.pages.about.introText;
  }

  const aboutMotivationTitle = document.querySelector("#over-mij .about-story-block h3");
  if (aboutMotivationTitle && content.pages?.about?.motivationTitle) {
    aboutMotivationTitle.textContent = content.pages.about.motivationTitle;
  }

  const aboutMotivationText = document.querySelector("#over-mij .about-story-block p");
  if (aboutMotivationText && content.pages?.about?.motivationText) {
    aboutMotivationText.textContent = content.pages.about.motivationText;
  }

  const documentsTitle = document.querySelector("#documenten .section-title");
  if (documentsTitle && content.pages?.documents?.sectionTitle) {
    documentsTitle.textContent = content.pages.documents.sectionTitle;
  }

  const documentsSubtitle = document.querySelector("#documenten .section-subtitle");
  if (documentsSubtitle && content.pages?.documents?.subtitle) {
    documentsSubtitle.textContent = content.pages.documents.subtitle;
  }

  const learningTitle = document.querySelector("#leeruitkomsten .section-title");
  if (learningTitle && content.pages?.learning?.sectionTitle) {
    learningTitle.textContent = content.pages.learning.sectionTitle;
  }

  const learningSubtitle = document.querySelector("#leeruitkomsten .section-subtitle");
  if (learningSubtitle && content.pages?.learning?.subtitle) {
    learningSubtitle.textContent = content.pages.learning.subtitle;
  }

  const contactTitle = document.querySelector("#contact .section-title");
  if (contactTitle && content.pages?.contact?.sectionTitle) {
    contactTitle.textContent = content.pages.contact.sectionTitle;
  }

  const contactSubtitle = document.querySelector("#contact .section-subtitle");
  if (contactSubtitle && content.pages?.contact?.subtitle) {
    contactSubtitle.textContent = content.pages.contact.subtitle;
  }

  const contactIntroTitle = document.querySelector("#contact .contact-card h3");
  if (contactIntroTitle && content.pages?.contact?.introTitle) {
    contactIntroTitle.textContent = content.pages.contact.introTitle;
  }

  const contactIntroText = document.querySelector("#contact .contact-card p");
  if (contactIntroText && content.pages?.contact?.introText) {
    contactIntroText.textContent = content.pages.contact.introText;
  }

  const footerBrand = document.querySelector(".footer-brand");
  if (footerBrand && content.site?.footerBrand) {
    footerBrand.textContent = content.site.footerBrand;
  }

  const footerMeta = document.querySelector(".footer-meta");
  if (footerMeta && content.site?.footerMeta) {
    footerMeta.textContent = content.site.footerMeta;
  }

  const footerCta = document.querySelector(".footer-links .nav-link");
  if (footerCta && content.pages?.footer?.cta) {
    footerCta.textContent = content.pages.footer.cta;
  }

  const footerLogo = document.querySelector(".footer-logo img");
  if (footerLogo && content.pages?.footer?.images?.logo) {
    footerLogo.src = content.pages.footer.images.logo;
  }
}

// Initialisatie bij Pagina Laden
document.addEventListener("DOMContentLoaded", () => {
  applySiteContent();
  initTheme();
  initNavigation();
  initAdminMode();
  initTimeline();
  initFilters();
  renderStories();
  renderDashboardFilesHub();
  updateMatrixAndScore();
  renderCurrentFocusWidget();
  initPortfolioQrCode();
  initGeminiChat();
  initAddStoryForm();
  initAddLinkForm();
  initExportPdf();
  syncPortfolioDataFromCloud();

  const storyModal = document.getElementById("story-detail-modal");
  if (storyModal) {
    storyModal.addEventListener("click", (e) => {
      if (e.target === storyModal) closeStoryModal();
    });
  }

  const modalCloseBtn = document.getElementById("modal-close-btn");
  if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeStoryModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeStoryModal();
      closeAddStoryModal();
      closeAddLinkModal();
      const authModal = document.getElementById("admin-auth-modal");
      if (authModal && (authModal.classList.contains("active") || authModal.classList.contains("open"))) {
        authModal.classList.remove("active");
        authModal.classList.remove("open");
        document.body.style.overflow = "";
      }
      const mobileDrawer = document.getElementById("mobile-nav-drawer");
      const mobileBackdrop = document.getElementById("mobile-nav-backdrop");
      if (mobileDrawer && mobileDrawer.classList.contains("open")) {
        mobileDrawer.classList.remove("open");
        if (mobileBackdrop) mobileBackdrop.classList.remove("open");
        document.body.style.overflow = "";
      }
      const qrModal = document.getElementById("qr-code-modal");
      if (qrModal && (qrModal.classList.contains("active") || qrModal.classList.contains("open"))) {
        qrModal.classList.remove("active");
        qrModal.classList.remove("open");
        document.body.style.overflow = "";
      }
    }
    if (e.key === "ArrowLeft") {
      const prevBtn = document.getElementById("timeline-prev-btn");
      if (prevBtn && currentSprintIndex > 0) {
        currentSprintIndex--;
        updateTimelineView();
      }
    }
    if (e.key === "ArrowRight") {
      const nextBtn = document.getElementById("timeline-next-btn");
      if (nextBtn && currentSprintIndex < sprintsData.length - 1) {
        currentSprintIndex++;
        updateTimelineView();
      }
    }
  });
});
