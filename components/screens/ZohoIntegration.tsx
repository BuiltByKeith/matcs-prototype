"use client";

import { useMemo, useState } from "react";
import Icon from "../Icon";

type TabId =
  | "overview"
  | "leads"
  | "contacts"
  | "accounts"
  | "deals"
  | "settings";

const NAV: { id: TabId; label: string; icon: string }[] = [
  { id: "overview", label: "Overview", icon: "chart" },
  { id: "leads", label: "Leads", icon: "bolt" },
  { id: "contacts", label: "Contacts", icon: "users" },
  { id: "accounts", label: "Accounts", icon: "project" },
  { id: "deals", label: "Deals", icon: "target" },
  { id: "settings", label: "Integration Settings", icon: "settings" },
];

const KPIS = [
  { label: "Leads", value: "0" },
  { label: "Contacts", value: "864" },
  { label: "Accounts", value: "606" },
  { label: "Open deals", value: "0" },
] as const;

const INDUSTRIES = [
  { name: "information technology & services", count: 340 },
  { name: "hospital & health care", count: 50 },
  { name: "utilities", count: 27 },
  { name: "construction", count: 25 },
  { name: "marketing & advertising", count: 20 },
  { name: "financial services", count: 18 },
  { name: "real estate", count: 15 },
  { name: "education management", count: 12 },
];

const ENTITY_ROWS: Record<
  Exclude<TabId, "overview" | "settings">,
  { name: string; status: string; updated: string }[]
> = {
  leads: [
    { name: "Acme Corp — inbound", status: "new", updated: "May 19" },
    { name: "VirtuHire trial", status: "qualified", updated: "May 18" },
    { name: "CloudShift partner lead", status: "contacted", updated: "May 17" },
    { name: "Spring campaign form", status: "new", updated: "May 16" },
    { name: "Webinar attendee batch", status: "nurture", updated: "May 14" },
  ],
  contacts: [
    { name: "Morgan Kim", status: "active", updated: "Today" },
    { name: "Dev Patel", status: "active", updated: "May 19" },
    { name: "Allen Aradillos", status: "active", updated: "May 18" },
    { name: "Jordan Lee", status: "inactive", updated: "May 10" },
    { name: "Sam Rivera", status: "active", updated: "May 8" },
    { name: "Casey Nguyen", status: "active", updated: "May 5" },
  ],
  accounts: [
    { name: "Cloud Shift Digital", status: "customer", updated: "Today" },
    { name: "VirtuHire Inc.", status: "prospect", updated: "May 19" },
    { name: "Northline Health", status: "customer", updated: "May 17" },
    { name: "Summit Utilities", status: "prospect", updated: "May 15" },
    { name: "Brightpath Education", status: "customer", updated: "May 12" },
  ],
  deals: [
    { name: "Q2 platform expansion", status: "proposal", updated: "May 19" },
    { name: "Enterprise CRM bundle", status: "negotiation", updated: "May 16" },
    { name: "Pilot — analytics add-on", status: "qualified", updated: "May 11" },
    { name: "Renewal FY26", status: "closed won", updated: "May 6" },
  ],
};

const MAPPINGS = [
  { source: "Account.Name", target: "company_name", status: "synced" as const },
  { source: "Contact.Email", target: "email", status: "synced" as const },
  { source: "Deal.Amount", target: "deal_value", status: "pending" as const },
];

function EntityTable({
  title,
  rows,
  query,
  onQuery,
}: {
  title: string;
  rows: { name: string; status: string; updated: string }[];
  query: string;
  onQuery: (q: string) => void;
}) {
  const filtered = useMemo(
    () =>
      rows.filter(
        (r) =>
          !query.trim() ||
          r.name.toLowerCase().includes(query.toLowerCase()),
      ),
    [rows, query],
  );

  return (
    <>
      <h2 className="proto-panel-title">{title}</h2>
      <div className="toolbar" style={{ marginBottom: 14 }}>
        <div className="search" style={{ maxWidth: 280, margin: 0 }}>
          <Icon name="search" />
          <input
            placeholder={`Search ${title.toLowerCase()}…`}
            value={query}
            onChange={(e) => onQuery(e.target.value)}
          />
        </div>
      </div>
      <table className="proto-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Updated</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((r) => (
            <tr key={r.name}>
              <td>{r.name}</td>
              <td>
                <span className={`proto-pill ${r.status === "new" ? "pending" : "synced"}`}>
                  {r.status}
                </span>
              </td>
              <td className="tnum">{r.updated}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {filtered.length === 0 && (
        <p className="proto-muted">No records match your search.</p>
      )}
    </>
  );
}

export default function ZohoIntegration() {
  const [tab, setTab] = useState<TabId>("overview");
  const [connected, setConnected] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState("12 min ago");
  const [syncOn, setSyncOn] = useState(true);
  const [entityQuery, setEntityQuery] = useState("");

  const maxIndustry = INDUSTRIES[0].count;

  const syncLine = useMemo(() => {
    if (!connected) return "Connect Zoho to enable scheduled sync and field mapping.";
    if (syncing) return "Syncing…";
    return `Connected — syncing every 30 min · Last sync ${lastSync}`;
  }, [connected, syncing, lastSync]);

  const runSync = () => {
    if (!connected || syncing) return;
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setLastSync("just now");
    }, 1500);
  };

  return (
    <>
      <div className="page-header zoho-header">
        <div className="zoho-header-main">
          <div className="zoho-title-row">
            <h1 className="page-title">Zoho CRM</h1>
            <span
              className={`zoho-status ${connected ? "connected" : "disconnected"}`}
            >
              <span className="zoho-status-dot" />
              {connected ? "Connected" : "Disconnected"}
            </span>
          </div>
          <p className="zoho-sync-line">{syncLine}</p>
        </div>
        <div className="page-meta">
          {connected ? (
            <>
              <button
                type="button"
                className="btn-secondary"
                onClick={runSync}
                disabled={syncing}
              >
                <Icon name="refresh" />
                {syncing ? "Syncing…" : "Sync Now"}
              </button>
              <button type="button" className="btn-primary">
                <Icon name="send" />
                Push Scores
              </button>
            </>
          ) : (
            <button
              type="button"
              className="btn-primary"
              onClick={() => setConnected(true)}
            >
              <Icon name="bolt" />
              Connect
            </button>
          )}
        </div>
      </div>

      <div className="proto-kpi-row zoho-kpi-row">
        {KPIS.map((k) => (
          <div
            key={k.label}
            className={`card proto-kpi zoho-kpi ${k.label === "Leads" ? "zoho-kpi--featured" : ""}`}
          >
            <div className="proto-kpi-label">{k.label}</div>
            <div className="proto-kpi-value tnum">{k.value}</div>
          </div>
        ))}
      </div>

      <div className="zoho-shell">
        <nav className="card zoho-nav">
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`proto-list-item ${tab === item.id ? "active" : ""}`}
              onClick={() => {
                setTab(item.id);
                setEntityQuery("");
              }}
            >
              <Icon name={item.icon} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="card proto-panel zoho-content">
          {tab === "overview" && (
            <>
              <div className="zoho-section-label">CRM Intelligence</div>
              <h2 className="proto-panel-title">Top Industries (Accounts)</h2>
              <ul className="zoho-industry-list">
                {INDUSTRIES.map((ind, i) => (
                  <li key={ind.name} className="zoho-industry-row">
                    <span className="zoho-industry-rank tnum">{i + 1}</span>
                    <div className="zoho-industry-body">
                      <div className="zoho-industry-head">
                        <span className="zoho-industry-name">{ind.name}</span>
                        <span className="zoho-industry-count tnum">
                          {ind.count}
                        </span>
                      </div>
                      <div className="zoho-industry-track">
                        <div
                          className="zoho-industry-bar"
                          style={{
                            width: `${(ind.count / maxIndustry) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}

          {tab === "leads" && (
            <EntityTable
              title="Leads"
              rows={ENTITY_ROWS.leads}
              query={entityQuery}
              onQuery={setEntityQuery}
            />
          )}
          {tab === "contacts" && (
            <EntityTable
              title="Contacts"
              rows={ENTITY_ROWS.contacts}
              query={entityQuery}
              onQuery={setEntityQuery}
            />
          )}
          {tab === "accounts" && (
            <EntityTable
              title="Accounts"
              rows={ENTITY_ROWS.accounts}
              query={entityQuery}
              onQuery={setEntityQuery}
            />
          )}
          {tab === "deals" && (
            <EntityTable
              title="Deals"
              rows={ENTITY_ROWS.deals}
              query={entityQuery}
              onQuery={setEntityQuery}
            />
          )}

          {tab === "settings" && (
            <>
              <h2 className="proto-panel-title">Integration Settings</h2>
              <p className="proto-muted">
                Sync schedule, credentials, and field mapping for Zoho CRM.
              </p>
              <label className="proto-toggle block">
                <input
                  type="checkbox"
                  checked={syncOn && connected}
                  disabled={!connected}
                  onChange={(e) => setSyncOn(e.target.checked)}
                />
                <span>Automatic sync every 30 minutes</span>
              </label>
              <div className="divider" />
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
                  {MAPPINGS.map((row) => (
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
            </>
          )}
        </div>
      </div>
    </>
  );
}
