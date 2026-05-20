"use client";

import { useState } from "react";
import Icon from "../Icon";

type Admin = {
  id: number;
  name: string;
  email: string;
  role: "Super Admin" | "Admin";
  lastActive: string;
};

const INITIAL: Admin[] = [
  {
    id: 1,
    name: "Allen Keith Aradillos",
    email: "allen.aradillos@cloudshift.net",
    role: "Super Admin",
    lastActive: "Active now",
  },
  {
    id: 2,
    name: "Morgan Kim",
    email: "m.kim@cloudshift.net",
    role: "Admin",
    lastActive: "May 19",
  },
  {
    id: 3,
    name: "Dev Patel",
    email: "d.patel@cloudshift.net",
    role: "Admin",
    lastActive: "May 17",
  },
];

export default function Admins() {
  const [admins, setAdmins] = useState(INITIAL);
  const [modal, setModal] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const invite = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setAdmins((list) => [
      ...list,
      {
        id: Math.max(0, ...list.map((a) => a.id)) + 1,
        name: email.split("@")[0],
        email,
        role: "Admin",
        lastActive: "Invited",
      },
    ]);
    setEmail("");
    setError("");
    setModal(false);
  };

  const remove = (id: number, name: string) => {
    if (window.confirm(`Remove ${name} from super admins?`)) {
      setAdmins((list) => list.filter((a) => a.id !== id));
    }
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Super Admins</h1>
          <p className="page-sub">Workspace owners with full access and billing visibility.</p>
        </div>
        <div className="page-meta">
          <button type="button" className="btn-primary" onClick={() => setModal(true)}>
            <Icon name="plus" /> Invite admin
          </button>
        </div>
      </div>

      <div className="card proto-panel">
        <table className="proto-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Last active</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {admins.map((a) => (
              <tr key={a.id}>
                <td>{a.name}</td>
                <td>{a.email}</td>
                <td>
                  <span className="proto-pill info">{a.role}</span>
                </td>
                <td className="tnum">{a.lastActive}</td>
                <td>
                  {a.id !== 1 && (
                    <button
                      type="button"
                      className="btn-secondary sm danger-text"
                      onClick={() => remove(a.id, a.name)}
                    >
                      Remove
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="proto-modal-backdrop" onClick={() => setModal(false)}>
          <div
            className="card proto-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="invite-title"
          >
            <h2 id="invite-title">Invite admin</h2>
            {error && <div className="proto-form-error">{error}</div>}
            <label className="proto-field">
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@cloudshift.net"
              />
            </label>
            <div className="proto-modal-actions">
              <button type="button" className="btn-secondary" onClick={() => setModal(false)}>
                Cancel
              </button>
              <button type="button" className="btn-primary" onClick={invite}>
                Send invite
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
