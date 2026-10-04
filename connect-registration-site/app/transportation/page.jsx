"use client";

import { useState } from "react";
import Link from "next/link";
import "./transportation.css";

const GROUP_URL = "https://chat.whatsapp.com/KBaT0KcHHvb3xEt1Vppugy";
const LOCATIONS = ["Lusada", "Agbara", "Ijanikin"];

export default function TransportationPage() {
  const [form, setForm] = useState({ name: "", code: "", location: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(null);

  function change(event) {
    setForm(previous => ({ ...previous, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    if (submitting) return;
    setError("");
    setSubmitting(true);
    try {
      const response = await fetch("/api/transportation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name.trim(), code: form.code.trim().toUpperCase(), location: form.location }),
      });
      const result = await response.json();
      if (!response.ok || result.success !== true || !result.transportation) {
        throw new Error(result.error || "Your transport request could not be saved. Please try again.");
      }
      setSaved(result.transportation);
    } catch (failure) {
      setError(failure.message || "Unable to connect. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const message = saved
    ? `*WORD CONFERENCE 2026 — TRANSPORT REQUEST*\n\n*Full Name:* ${saved.name}\n*Pickup Location:* ${saved.location}\n\nPlease include me in the ${saved.location} transportation list.`
    : "";

  return (
    <main className="transport-page">
      <header className="transport-header">
        <Link href="/" className="transport-brand">
          <img src="/logo.png" alt="RCCG The Connect" />
          <span>WORD CONFERENCE 2026</span>
        </Link>
        <Link href="/">Conference registration</Link>
      </header>

      <section className="transport-card" aria-labelledby="transport-heading">
        <p className="transport-eyebrow">LUSADA · AGBARA · IJANIKIN</p>
        <h1 id="transport-heading">Conference transportation</h1>
        {saved ? (
          <div aria-live="polite">
            <p className="transport-success">{saved.alreadyRegistered ? "Your transport request is already saved." : "Your transport request has been saved."}</p>
            <dl className="transport-details">
              <div><dt>Full name</dt><dd>{saved.name}</dd></div>
              <div><dt>Registration code</dt><dd>{saved.code}</dd></div>
              <div><dt>Pickup location</dt><dd>{saved.location}</dd></div>
            </dl>
            <h2>Share your name and location with the group</h2>
            <p>Your details have been saved in our transport list. To post them in the group, open WhatsApp, select <strong>Word Conference Transportation group 2026</strong>, and tap Send.</p>
            <p className="transport-note">The form does not automatically post to WhatsApp. Your name and location become visible to group members when you send the message.</p>
            <a className="transport-primary" href={`https://wa.me/?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer">Share to WhatsApp</a>
            <a className="transport-secondary" href={GROUP_URL} target="_blank" rel="noopener noreferrer">Join the transportation group</a>
            <details className="transport-message"><summary>View the message to share</summary><pre>{message}</pre></details>
            <p className="transport-note">Pickup points, departure times, any transport cost, and seat confirmations will be announced in the group.</p>
          </div>
        ) : (
          <>
            <p>Request transportation from your preferred location. Use the full name and registration code on your conference ticket.</p>
            <p className="transport-note">Haven’t registered for the conference? <Link href="/">Register first</Link>, then return here.</p>
            <form onSubmit={submit} className="transport-form">
              <label htmlFor="transport-name">Full name</label>
              <input id="transport-name" name="name" autoComplete="name" maxLength={150} required value={form.name} onChange={change} placeholder="Name on your conference ticket" />

              <label htmlFor="transport-code">Conference registration code</label>
              <input id="transport-code" name="code" autoCapitalize="characters" spellCheck={false} maxLength={30} required value={form.code} onChange={change} placeholder="For example, MWR-0060" />

              <label htmlFor="transport-location">Pickup location</label>
              <select id="transport-location" name="location" required value={form.location} onChange={change}>
                <option value="">Choose one location</option>
                {LOCATIONS.map(location => <option key={location} value={location}>{location}</option>)}
              </select>

              <p className="transport-note">Your request will be saved for the organisers. After submission, you can share your name and location in the WhatsApp group. Submit once and choose one location.</p>
              {error && <p className="transport-error" role="alert">{error}</p>}
              <button className="transport-primary" type="submit" disabled={submitting}>{submitting ? "Saving request…" : "Submit transport request"}</button>
            </form>
          </>
        )}
      </section>
      <footer className="transport-footer">RCCG THE CONNECT · WORD CONFERENCE 2026</footer>
    </main>
  );
}
