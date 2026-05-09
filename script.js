const API_KEY = "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";
const API_URL = "https://openrouter.ai/api/v1/chat/completions";

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
  setTimeout(() => box.classList.add("hidden"), 6000);
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

  const prompt = `You are a top startup business consultant and investor mentor.

Analyze this startup idea: "${idea}"

Return ONLY a valid JSON object. No markdown, no backticks, no explanation before or after. Exactly this structure:
{
  "problem": "Clear 2-3 sentence problem statement",
  "audience": "Who the target users are and why (2-3 sentences)",
  "swot": {
    "strengths": "Key competitive strengths (2-3 sentences)",
    "weaknesses": "Main internal weaknesses (2-3 sentences)",
    "opportunities": "Market opportunities to exploit (2-3 sentences)",
    "threats": "External threats and challenges (2-3 sentences)"
  },
  "revenue": "How the business will make money (2-3 sentences)",
  "marketing": "Go-to-market and marketing approach (2-3 sentences)",
  "competitors": "Who the competitors are and how to differentiate (2-3 sentences)",
  "risks": "Key risks and how to mitigate them (2-3 sentences)",
  "growth": "Concrete growth strategies and next steps (2-3 sentences)",
  "score": <integer from 1 to 10>
}`;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + API_KEY,
        "HTTP-Referer": "https://startsmart.ai",
        "X-Title": "StartSmart AI"
      },
      body: JSON.stringify({
        model: "openrouter/auto",
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error?.message || "API error. Try again.");
    }

    const rawText = data.choices?.[0]?.message?.content || "";
    const clean = rawText.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(clean);
    } catch (e) {
      throw new Error("Could not parse response. Try again.");
    }

    hideLoading();
    populateResults(parsed);

    const resultsSection = document.getElementById("resultsSection");
    resultsSection.classList.remove("hidden");
    setTimeout(() => {
      resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);

  } catch (err) {
    hideLoading();
    showError(err.message || "Something went wrong. Please try again.");
  }

  if (window.saveToHistory && typeof parsed !== "undefined") {
    window.saveToHistory(idea, parsed.score || 7);
  }
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
    { title: "Strengths", id: "res-strengths" },
    { title: "Weaknesses", id: "res-weaknesses" },
    { title: "Opportunities", id: "res-opportunities" },
    { title: "Threats", id: "res-threats" },
    { title: "Marketing Strategy", id: "res-marketing" },
    { title: "Competitor Analysis", id: "res-competitors" },
    { title: "Risk Factors", id: "res-risks" },
    { title: "Growth Suggestions", id: "res-growth" }
  ];

  let html = `
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Arial, sans-serif; background: #fff; color: #111; padding: 40px; }
        .header { border-bottom: 3px solid #000; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { font-size: 28px; font-weight: 800; letter-spacing: -1px; }
        .logo span { color: #555; }
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
        .swot-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px; color: #444; }
        .swot-body { font-size: 13px; line-height: 1.65; color: #333; }
        .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #999; text-align: center; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">Start<span>Smart</span> AI</div>
        <div class="idea-title">Analysis Report: "${idea}"</div>
      </div>
      <div class="score-box">
        <div class="score-num">${score}</div>
        <div class="score-verdict">Investor Readiness Score<br>${verdict}</div>
      </div>
  `;

  // Problem, Audience, Revenue
  ["res-problem", "res-audience", "res-revenue"].forEach(id => {
    const section = sections.find(s => s.id === id);
    const text = document.getElementById(id).textContent;
    html += `<div class="section"><div class="section-title">${section.title}</div><div class="section-body">${text}</div></div>`;
  });

  // SWOT
  html += `<div class="swot-grid">
    <div class="swot-box swot-s"><div class="swot-label">Strengths</div><div class="swot-body">${document.getElementById("res-strengths").textContent}</div></div>
    <div class="swot-box swot-w"><div class="swot-label">Weaknesses</div><div class="swot-body">${document.getElementById("res-weaknesses").textContent}</div></div>
    <div class="swot-box swot-o"><div class="swot-label">Opportunities</div><div class="swot-body">${document.getElementById("res-opportunities").textContent}</div></div>
    <div class="swot-box swot-t"><div class="swot-label">Threats</div><div class="swot-body">${document.getElementById("res-threats").textContent}</div></div>
  </div>`;

  // Remaining sections
  ["res-marketing", "res-competitors", "res-risks", "res-growth"].forEach(id => {
    const section = sections.find(s => s.id === id);
    const text = document.getElementById(id).textContent;
    html += `<div class="section"><div class="section-title">${section.title}</div><div class="section-body">${text}</div></div>`;
  });

  html += `<div class="footer">Generated by StartSmart AI · FlowZint Hackathon 2026 · Powered by OpenRouter AI</div></body></html>`;

  const printWindow = window.open("", "_blank");
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
  }, 500);
}