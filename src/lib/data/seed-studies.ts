import type { PublicAsk, PublicCredit, PublicStudy } from "./types";

export const FIELDS = [
  { name: "Aerospace", slug: "aerospace" },
  { name: "Marine", slug: "marine" },
  { name: "Energy", slug: "energy" },
  { name: "Astronomy", slug: "astronomy" },
  { name: "Materials", slug: "materials" },
  { name: "Physics", slug: "physics" },
] as const;

export const EXAMPLE_STUDIES: PublicStudy[] = [
  {
    id: "ex-su34",
    slug: "su-34m-dynamic-pressure-limit",
    title: "Dynamic pressure envelope for a Su-34M-class airframe before structural limit",
    question:
      "At what indicated airspeed and altitude combinations does dynamic pressure approach published open-literature structural limits for a Su-34M-class airframe?",
    field: "Aerospace",
    fieldSlug: "aerospace",
    tags: ["aerodynamics", "dynamic-pressure", "open-literature"],
    origin: "ai_generated",
    status: "published",
    isExample: true,
    readingTimeMin: 11,
    likeCount: 42,
    dislikeCount: 3,
    commentCount: 2,
    publishedAt: "2026-10-10T16:00:00.000Z",
    reviewedBy: "A. Patton",
    reviewedAt: "2026-10-10T15:30:00.000Z",
    versionNo: 1,
    headlineValue: 78.5,
    headlineUnit: "kPa",
    uncertainty: "±8%",
    confidence: "moderate",
    keyAssumption:
      "Uses public ISA atmosphere and generic fighter-bomber limit loads; not manufacturer structural data.",
    content: {
      answerSummary:
        "Under the International Standard Atmosphere, dynamic pressure q = ½ρV² reaches about 78.5 kPa (±8%) near Mach 1.2 at 5 km altitude for a Su-34M-class airframe modeled with open-literature mass and planform proxies. That value sits near published generic fighter structural design envelopes found in textbooks, not classified Su-34 limits. Results are comparative and educational; they are not flight clearance data.",
      methodology: {
        approach:
          "Analytic dynamic-pressure sweep across altitude and Mach using ISA density, with a coarse structural-limit comparison against open textbook envelopes.",
        software: "SymPy + Pint (urte-compute)",
        softwareVersion: "2026.10",
        modelType: "analytic / ISA atmosphere",
        settings: "Altitude 0–15 km; Mach 0.4–1.6; 50×40 grid; SI units throughout.",
        validation: "Compared peak q to published generic fighter design q ranges in open aerodynamics texts.",
      },
      assumptions: [
        "ISA (no temperature deviations or humidity).",
        "Airspeed converted via standard compressible relations for the Mach grid.",
        "Structural comparison uses generic open-literature fighter envelopes, not Su-34 OEM data.",
        "No weapons employment, targeting, or classified performance modeling.",
      ],
      limitations: [
        "Not validated against Sukhoi structural documentation.",
        "Ignores gust loads, control-surface limits, and aeroelastic modes.",
        "Example seed data for URTE demonstration only.",
      ],
      equations: [
        {
          latex: "q = \\tfrac{1}{2}\\rho(h) V^2",
          symbols: [
            { symbol: "q", meaning: "dynamic pressure", unit: "Pa" },
            { symbol: "\\rho", meaning: "air density from ISA", unit: "kg/m^3" },
            { symbol: "V", meaning: "true airspeed", unit: "m/s" },
            { symbol: "h", meaning: "geopotential altitude", unit: "m" },
          ],
        },
      ],
      positives: [
        "Transparent analytic model with SI units and reproducible grid.",
        "Stays within open-literature physics (no targeting or classified data).",
      ],
      negatives: [
        "Cannot certify flight envelopes without OEM structural allowables.",
        "Compressible corrections are simplified near transonic regimes.",
      ],
      neutrals: [
        "Results are educational comparisons, not operational guidance.",
        "Uncertainty dominated by density model and generic limit assumptions.",
      ],
      comparisons: [
        { label: "This model (5 km, M 1.2)", value: 78.5, unit: "kPa", pctDiff: 0 },
        {
          label: "Generic fighter design q (textbook band mid)",
          value: 80,
          unit: "kPa",
          reference: "Open aerodynamics texts",
          pctDiff: -1.9,
        },
        {
          label: "Sea-level M 0.9 proxy",
          value: 52.1,
          unit: "kPa",
          pctDiff: -33.6,
        },
      ],
      parameters: [
        {
          name: "Reference altitude",
          symbol: "h",
          value: 5000,
          unit: "m",
          source: "Scenario choice",
          uncertainty: "n/a",
        },
        {
          name: "Mach number",
          symbol: "M",
          value: 1.2,
          unit: "1",
          source: "Scenario choice",
        },
      ],
      conclusion:
        "Open-literature dynamic pressure near 78.5 kPa at 5 km and Mach 1.2 approaches generic fighter structural design bands. Exact Su-34M limits remain proprietary and are out of scope.",
      disclosure: "AI-generated draft reviewed by A. Patton. Numbers from deterministic tools only.",
      diagramKind: "aircraft",
    },
    citations: [
      {
        ordinal: 1,
        type: "standard",
        title: "U.S. Standard Atmosphere, 1976",
        authors: "NOAA / NASA / USAF",
        year: 1976,
        reliabilityTier: "primary",
      },
      {
        ordinal: 2,
        type: "book",
        title: "Introduction to Flight (dynamic pressure discussion)",
        authors: "Anderson, J. D.",
        year: 2015,
        reliabilityTier: "authoritative",
      },
      {
        ordinal: 3,
        type: "government",
        title: "NASA technical reports on dynamic pressure envelopes (open)",
        year: 2005,
        reliabilityTier: "primary",
        url: "https://ntrs.nasa.gov",
      },
      {
        ordinal: 4,
        type: "web",
        title: "ISA density tables (educational)",
        year: 2024,
        reliabilityTier: "secondary",
      },
      {
        ordinal: 5,
        type: "journal",
        title: "Open literature survey of fighter airframe load factors",
        year: 2012,
        reliabilityTier: "secondary",
      },
    ],
    charts: [
      {
        id: "su34-q-mach",
        kind: "line",
        title: "Dynamic pressure vs Mach at 5 km",
        x: [0.4, 0.6, 0.8, 1.0, 1.2, 1.4, 1.6],
        y: [8.7, 19.6, 34.9, 54.5, 78.5, 106.8, 139.5],
        xLabel: "Mach",
        yLabel: "q (kPa)",
      },
    ],
    comments: [
      {
        id: "c1",
        author: "reader_aero",
        body: "Helpful that this stays in open-literature physics.",
        createdAt: "2026-10-11T12:00:00.000Z",
        helpfulCount: 4,
      },
      {
        id: "c2",
        author: "student_22",
        body: "Would love a gust-load extension in a later version.",
        createdAt: "2026-10-12T09:15:00.000Z",
        helpfulCount: 2,
      },
    ],
  },
  {
    id: "ex-sub",
    slug: "submarine-performance-vs-water-temperature",
    title: "How seawater temperature shifts density and drag on a generic submarine hull",
    question:
      "How would a generic submarine hull’s drag and required shaft power change across typical ocean temperatures?",
    field: "Marine",
    fieldSlug: "marine",
    tags: ["TEOS-10", "drag", "oceanography"],
    origin: "ai_assisted",
    status: "published",
    isExample: true,
    readingTimeMin: 10,
    likeCount: 31,
    dislikeCount: 1,
    commentCount: 1,
    publishedAt: "2026-10-12T18:00:00.000Z",
    reviewedBy: "A. Patton",
    reviewedAt: "2026-10-12T17:40:00.000Z",
    versionNo: 1,
    headlineValue: 3.8,
    headlineUnit: "%",
    uncertainty: "±0.6 pp",
    confidence: "moderate-high",
    keyAssumption: "Fixed salinity 35 g/kg; TEOS-10 density; quadratic drag model.",
    content: {
      answerSummary:
        "Using TEOS-10 seawater density at 35 g/kg salinity, cooling from 20 °C to 2 °C raises density by about 0.3% and, under a quadratic drag model at fixed speed, increases required shaft power by roughly 3.8% (±0.6 percentage points) for a generic teardrop hull proxy. Viscosity changes dominate the power shift more than density alone.",
      methodology: {
        approach: "TEOS-10 density and viscosity lookup, then quadratic drag and propulsive power estimate.",
        software: "gsw (TEOS-10) + SciPy (urte-compute)",
        softwareVersion: "2026.10",
        modelType: "analytic / empirical drag",
        settings: "T = 2–20 °C; S = 35 g/kg; U = 5 m/s; Cd fixed baseline with Re correction.",
        validation: "Density checked against published TEOS-10 reference points.",
      },
      assumptions: [
        "Constant salinity 35 g/kg.",
        "Hull form approximated as a generic teardrop (not a class-specific boat).",
        "Propulsive efficiency held constant across the temperature sweep.",
      ],
      limitations: [
        "Ignores boundary-layer transition details and appendages.",
        "No acoustic or thermal signature modeling.",
        "Example seed data for URTE demonstration only.",
      ],
      equations: [
        {
          latex: "D = \\tfrac{1}{2}\\rho C_D A U^2",
          symbols: [
            { symbol: "D", meaning: "drag force", unit: "N" },
            { symbol: "\\rho", meaning: "seawater density", unit: "kg/m^3" },
            { symbol: "C_D", meaning: "drag coefficient", unit: "1" },
            { symbol: "A", meaning: "reference area", unit: "m^2" },
            { symbol: "U", meaning: "speed through water", unit: "m/s" },
          ],
        },
      ],
      positives: [
        "Uses TEOS-10, an authoritative seawater standard.",
        "Clear separation of density vs viscosity effects.",
      ],
      negatives: [
        "Hull Cd is a proxy, not tank-tested for a real class.",
        "Constant efficiency understates real propulsor behavior.",
      ],
      neutrals: [
        "Temperature effects are modest at cruise speeds modeled here.",
        "Results scale with assumed Cd and area.",
      ],
      comparisons: [
        { label: "Power delta 20→2 °C (this study)", value: 3.8, unit: "%", pctDiff: 0 },
        {
          label: "Density-only estimate",
          value: 0.3,
          unit: "%",
          reference: "TEOS-10 Δρ",
          pctDiff: -92,
        },
      ],
      parameters: [
        {
          name: "Salinity",
          symbol: "S",
          value: 35,
          unit: "g/kg",
          source: "Typical ocean mean",
        },
        {
          name: "Speed",
          symbol: "U",
          value: 5,
          unit: "m/s",
          source: "Scenario",
        },
      ],
      conclusion:
        "Colder seawater raises required shaft power by a few percent at fixed speed for this generic hull; viscosity effects outweigh density alone.",
      disclosure: "AI-assisted; human revised methodology notes. Example data.",
      diagramKind: "submarine",
    },
    citations: [
      {
        ordinal: 1,
        type: "standard",
        title: "TEOS-10: Thermodynamic Equation of Seawater 2010",
        authors: "IOC / SCOR / IAPSO",
        year: 2010,
        reliabilityTier: "primary",
      },
      {
        ordinal: 2,
        type: "journal",
        title: "gsw: Python implementation of TEOS-10",
        year: 2015,
        reliabilityTier: "authoritative",
      },
      {
        ordinal: 3,
        type: "book",
        title: "Principles of Naval Architecture (drag chapters)",
        year: 1988,
        reliabilityTier: "authoritative",
      },
      {
        ordinal: 4,
        type: "government",
        title: "NOAA seawater property tables",
        year: 2020,
        reliabilityTier: "primary",
      },
      {
        ordinal: 5,
        type: "web",
        title: "UNESCO TEOS-10 primers",
        year: 2022,
        reliabilityTier: "secondary",
      },
    ],
    charts: [
      {
        id: "sub-power-t",
        kind: "line",
        title: "Relative shaft power vs temperature",
        x: [2, 5, 8, 11, 14, 17, 20],
        y: [1.038, 1.031, 1.024, 1.017, 1.011, 1.005, 1.0],
        xLabel: "T (°C)",
        yLabel: "P / P₂₀°C",
      },
    ],
    comments: [
      {
        id: "c3",
        author: "ocean_nerd",
        body: "Nice use of TEOS-10 — thank you for citing it.",
        createdAt: "2026-10-13T10:00:00.000Z",
        helpfulCount: 5,
      },
    ],
  },
  {
    id: "ex-pluto",
    slug: "delta-v-to-pluto-chemical-vs-ntp-vs-ion",
    title: "Δv and energy to reach Pluto: chemical, nuclear-thermal, and ion options",
    question:
      "What approximate Δv and propellant mass fraction are required to reach Pluto with chemical, nuclear-thermal, and ion propulsion architectures?",
    field: "Astronomy",
    fieldSlug: "astronomy",
    tags: ["orbital-mechanics", "propulsion", "poliastro"],
    origin: "human",
    status: "published",
    isExample: true,
    readingTimeMin: 12,
    likeCount: 57,
    dislikeCount: 2,
    commentCount: 3,
    publishedAt: "2026-10-14T20:00:00.000Z",
    reviewedBy: "A. Patton",
    reviewedAt: "2026-10-14T19:45:00.000Z",
    versionNo: 1,
    headlineValue: 16.2,
    headlineUnit: "km/s",
    uncertainty: "±1.5 km/s",
    confidence: "moderate",
    keyAssumption: "Patched-conic Hohmann-like transfer from LEO; no gravity assists.",
    content: {
      answerSummary:
        "A simplified patched-conic transfer from LEO to Pluto without gravity assists needs on the order of 16.2 km/s (±1.5) of impulsive Δv. Chemical stages imply very high propellant mass fractions; nuclear-thermal improves Isp and mass fraction; ion propulsion reduces propellant mass dramatically but stretches trip time to multi-decade coasts under the thrust levels modeled here.",
      methodology: {
        approach: "Patched-conic Δv budget with rocket equation mass fractions for three Isp classes.",
        software: "poliastro / astropy + Pint (urte-compute)",
        softwareVersion: "2026.10",
        modelType: "analytic orbital mechanics",
        settings: "LEO 200 km; Pluto circular proxy at 39.5 AU; no assists; coast arcs ideal.",
        validation: "Compared Δv order-of-magnitude to published New Horizons–class discussions.",
      },
      assumptions: [
        "No planetary gravity assists.",
        "Impulsive burns for chemical/NTP; low-thrust approximation for ion with equivalent Δv.",
        "Structural mass fractions held constant across architectures.",
      ],
      limitations: [
        "Real missions use assists and launch-vehicle C₃; those reduce spacecraft Δv.",
        "Ion trip-time model is coarse.",
        "Example seed data for URTE demonstration only.",
      ],
      equations: [
        {
          latex: "m_f / m_0 = e^{-\\Delta v / (I_{sp} g_0)}",
          symbols: [
            { symbol: "\\Delta v", meaning: "ideal velocity change", unit: "m/s" },
            { symbol: "I_{sp}", meaning: "specific impulse", unit: "s" },
            { symbol: "g_0", meaning: "standard gravity", unit: "m/s^2" },
          ],
        },
      ],
      positives: [
        "Side-by-side architecture comparison with explicit Isp assumptions.",
        "Numbers tied to deterministic orbital tools.",
      ],
      negatives: [
        "Omitting assists overstates spacecraft Δv versus flown missions.",
        "Ion power system mass not fully modeled.",
      ],
      neutrals: [
        "Trade space is educational; mission design would optimize launch date and assists.",
        "Uncertainty band reflects ephemeris and burn-model simplifications.",
      ],
      comparisons: [
        {
          label: "Chemical (Isp 450 s) mass ratio m0/mf",
          value: 39,
          unit: "1",
          pctDiff: 0,
        },
        {
          label: "NTP (Isp 900 s) mass ratio",
          value: 6.3,
          unit: "1",
          pctDiff: -83.8,
        },
        {
          label: "Ion (Isp 3000 s) mass ratio",
          value: 1.73,
          unit: "1",
          pctDiff: -95.6,
        },
      ],
      parameters: [
        {
          name: "Transfer Δv (no assists)",
          symbol: "\\Delta v",
          value: 16200,
          unit: "m/s",
          source: "poliastro patched conic",
          uncertainty: "±1500",
        },
      ],
      conclusion:
        "Without assists, Pluto transfers demand large Δv; Isp dominates propellant mass. Gravity assists (as flown) remain essential for chemical architectures.",
      disclosure: "Human-authored example study for URTE seed content.",
      diagramKind: "trajectory",
    },
    citations: [
      {
        ordinal: 1,
        type: "journal",
        title: "New Horizons mission design overview",
        year: 2008,
        reliabilityTier: "primary",
      },
      {
        ordinal: 2,
        type: "government",
        title: "NASA JPL Horizons ephemerides",
        year: 2024,
        reliabilityTier: "primary",
        url: "https://ssd.jpl.nasa.gov/horizons/",
      },
      {
        ordinal: 3,
        type: "book",
        title: "Fundamentals of Astrodynamics",
        authors: "Bate, Mueller, White",
        year: 1971,
        reliabilityTier: "authoritative",
      },
      {
        ordinal: 4,
        type: "standard",
        title: "poliastro documentation — Hohmann and patched conics",
        year: 2024,
        reliabilityTier: "authoritative",
      },
      {
        ordinal: 5,
        type: "government",
        title: "NASA NTP concept studies (open)",
        year: 2019,
        reliabilityTier: "primary",
      },
    ],
    charts: [
      {
        id: "pluto-mass-ratio",
        kind: "bar",
        title: "Propellant mass ratio vs propulsion class",
        x: [1, 2, 3],
        y: [39, 6.3, 1.73],
        xLabel: "Architecture (1 chem, 2 NTP, 3 ion)",
        yLabel: "m₀ / m_f",
      },
    ],
    comments: [
      {
        id: "c4",
        author: "orbiter",
        body: "Would be great to add a Jupiter-assist case in v2.",
        createdAt: "2026-10-15T08:00:00.000Z",
        helpfulCount: 7,
      },
    ],
  },
];

export const EXAMPLE_ASKS: PublicAsk[] = [
  {
    id: "ask-demo-1",
    question: "How much heat does a re-entering 1 m sphere absorb at 7.8 km/s from 120 km?",
    scopeNotes: "Earth atmosphere, ballistic coefficient ~50 kg/m², peak heat flux only.",
    field: "Aerospace",
    status: "approved",
    voteCount: 12,
    createdAt: "2026-10-16T10:00:00.000Z",
    scheduledFriday: "2026-10-24",
    timeline: [
      { status: "submitted", at: "2026-10-16T10:00:00.000Z" },
      { status: "under_review", at: "2026-10-16T18:00:00.000Z" },
      {
        status: "approved",
        at: "2026-10-17T12:00:00.000Z",
        note: "Scheduled for Friday batch (estimated)",
      },
    ],
  },
];

export const CREDITS: PublicCredit[] = [
  {
    personName: "Alexander Patton",
    role: "Founder — design, engineering, research, moderation",
    description:
      "Sole contributor for URTE v1: product direction, implementation, review of AI drafts, and content policy.",
  },
];

export function getStudyBySlug(slug: string): PublicStudy | undefined {
  return EXAMPLE_STUDIES.find((s) => s.slug === slug);
}

export function searchStudies(query: string): PublicStudy[] {
  const q = query.trim().toLowerCase();
  if (!q) return EXAMPLE_STUDIES.filter((s) => s.status === "published");
  return EXAMPLE_STUDIES.filter((s) => {
    if (s.status !== "published") return false;
    const hay = `${s.title} ${s.question} ${s.field} ${s.tags.join(" ")} ${s.content.answerSummary}`.toLowerCase();
    return hay.includes(q) || q.split(/\s+/).every((tok) => hay.includes(tok));
  });
}
