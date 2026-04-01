import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";

import api from "./axios";

interface Profile {
  name: string | null;
  dob: string | null;
  height: string | null;
  weight: string | null;
}

interface Period {
  id: number;
  cycle_id: number;
  start_date: string;
  end_date: string | null;
}

interface Cycle {
  id: number;
  start_date: string;
  end_date: string | null;
  cycle_length: number | null;
  periods: Period[];
}

interface Symptom {
  id: number;
  name: string;
}

interface DailySymptom {
  symptom?: Symptom;
}

interface DailyLog {
  id: number;
  date: string;
  daily_symptoms?: DailySymptom[];
}

interface Journal {
  feeling: "great" | "good" | "okay" | "low" | "awful" | null;
}

function calculateAge(dob: string | null): string {
  if (!dob) return "N/A";
  const birth = new Date(dob);
  const today = new Date();
  const age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  return String(
    m < 0 || (m === 0 && today.getDate() < birth.getDate()) ? age - 1 : age,
  );
}

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "N/A";
  return new Date(`${dateString}T00:00:00`).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatDateLong(dateString: string | null | undefined): string {
  if (!dateString) return "N/A";
  return new Date(`${dateString}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function periodDuration(start: string, end: string | null): string {
  if (!end) return "Ongoing";
  const days =
    Math.round(
      (new Date(end).getTime() - new Date(start).getTime()) /
        (1000 * 60 * 60 * 24),
    ) + 1;
  return `${days} days`;
}

function buildHtml(
  profile: Profile,
  cycles: Cycle[],
  logs: DailyLog[],
  journals: Journal[],
): string {
  const completedCycles = cycles.filter((c) => c.cycle_length !== null);
  const avgCycle =
    completedCycles.length > 0
      ? (
          completedCycles.reduce((s, c) => s + (c.cycle_length as number), 0) /
          completedCycles.length
        ).toFixed(1)
      : "N/A";

  const cycleLengths = completedCycles.map((c) => c.cycle_length as number);
  const longestCycle =
    cycleLengths.length > 0 ? Math.max(...cycleLengths) : null;
  const shortestCycle =
    cycleLengths.length > 0 ? Math.min(...cycleLengths) : null;

  const allPeriods = cycles.flatMap((c) => c.periods);
  const periodLengths = allPeriods
    .filter((p) => p.end_date)
    .map(
      (p) =>
        Math.round(
          (new Date(p.end_date!).getTime() - new Date(p.start_date).getTime()) /
            (1000 * 60 * 60 * 24),
        ) + 1,
    );
  const avgPeriod =
    periodLengths.length > 0
      ? (
          periodLengths.reduce((s, d) => s + d, 0) / periodLengths.length
        ).toFixed(1)
      : "N/A";

  const countMap: Record<string, number> = {};
  for (const log of logs) {
    for (const ds of log.daily_symptoms ?? []) {
      const name = ds.symptom?.name;
      if (name) countMap[name] = (countMap[name] ?? 0) + 1;
    }
  }
  const topSymptoms = Object.entries(countMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const moodCount: Record<string, number> = {
    great: 0,
    good: 0,
    okay: 0,
    low: 0,
    awful: 0,
  };
  for (const j of journals) {
    if (j.feeling) moodCount[j.feeling] = (moodCount[j.feeling] ?? 0) + 1;
  }

  const reportDate = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Cycle regularity
  let regularityNote = "Insufficient data";
  if (cycleLengths.length >= 2) {
    const variance = Math.max(...cycleLengths) - Math.min(...cycleLengths);
    if (variance <= 3) regularityNote = `Regular (varies by ±${variance} days)`;
    else if (variance <= 7)
      regularityNote = `Slightly irregular (varies by ±${variance} days)`;
    else regularityNote = `Irregular (varies by ±${variance} days)`;
  }

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Cycle Health Report</title>
  <style>
    @media print { .no-print { display: none !important; } }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
      background: #f2f2f2;
      display: flex;
      justify-content: center;
      padding: 40px 20px;
    }

    .page {
      background: #ffffff;
      width: 210mm;
      min-height: 297mm;
      padding: 48px 52px;
      box-shadow: 0 2px 24px rgba(0,0,0,0.08);
    }

    /* Print hint banner */
    .print-hint {
      background: #f0f9f6;
      border: 1px solid #b2d8cc;
      border-radius: 6px;
      padding: 10px 16px;
      font-size: 12px;
      color: #2c6e5a;
      margin-bottom: 32px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .print-btn {
      background: #2c6e5a;
      color: white;
      border: none;
      border-radius: 5px;
      padding: 6px 16px;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
    }

    /* Header */
    .report-title {
      font-size: 22px;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: #1a202c;
      margin-bottom: 6px;
    }
    .report-meta {
      font-size: 11px;
      color: #718096;
      margin-bottom: 28px;
    }
    .divider {
      border: none;
      border-top: 2px solid #1a202c;
      margin-bottom: 28px;
    }
    .divider-thin {
      border: none;
      border-top: 1px solid #e2e8f0;
      margin: 24px 0;
    }

    /* Sections */
    .section-title {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #4a5568;
      margin-bottom: 14px;
    }

    /* Patient info grid */
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px 32px;
      font-size: 12px;
    }
    .info-row { display: flex; gap: 6px; }
    .info-label { font-weight: 600; color: #1a202c; min-width: 60px; }
    .info-value { color: #4a5568; }

    /* Stats row */
    .stats-row {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 12px;
      margin-bottom: 4px;
    }
    .stat-cell {
      border-top: 2px solid #1a202c;
      padding-top: 8px;
    }
    .stat-cell-label {
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #718096;
      margin-bottom: 4px;
    }
    .stat-cell-value {
      font-size: 20px;
      font-weight: 700;
      color: #1a202c;
      line-height: 1;
    }
    .stat-cell-unit {
      font-size: 10px;
      color: #718096;
      margin-top: 2px;
    }

    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 11px;
    }
    thead tr {
      border-bottom: 2px solid #1a202c;
    }
    th {
      text-align: left;
      padding: 6px 8px;
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #4a5568;
    }
    td {
      padding: 7px 8px;
      color: #2d3748;
      border-bottom: 1px solid #e2e8f0;
    }
    tbody tr:last-child td { border-bottom: none; }

    /* Bullet list */
    .bullet-list { list-style: none; font-size: 12px; }
    .bullet-list li {
      padding: 4px 0;
      border-bottom: 1px solid #f0f4f8;
      display: flex;
      justify-content: space-between;
      color: #2d3748;
    }
    .bullet-list li:last-child { border-bottom: none; }
    .bullet-count { font-weight: 600; color: #1a202c; }

    /* Footer */
    .footer {
      margin-top: 48px;
      padding-top: 14px;
      border-top: 1px solid #1a202c;
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      color: #718096;
    }
    .disclaimer {
      margin-top: 10px;
      font-size: 9px;
      color: #a0aec0;
      line-height: 1.6;
    }
  </style>
</head>
<body>
<div class="page">

  <div class="print-hint no-print">
    <span>To save as PDF: use <strong>File → Print → Save as PDF</strong> in your browser, or click the button.</span>
    <button class="print-btn" onclick="window.print()">Save as PDF</button>
  </div>

  <div class="report-title">Cycle Health Report</div>
  <div class="report-meta">Date of Report: ${reportDate} &nbsp;·&nbsp; For Medical Reference Only</div>
  <hr class="divider"/>

  <!-- Patient Details -->
  <div class="section-title">Patient Details</div>
  <div class="info-grid">
    <div class="info-row">
      <span class="info-label">Name:</span>
      <span class="info-value">${profile.name ?? "N/A"}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Weight:</span>
      <span class="info-value">${profile.weight ? `${profile.weight} kg` : "N/A"}</span>
    </div>
    <div class="info-row">
      <span class="info-label">DOB:</span>
      <span class="info-value">${formatDate(profile.dob)}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Height:</span>
      <span class="info-value">${profile.height ? `${profile.height} cm` : "N/A"}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Age:</span>
      <span class="info-value">${calculateAge(profile.dob)} years</span>
    </div>
  </div>

  <hr class="divider-thin"/>

  <!-- Cycle Summary -->
  <div class="section-title">Cycle Summary</div>
  <div class="stats-row">
    <div class="stat-cell">
      <div class="stat-cell-label">Cycles Tracked</div>
      <div class="stat-cell-value">${cycles.length}</div>
    </div>
    <div class="stat-cell">
      <div class="stat-cell-label">Avg Cycle</div>
      <div class="stat-cell-value">${avgCycle}</div>
      <div class="stat-cell-unit">days</div>
    </div>
    <div class="stat-cell">
      <div class="stat-cell-label">Avg Period</div>
      <div class="stat-cell-value">${avgPeriod}</div>
      <div class="stat-cell-unit">days</div>
    </div>
    <div class="stat-cell">
      <div class="stat-cell-label">Shortest</div>
      <div class="stat-cell-value">${shortestCycle ?? "—"}</div>
      <div class="stat-cell-unit">${shortestCycle ? "days" : ""}</div>
    </div>
    <div class="stat-cell">
      <div class="stat-cell-label">Longest</div>
      <div class="stat-cell-value">${longestCycle ?? "—"}</div>
      <div class="stat-cell-unit">${longestCycle ? "days" : ""}</div>
    </div>
  </div>

  <div style="margin-top:14px; font-size:11px; color:#4a5568;">
    <strong>Regularity:</strong> ${regularityNote}
  </div>

  <hr class="divider-thin"/>

  <!-- Cycle Log -->
  <div class="section-title">Cycle Log</div>
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Cycle Start</th>
        <th>Cycle End</th>
        <th>Cycle Length</th>
        <th>Period Start</th>
        <th>Period End</th>
        <th>Period Duration</th>
      </tr>
    </thead>
    <tbody>
      ${cycles
        .map((cycle, i) => {
          const period = cycle.periods[0];
          return `<tr>
          <td>${i + 1}</td>
          <td>${formatDate(cycle.start_date)}</td>
          <td>${formatDate(cycle.end_date)}</td>
          <td>${cycle.cycle_length ? `${cycle.cycle_length} days` : "Ongoing"}</td>
          <td>${period ? formatDate(period.start_date) : "—"}</td>
          <td>${period ? formatDate(period.end_date) : "—"}</td>
          <td>${period ? periodDuration(period.start_date, period.end_date) : "—"}</td>
        </tr>`;
        })
        .join("")}
    </tbody>
  </table>

  <hr class="divider-thin"/>

  <!-- Symptoms & Mood side by side -->
  <div style="display:grid; grid-template-columns:1fr 1fr; gap:32px;">

    <div>
      <div class="section-title">Most Logged Symptoms</div>
      ${
        topSymptoms.length === 0
          ? `<p style="font-size:11px;color:#a0aec0;">No symptoms logged yet.</p>`
          : `<ul class="bullet-list">
          ${topSymptoms
            .map(
              ([name, count], i) =>
                `<li><span>${i + 1}. ${name}</span><span class="bullet-count">${count}×</span></li>`,
            )
            .join("")}
        </ul>`
      }
    </div>

    <div>
      <div class="section-title">Mood Summary</div>
      <ul class="bullet-list">
        <li><span>Great</span><span class="bullet-count">${moodCount.great}×</span></li>
        <li><span>Good</span><span class="bullet-count">${moodCount.good}×</span></li>
        <li><span>Okay</span><span class="bullet-count">${moodCount.okay}×</span></li>
        <li><span>Low</span><span class="bullet-count">${moodCount.low}×</span></li>
        <li><span>Awful</span><span class="bullet-count">${moodCount.awful}×</span></li>
      </ul>
    </div>

  </div>

  <!-- Footer -->
  <div class="footer">
    <span>Generated by Cycle Tracking Application</span>
    <span>${reportDate}</span>
  </div>
  <div class="disclaimer">
    This report is intended as a reference document for healthcare professionals and does not constitute medical advice.
    Please consult a qualified medical practitioner for diagnosis and treatment.
  </div>

</div>
</body>
</html>`;
}

export async function generateAndShareReport() {
  const [profileRes, cyclesRes, logsRes, journalsRes] = await Promise.all([
    api.get("/me"),
    api.get("/cycles"),
    api.get("/daily-logs"),
    api.get("/journals"),
  ]);

  const profile: Profile = profileRes.data;
  const cycles: Cycle[] = cyclesRes.data ?? [];
  const logs: DailyLog[] = logsRes.data ?? [];
  const journals: Journal[] = journalsRes.data ?? [];

  const html = buildHtml(profile, cycles, logs, journals);

  if (Platform.OS === "web") {
    const newTab = window.open();
    if (newTab) {
      newTab.document.write(html);
      newTab.document.close();
    }
  } else {
    const { uri } = await Print.printToFileAsync({ html });
    await Sharing.shareAsync(uri, {
      mimeType: "application/pdf",
      dialogTitle: "Share Cycle Report",
      UTI: "com.adobe.pdf",
    });
  }
}
