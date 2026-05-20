"use client";

import Icon from "../Icon";

const SESSIONS = [
  { device: "Windows · Chrome", location: "Chicago, US", last: "Active now" },
  { device: "iPhone · Safari", location: "Chicago, US", last: "May 18, 2:14 PM" },
  { device: "MacBook · Firefox", location: "Remote", last: "May 12, 9:02 AM" },
];

export default function Account() {
  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Account</h1>
          <p className="page-sub">Profile, security, and session preferences.</p>
        </div>
      </div>

      <div className="card proto-account-hero">
        <div className="proto-account-avatar">AA</div>
        <div>
          <h2>Allen Keith Aradillos</h2>
          <p className="proto-muted">Admin · aradillos@cloudshift.net</p>
        </div>
        <button type="button" className="btn-secondary">
          <Icon name="user" /> Edit profile
        </button>
      </div>

      <div className="proto-account-sections">
        <section className="card proto-panel">
          <h3 className="proto-panel-title">Login &amp; security</h3>
          <p className="proto-muted">Password and two-factor authentication.</p>
          <div className="proto-account-actions">
            <button type="button" className="btn-secondary" disabled>
              Change password
            </button>
            <button type="button" className="btn-primary">
              Enable 2FA
            </button>
          </div>
        </section>

        <section className="card proto-panel">
          <h3 className="proto-panel-title">Active sessions</h3>
          <table className="proto-table">
            <thead>
              <tr>
                <th>Device</th>
                <th>Location</th>
                <th>Last active</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {SESSIONS.map((s) => (
                <tr key={s.device}>
                  <td>{s.device}</td>
                  <td>{s.location}</td>
                  <td className="tnum">{s.last}</td>
                  <td>
                    {s.last !== "Active now" && (
                      <button type="button" className="btn-secondary sm">
                        Revoke
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="card proto-panel">
          <h3 className="proto-panel-title">Preferences</h3>
          <label className="proto-field">
            <span>Language</span>
            <select defaultValue="en">
              <option value="en">English (US)</option>
            </select>
          </label>
          <p className="proto-muted">
            Theme follows the toggle in the top bar (saved per device).
          </p>
        </section>
      </div>
    </>
  );
}
