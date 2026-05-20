"use client";

import { useMemo, useState } from "react";
import Icon from "../Icon";

type Range = "7d" | "30d" | "90d";

const DATA: Record<
  Range,
  { used: number; quota: number; models: { name: string; pct: number }[]; users: { name: string; tokens: string }[] }
> = {
  "7d": {
    used: 124_800,
    quota: 200_000,
    models: [
      { name: "Gemini 2.0 Flash", pct: 62 },
      { name: "Gemini Pro", pct: 28 },
      { name: "Embeddings", pct: 10 },
    ],
    users: [
      { name: "Allen K.", tokens: "48.2k" },
      { name: "M. Kim", tokens: "31.1k" },
      { name: "D. Patel", tokens: "22.4k" },
    ],
  },
  "30d": {
    used: 412_500,
    quota: 500_000,
    models: [
      { name: "Gemini 2.0 Flash", pct: 58 },
      { name: "Gemini Pro", pct: 32 },
      { name: "Embeddings", pct: 10 },
    ],
    users: [
      { name: "Allen K.", tokens: "142k" },
      { name: "M. Kim", tokens: "118k" },
      { name: "D. Patel", tokens: "89k" },
    ],
  },
  "90d": {
    used: 1_180_000,
    quota: 1_500_000,
    models: [
      { name: "Gemini 2.0 Flash", pct: 55 },
      { name: "Gemini Pro", pct: 35 },
      { name: "Embeddings", pct: 10 },
    ],
    users: [
      { name: "Allen K.", tokens: "410k" },
      { name: "M. Kim", tokens: "388k" },
      { name: "D. Patel", tokens: "201k" },
    ],
  },
};

export default function Tokens() {
  const [range, setRange] = useState<Range>("30d");
  const d = useMemo(() => DATA[range], [range]);
  const pct = Math.round((d.used / d.quota) * 100);

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">AI Token Usage</h1>
          <p className="page-sub">Workspace consumption by model and teammate.</p>
        </div>
        <div className="page-meta">
          <div className="seg">
            {(["7d", "30d", "90d"] as const).map((r) => (
              <button
                key={r}
                type="button"
                className={`seg-btn ${range === r ? "active" : ""}`}
                onClick={() => setRange(r)}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="proto-kpi-row">
        <div className="card proto-kpi">
          <div className="proto-kpi-label">Used</div>
          <div className="proto-kpi-value tnum">
            {d.used.toLocaleString()}
          </div>
        </div>
        <div className="card proto-kpi">
          <div className="proto-kpi-label">Quota</div>
          <div className="proto-kpi-value tnum">
            {d.quota.toLocaleString()}
          </div>
        </div>
        <div className="card proto-kpi">
          <div className="proto-kpi-label">Utilization</div>
          <div className="proto-kpi-value tnum">{pct}%</div>
          <div className="proto-bar-track">
            <div className="proto-bar-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      <div className="proto-split">
        <div className="card proto-panel">
          <h3 className="proto-panel-title">By model</h3>
          {d.models.map((m) => (
            <div key={m.name} className="proto-bar-row">
              <span>{m.name}</span>
              <div className="proto-bar-track flex">
                <div
                  className="proto-bar-fill"
                  style={{ width: `${m.pct}%` }}
                />
              </div>
              <span className="tnum proto-muted">{m.pct}%</span>
            </div>
          ))}
        </div>
        <div className="card proto-panel">
          <h3 className="proto-panel-title">Top consumers</h3>
          <table className="proto-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Tokens</th>
              </tr>
            </thead>
            <tbody>
              {d.users.map((u) => (
                <tr key={u.name}>
                  <td>{u.name}</td>
                  <td className="tnum">{u.tokens}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
