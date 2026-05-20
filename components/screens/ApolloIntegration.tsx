"use client";

import { useState } from "react";
import IntegrationLayout from "./IntegrationLayout";

export default function ApolloIntegration() {
  const [credits, setCredits] = useState(72);

  return (
    <IntegrationLayout
      title="Apollo.io"
      subtitle="Prospecting enrichment and sequence sync for outbound campaigns."
      icon="apollo"
      connected
      metrics={[
        { label: "Prospects synced", value: "3,416" },
        { label: "Active sequences", value: "8" },
        { label: "Enrichment credits", value: `${credits}% left` },
      ]}
      mappings={[
        { source: "Person.Email", target: "prospect_email", status: "synced" },
        { source: "Person.Title", target: "job_title", status: "synced" },
        { source: "Sequence.Step", target: "outbound_step", status: "pending" },
      ]}
      logs={[
        { time: "09:22", message: "Enrichment batch 416 contacts", ok: true },
        { time: "08:10", message: "Sequence 'Spring outbound' paused", ok: true },
        { time: "07:55", message: "API key rotation required soon", ok: false },
      ]}
      extra={
        <div className="card proto-panel" style={{ marginBottom: 16 }}>
          <h3 className="proto-panel-title">Enrichment usage</h3>
          <input
            type="range"
            min={0}
            max={100}
            value={credits}
            onChange={(e) => setCredits(Number(e.target.value))}
            style={{ width: "100%" }}
          />
          <p className="proto-muted">Drag to simulate credit pool (prototype).</p>
        </div>
      }
    />
  );
}
