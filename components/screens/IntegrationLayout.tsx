"use client";

import { useState, type ReactNode } from "react";
import Icon from "../Icon";

export type IntegrationMapping = {
  source: string;
  target: string;
  status: "synced" | "pending" | "error";
};

export type IntegrationLog = {
  time: string;
  message: string;
  ok: boolean;
};

type Props = {
  title: string;
  subtitle: string;
  icon: string;
  connected: boolean;
  metrics: { label: string; value: string }[];
  mappings: IntegrationMapping[];
  logs: IntegrationLog[];
  extra?: ReactNode;
};

export default function IntegrationLayout({
  title,
  subtitle,
  icon,
  connected: initialConnected,
  metrics,
  mappings,
  logs,
  extra,
}: Props) {
  const [connected, setConnected] = useState(initialConnected);
  const [syncOn, setSyncOn] = useState(true);

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">{title}</h1>
          <p className="page-sub">{subtitle}</p>
        </div>
        <div className="page-meta">
          <button
            type="button"
            className={connected ? "btn-secondary" : "btn-primary"}
            onClick={() => setConnected((c) => !c)}
          >
            <Icon name={connected ? "refresh" : "bolt"} />
            {connected ? "Reconnect" : "Connect"}
          </button>
        </div>
      </div>

      <div
        className={`card proto-int-banner ${connected ? "connected" : "disconnected"}`}
      >
        <div className="proto-int-banner-icon">
          <Icon name={icon} style={{ width: 28, height: 28 }} />
        </div>
        <div className="proto-int-banner-body">
          <div className="proto-int-banner-title">
            {connected ? "Connected" : "Not connected"}
          </div>
          <p className="proto-int-banner-sub">
            {connected
              ? "Sync runs on schedule. Last successful sync 12 min ago."
              : "Connect to enable field mapping and automated sync."}
          </p>
        </div>
        <label className="proto-toggle">
          <input
            type="checkbox"
            checked={syncOn && connected}
            disabled={!connected}
            onChange={(e) => setSyncOn(e.target.checked)}
          />
          <span>Sync enabled</span>
        </label>
      </div>

      {extra}

      <div className="proto-kpi-row">
        {metrics.map((m) => (
          <div key={m.label} className="card proto-kpi">
            <div className="proto-kpi-label">{m.label}</div>
            <div className="proto-kpi-value tnum">{m.value}</div>
          </div>
        ))}
      </div>

      <div className="proto-split proto-split--wide">
        <div className="card proto-panel">
          <h3 className="proto-panel-title">Field mapping</h3>
          <table className="proto-table">
            <thead>
              <tr>
                <th>Source</th>
                <th>Target</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {mappings.map((row) => (
                <tr key={row.source}>
                  <td>{row.source}</td>
                  <td>{row.target}</td>
                  <td>
                    <span className={`proto-pill ${row.status}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card proto-panel">
          <h3 className="proto-panel-title">Recent activity</h3>
          <ul className="proto-log">
            {logs.map((log, i) => (
              <li key={i} className={log.ok ? "ok" : "err"}>
                <span className="proto-log-time tnum">{log.time}</span>
                <span>{log.message}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
