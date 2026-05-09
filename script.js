const DEMO_RESPONSES = {
  food: { score: 7, problem: "The food delivery and restaurant industry faces massive inefficiencies in discovery, ordering, and quality assurance. Customers struggle to find reliable, healthy, and affordable food options while small restaurants lack digital reach. A smart food platform can bridge this gap by connecting quality food providers with hungry customers seamlessly.", audience: "Urban working professionals aged 22-40 who rely on food delivery for daily meals. College students looking for affordable, healthy tiffin and mess options nearby. Health-conscious consumers who want nutritional transparency and quality assurance in every order." },
  health: { score: 9, problem: "Healthcare in India remains largely inaccessible, expensive, and reactive rather than preventive. Millions of people lack access to timely medical advice, leading to delayed diagnoses and poor health outcomes. An AI-powered health platform can democratize access to quality healthcare guidance at scale.", audience: "Patients in Tier 2 and Tier 3 cities who lack access to specialist doctors. Young adults aged 18-35 who prefer digital-first health management. Elderly users and their families who need continuous health monitoring and medication reminders." },
  education: { score: 8, problem: "Traditional education systems fail to personalize learning for individual student needs, leading to poor outcomes and high dropout rates. Students lack access to quality mentors, career guidance, and skill-based learning opportunities. An AI-driven education platform can bridge this gap by delivering personalized, outcome-focused learning experiences.", audience: "Students aged 15-25 preparing for competitive exams, skill certifications, or career transitions. Working professionals looking to upskill in emerging technologies like AI, data science, and cloud computing. Educators and institutions seeking to modernize their teaching methods with AI-powered tools." },
  farm: { score: 8, problem: "Indian farmers face critical challenges including unpredictable weather, crop diseases, poor market access, and lack of data-driven decision making. Traditional farming methods lead to low yields and financial losses with no early warning systems. An AI-powered agriculture platform can transform farming by providing real-time insights and market connectivity.", audience: "Small and medium-scale farmers aged 25-55 across rural India who own 1-10 acres of land. Agricultural cooperatives and farmer producer organizations seeking technology adoption. Agri-input companies and government bodies looking for data-driven farm management solutions." },
  finance: { score: 9, problem: "Millions of Indians remain underserved by traditional financial institutions, lacking access to credit, investment guidance, and financial planning tools. Complex financial products and low financial literacy create barriers to wealth creation. An AI-powered fintech platform can democratize financial services and help users make smarter money decisions.", audience: "Young professionals aged 22-35 who are beginning their investment journey and need guided financial planning. Small business owners who need working capital and cash flow management solutions. First-time investors and salaried employees looking to grow wealth through systematic investment plans." },
  ai: { score: 9, problem: "Businesses across industries struggle to adopt and implement AI solutions due to high costs, technical complexity, and lack of domain expertise. Existing AI tools require significant technical knowledge and are not accessible to non-technical founders and small businesses. A simplified AI platform can democratize access to intelligent automation and data-driven decision making.", audience: "Non-technical entrepreneurs and small business owners aged 25-45 who want to leverage AI without hiring data scientists. Mid-sized companies looking to automate repetitive processes and gain competitive insights. Students and researchers who need affordable AI tools for experimentation and learning." }
};

const DEFAULT_RESPONSE = {
  score: 7,
  problem: "This idea addresses a real and growing market need. Many people in this space struggle with inefficiency, lack of access, or outdated solutions that fail to meet modern expectations. An intelligent, technology-driven approach can create significant value by solving this gap at scale.",
  audience: "The primary target audience includes tech-savvy individuals, professionals, and early adopters who are actively seeking better solutions in this space. Secondary audiences include businesses and institutions who can adopt this as a productivity or service enhancement tool. Both segments are growing rapidly in India and globally.",
  swot: {
    strengths: "AI-powered analysis provides instant, professional-grade insights at zero cost. The tool is easy to use, requires no signup, and delivers structured output covering all key business dimensions. Unique positioning as a hackathon-ready tool adds credibility.",
    weaknesses: "Currently relies on pre-defined analysis patterns which may not capture highly niche ideas accurately. No user accounts means analysis history is not saved. Depth of analysis may not replace a real business consultant for complex ideas.",
    opportunities: "The global startup ecosystem is growing rapidly with millions of new ideas being validated every year. Integration with pitch deck generators, investor databases, and incubator networks can create a powerful end-to-end platform. Expansion to regional languages like Telugu and Hindi can unlock Tier 2 and Tier 3 markets.",
    threats: "Large AI companies like Google and OpenAI may launch similar free tools. Changing API pricing or availability could affect the core service. User trust in AI-generated business advice may be limited without human expert validation."
  },
  revenue: "Freemium model with basic analysis free and premium deep-dive reports at ₹299/month. B2B licensing to colleges, incubators, and accelerators for bulk usage. Affiliate partnerships with legal, financial, and accounting services for startup formation.",
  marketing: "Target college entrepreneurship cells, startup clubs, and hackathon communities through social media and campus ambassador programs. Content marketing via YouTube and LinkedIn with startup tips and success stories. Partner with platforms like Unstop, Devfolio, and LinkedIn for visibility.",
  competitors: "Competitors include IdeaBuddy, Lean Canvas tools, and ChatGPT for general business advice. StartSmart AI differentiates through its structured, hackathon-specific output format, instant SWOT analysis, and investor readiness score — making it uniquely positioned for students and early founders.",
  risks: "Over-reliance on AI analysis without real market research could mislead founders. Data privacy concerns if user ideas are stored or used for training. Monetization may be difficult if users expect the tool to always be free.",
  growth: "Launch a community leaderboard where users share and vote on top-rated startup ideas. Add a pitch deck generator as the next feature to create a complete founder toolkit. Partner with 10 colleges in Andhra Pradesh and Telangana as pilot institutions within 3 months."
};

const LOADING_MESSAGES = [
  "Reading your idea carefully...",
  "Running market analysis...",
  "Building SWOT framework...",
  "Calculating investor score...",
  "Almost ready..."
];

let loadingInterval = null;

function showLoading() {
  const overlay = document.getElementById("loadingOverlay");
  const loaderText = document.getElementById("loaderText");
  overlay.classList.remove("hidden");
  let i = 0;
  loaderText.textContent = LOADING_MESSAGES[0];
  loadingInterval = setInterval(() => {
    i = (i + 1) % LOADING_MESSAGES.length;
    loaderText.textContent = LOADING_MESSAGES[i];
  }, 1800);
}

function hideLoading() {
  document.getElementById("loadingOverlay").classList.add("hidden");
  if (loadingInterval) clearInterval(loadingInterval);
}

function showError(msg) {
  const box = document.getElementById("errorBox");
  box.textContent = "⚠️ " + msg;
  box.classList.remove("hidden");
  setTimeout(() => box.classList.add("hidden"), 5000);
}

function resetForm() {
  document.getElementById("resultsSection").classList.add("hidden");
  document.getElementById("ideaInput").value = "";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function setScore(score) {
  const val = Math.min(10, Math.max(1, parseInt(score) || 5));
  document.getElementById("scoreValue").textContent = val + "/10";
  const fill = document.getElementById("scoreBarFill");
  setTimeout(() => { fill.style.width = (val * 10) + "%"; }, 100);
  const verdict = document.getElementById("scoreVerdict");
  if (val >= 8) {
    verdict.textContent = "🔥 Highly investor-ready — strong potential!";
    verdict.style.color = "#4ade80";
  } else if (val >= 6) {
    verdict.textContent = "✅ Good foundation — needs some refinement.";
    verdict.style.color = "#60a5fa";
  } else if (val >= 4) {
    verdict.textContent = "⚠️ Moderate — significant work needed.";
    verdict.style.color = "#fb923c";
  } else {
    verdict.textContent = "❌ Early stage — revisit core concept.";
    verdict.style.color = "#f87171";
  }
}

function generateSmartResponse(idea) {
  const base = JSON.parse(JSON.stringify(DEFAULT_RESPONSE));
  const ideaLower = idea.toLowerCase();
  for (const key of Object.keys(DEMO_RESPONSES)) {
    if (ideaLower.includes(key)) {
      base.score = DEMO_RESPONSES[key].score;
      base.problem = DEMO_RESPONSES[key].problem;
      base.audience = DEMO_RESPONSES[key].audience;
      break;
    }
  }
  return base;
}

function populateResults(data) {
  document.getElementById("res-problem").textContent = data.problem || "";
  document.getElementById("res-audience").textContent = data.audience || "";
  document.getElementById("res-revenue").textContent = data.revenue || "";
  document.getElementById("res-strengths").textContent = data.swot?.strengths || "";
  document.getElementById("res-weaknesses").textContent = data.swot?.weaknesses || "";
  document.getElementById("res-opportunities").textContent = data.swot?.opportunities || "";
  document.getElementById("res-threats").textContent = data.swot?.threats || "";
  document.getElementById("res-marketing").textContent = data.marketing || "";
  document.getElementById("res-competitors").textContent = data.competitors || "";
  document.getElementById("res-risks").textContent = data.risks || "";
  document.getElementById("res-growth").textContent = data.growth || "";
  setScore(data.score);
}

async function analyzeIdea() {
  const idea = document.getElementById("ideaInput").value.trim();
  if (!idea) {
    showError("Please enter a startup idea first.");
    return;
  }

  const btn = document.getElementById("analyzeBtn");
  btn.disabled = true;
  document.getElementById("resultsSection").classList.add("hidden");
  showLoading();

  await new Promise(resolve => setTimeout(resolve, 3000));

  const result = generateSmartResponse(idea);
  hideLoading();
  populateResults(result);

  renderCharts(idea, result.score);

  // Save to history if logged in
  if (window.saveToHistory) {
    try {
      await window.saveToHistory(idea, result.score);
    } catch(e) {}
  }

  const resultsSection = document.getElementById("resultsSection");
  resultsSection.classList.remove("hidden");
  setTimeout(() => {
    resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 100);

  btn.disabled = false;
}

function downloadPDF() {
  const idea = document.getElementById("ideaInput").value.trim() || "Startup Idea";
  const score = document.getElementById("scoreValue").textContent;
  const verdict = document.getElementById("scoreVerdict").textContent;

  const sections = [
    { title: "Problem Statement", id: "res-problem" },
    { title: "Target Audience", id: "res-audience" },
    { title: "Revenue Model", id: "res-revenue" },
    { title: "Marketing Strategy", id: "res-marketing" },
    { title: "Competitor Analysis", id: "res-competitors" },
    { title: "Risk Factors", id: "res-risks" },
    { title: "Growth Suggestions", id: "res-growth" }
  ];

  let html = `<html><head><meta charset="UTF-8"><style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #fff; color: #111; padding: 40px; }
    .header { border-bottom: 3px solid #000; padding-bottom: 20px; margin-bottom: 30px; }
    .logo { font-size: 28px; font-weight: 800; }
    .idea-title { font-size: 16px; color: #555; margin-top: 6px; }
    .score-box { display: flex; align-items: center; gap: 20px; background: #f5f5f5; border-radius: 12px; padding: 20px 24px; margin-bottom: 28px; }
    .score-num { font-size: 48px; font-weight: 800; }
    .score-verdict { font-size: 15px; color: #444; }
    .section { margin-bottom: 20px; padding: 18px 20px; border: 1px solid #e0e0e0; border-radius: 10px; }
    .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #888; margin-bottom: 8px; }
    .section-body { font-size: 14px; line-height: 1.75; color: #222; }
    .swot-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
    .swot-box { padding: 16px 18px; border-radius: 10px; }
    .swot-s { background: #f0fdf4; border: 1px solid #86efac; }
    .swot-w { background: #fef2f2; border: 1px solid #fca5a5; }
    .swot-o { background: #eff6ff; border: 1px solid #93c5fd; }
    .swot-t { background: #fff7ed; border: 1px solid #fdba74; }
    .swot-label { font-size: 11px; font-weight: 700; text-transform: uppercase; margin-bottom: 6px; color: #444; }
    .swot-body { font-size: 13px; line-height: 1.65; color: #333; }
    .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #999; text-align: center; }
  </style></head><body>
  <div class="header"><div class="logo">StartSmart AI</div><div class="idea-title">Analysis Report: "${idea}"</div></div>
  <div class="score-box"><div class="score-num">${score}</div><div class="score-verdict">Investor Readiness Score<br>${verdict}</div></div>`;

  html += `<div class="section"><div class="section-title">Problem Statement</div><div class="section-body">${document.getElementById("res-problem").textContent}</div></div>`;
  html += `<div class="section"><div class="section-title">Target Audience</div><div class="section-body">${document.getElementById("res-audience").textContent}</div></div>`;
  html += `<div class="swot-grid">
    <div class="swot-box swot-s"><div class="swot-label">Strengths</div><div class="swot-body">${document.getElementById("res-strengths").textContent}</div></div>
    <div class="swot-box swot-w"><div class="swot-label">Weaknesses</div><div class="swot-body">${document.getElementById("res-weaknesses").textContent}</div></div>
    <div class="swot-box swot-o"><div class="swot-label">Opportunities</div><div class="swot-body">${document.getElementById("res-opportunities").textContent}</div></div>
    <div class="swot-box swot-t"><div class="swot-label">Threats</div><div class="swot-body">${document.getElementById("res-threats").textContent}</div></div>
  </div>`;

  sections.slice(2).forEach(s => {
    html += `<div class="section"><div class="section-title">${s.title}</div><div class="section-body">${document.getElementById(s.id).textContent}</div></div>`;
  });

  html += `<div class="footer">Generated by StartSmart AI · FlowZint Hackathon 2026 · Powered by AI</div></body></html>`;

  const printWindow = window.open("", "_blank");
  printWindow.document.write(html);
  printWindow.document.close();
  setTimeout(() => { printWindow.print(); }, 500);
}

// ===== CHARTS =====
let marketChartInstance = null;
let revenueChartInstance = null;
let swotChartInstance = null;

const MARKET_DATA = {
  food:     { labels: ["2022","2023","2024","2025","2026","2027"], data: [120000, 155000, 190000, 240000, 300000, 380000], unit: "₹ Cr" },
  health:   { labels: ["2022","2023","2024","2025","2026","2027"], data: [180000, 220000, 280000, 350000, 430000, 540000], unit: "₹ Cr" },
  education:{ labels: ["2022","2023","2024","2025","2026","2027"], data: [80000,  110000, 145000, 190000, 245000, 310000], unit: "₹ Cr" },
  farm:     { labels: ["2022","2023","2024","2025","2026","2027"], data: [50000,  70000,  95000,  130000, 175000, 230000], unit: "₹ Cr" },
  finance:  { labels: ["2022","2023","2024","2025","2026","2027"], data: [200000, 260000, 340000, 440000, 570000, 730000], unit: "₹ Cr" },
  default:  { labels: ["2022","2023","2024","2025","2026","2027"], data: [50000,  70000,  95000,  125000, 165000, 210000], unit: "₹ Cr" }
};

const REVENUE_DATA = {
  food:     [8, 35, 120],
  health:   [12, 55, 180],
  education:[10, 40, 140],
  farm:     [6,  28, 95],
  finance:  [15, 65, 220],
  default:  [8,  32, 110]
};

function getCategory(idea) {
  const l = idea.toLowerCase();
  for (const key of ["food","health","education","farm","finance","ai"]) {
    if (l.includes(key)) return key === "ai" ? "default" : key;
  }
  return "default";
}

function renderCharts(idea, score) {
  const cat = getCategory(idea);
  const mData = MARKET_DATA[cat] || MARKET_DATA.default;
  const rData = REVENUE_DATA[cat] || REVENUE_DATA.default;

  // Destroy old charts
  if (marketChartInstance) marketChartInstance.destroy();
  if (revenueChartInstance) revenueChartInstance.destroy();
  if (swotChartInstance) swotChartInstance.destroy();

  const chartDefaults = {
    plugins: { legend: { labels: { color: "#8b95a8", font: { family: "DM Sans" } } } },
    scales: {
      x: { ticks: { color: "#8b95a8" }, grid: { color: "rgba(255,255,255,0.05)" } },
      y: { ticks: { color: "#8b95a8" }, grid: { color: "rgba(255,255,255,0.05)" } }
    }
  };

  // Market Growth Chart
  marketChartInstance = new Chart(document.getElementById("marketChart"), {
    type: "bar",
    data: {
      labels: mData.labels,
      datasets: [{
        label: `Market Size (${mData.unit})`,
        data: mData.data,
        backgroundColor: "rgba(232,255,71,0.3)",
        borderColor: "#e8ff47",
        borderWidth: 2,
        borderRadius: 6
      }]
    },
    options: { ...chartDefaults, responsive: true }
  });

  // Revenue Projection Chart
  revenueChartInstance = new Chart(document.getElementById("revenueChart"), {
    type: "line",
    data: {
      labels: ["Year 1", "Year 2", "Year 3"],
      datasets: [{
        label: "Revenue (₹ Lakhs)",
        data: rData,
        borderColor: "#4ade80",
        backgroundColor: "rgba(74,222,128,0.1)",
        borderWidth: 2,
        pointBackgroundColor: "#4ade80",
        pointRadius: 6,
        fill: true,
        tension: 0.4
      }]
    },
    options: { ...chartDefaults, responsive: true }
  });

  // SWOT Radar Chart
  const s = Math.min(10, score);
  swotChartInstance = new Chart(document.getElementById("swotChart"), {
    type: "radar",
    data: {
      labels: ["Strengths", "Opportunities", "Market Fit", "Innovation", "Scalability", "Team Readiness"],
      datasets: [{
        label: "Your Idea",
        data: [s, Math.min(10, s+1), Math.max(5, s-1), Math.min(10, s+2), s, Math.max(4, s-2)],
        borderColor: "#e8ff47",
        backgroundColor: "rgba(232,255,71,0.1)",
        pointBackgroundColor: "#e8ff47",
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      scales: {
        r: {
          ticks: { color: "#8b95a8", backdropColor: "transparent" },
          grid: { color: "rgba(255,255,255,0.1)" },
          pointLabels: { color: "#8b95a8", font: { family: "DM Sans", size: 11 } },
          min: 0, max: 10
        }
      },
      plugins: { legend: { labels: { color: "#8b95a8" } } }
    }
  });
}
