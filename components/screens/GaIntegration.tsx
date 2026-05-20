"use client";

import { useState } from "react";
import IntegrationLayout from "./IntegrationLayout";

const PROPERTIES = [
  { id: "ga-main", label: "cloudshift.net — Production" },
  { id: "ga-staging", label: "staging.cloudshift.net" },
];

const EVENTS: Record<string, { name: string; count: string }[]> = {
  "ga-main": [
    { name: "signup_complete", count: "1,204" },
    { name: "demo_requested", count: "382" },
    { name: "content_published", count: "89" },
  ],
  "ga-staging": [
    { name: "page_view", count: "12,400" },
    { name: "test_event", count: "44" },
  ],
};

export default function GaIntegration() {
  const [property, setProperty] = useState(PROPERTIES[0].id);
  const events = EVENTS[property] ?? [];

  return (
    <IntegrationLayout
      title="Google Analytics"
      subtitle="Property metrics and conversion events into Intelligence."
      icon="analytics"
      connected
      metrics={[
        { label: "Sessions (7d)", value: "24.1k" },
        { label: "Conversion rate", value: "3.8%" },
        { label: "Streams", value: "2" },
      ]}
      mappings={[
        { source: "event.signup_complete", target: "intelligence_signups", status: "synced" },
        { source: "event.demo_requested", target: "intelligence_demos", status: "synced" },
        { source: "user_property.plan", target: "workspace_tier", status: "pending" },
      ]}
      logs={[
        { time: "11:30", message: "Daily rollup ingested", ok: true },
        { time: "06:00", message: "BigQuery export linked", ok: true },
        { time: "Yesterday", message: "Custom dimension mapping updated", ok: true },
      ]}
      extra={
        <div className="card proto-panel" style={{ marginBottom: 16 }}>
          <label className="proto-field">
            <span>GA4 property</span>
            <select
              value={property}
              onChange={(e) => setProperty(e.target.value)}
            >
              {PROPERTIES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>
          <h3 className="proto-panel-title">Key events</h3>
          <table className="proto-table">
            <thead>
              <tr>
                <th>Event</th>
                <th>7d count</th>
              </tr>
            </thead>
            <tbody>
              {events.map((ev) => (
                <tr key={ev.name}>
                  <td>{ev.name}</td>
                  <td className="tnum">{ev.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" className="btn-secondary" style={{ marginTop: 12 }}>
            Open in Analytics
          </button>
        </div>
      }
    />
  );
}
