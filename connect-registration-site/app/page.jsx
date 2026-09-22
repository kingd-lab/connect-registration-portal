"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "./register.css";

const REGISTRATION_OPEN = true;

export default function HomePage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    gender: "",
    denomination: "",
    otherDenomination: "",
    health: "",
    expectation: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.gender ||
      !form.denomination ||
      (form.denomination === "Other" &&
        !form.otherDenomination.trim()) ||
      !form.expectation.trim()
    ) {
      setError("Please complete all required fields.");
      return;
    }

    setSubmitting(true);

    const finalDenomination =
      form.denomination === "Other"
        ? form.otherDenomination.trim()
        : form.denomination;

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          gender: form.gender,
          denomination: finalDenomination,
          health: form.health.trim(),
          expectation: form.expectation.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok || result.success === false) {
        setError(
          result.error ||
            "Registration could not be completed. Please try again."
        );
        setSubmitting(false);
        return;
      }

      const registrationCode =
        result.code ||
        result.registrationCode ||
        result.id ||
        "";

      const params = new URLSearchParams({
        name: form.name,
        email: form.email,
        gender: form.gender,
        denomination: finalDenomination,
        health: form.health,
        expectation: form.expectation,
        code: registrationCode,
      });

      router.push(`/confirmation?${params.toString()}`);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to connect to the registration service. Please try again."
      );

      setSubmitting(false);
    }
  };

  if (!REGISTRATION_OPEN) {
    return (
      <main className="closed-page">
        <div className="closed-card">
          <img
            src="/logo.png"
            alt="RCCG The Connect"
            className="closed-logo"
          />

          <div className="closed-event">
            WORD CONFERENCE 2026
          </div>

          <h1>Registration Closed</h1>

          <p>
            Registration for Word Conference 2026 has officially closed.
          </p>

          <div className="closed-divider" />

          <p className="closed-small">
            Thank you and God bless you.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="register-page">

      {/* HEADER */}
      <header className="top-header">
        <div className="top-header-inner">

          <div className="brand">

            <img
              src="/logo.png"
              alt="RCCG The Connect"
              className="brand-logo"
            />

            <div className="brand-text">

              <div className="brand-title">
                WORD CONFERENCE 2026
              </div>

              <div className="brand-subtitle">
                RCCG THE CONNECT
              </div>

            </div>

          </div>

          <div className="header-label">
            REGISTRATION PORTAL
          </div>

        </div>
      </header>


      {/* MAIN REGISTRATION AREA */}
      <section className="register-container">

        <div className="register-card">


          {/* FLYER */}
          <div className="flyer-section">

            <img
              src="/flyer.jpg"
              alt="Word Conference 2026 Flyer"
              className="flyer-image"
            />

            <a
              href="/flyer.jpg"
              target="_blank"
              rel="noopener noreferrer"
              className="flyer-button"
            >
              <span className="flyer-icon">
                ▧
              </span>

              VIEW PROGRAM FLYER
            </a>

          </div>


          {/* INTRO */}
          <div className="form-intro">

            <h1>
              REGISTRATION INFORMATION
            </h1>

            <p>
              Please fill in your details below to register
              for Word Conference 2026.
            </p>

          </div>


          {/* FORM */}
          <form
            className="register-form"
            onSubmit={handleSubmit}
          >


            {/* PERSONAL INFORMATION */}
            <div className="form-section-label">
              PERSONAL INFORMATION
            </div>


            {/* NAME + EMAIL */}
            <div className="form-row">

              <div className="form-group">

                <label htmlFor="name">
                  Full Name <span>*</span>
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  required
                />

              </div>


              <div className="form-group">

                <label htmlFor="email">
                  Email Address <span>*</span>
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />

              </div>

            </div>


            {/* GENDER + DENOMINATION */}
            <div className="form-row">

              <div className="form-group">

                <label htmlFor="gender">
                  Gender <span>*</span>
                </label>

                <select
                  id="gender"
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select gender
                  </option>

                  <option value="Male">
                    Male
                  </option>

                  <option value="Female">
                    Female
                  </option>

                </select>

              </div>


              <div className="form-group">

                <label htmlFor="denomination">
                  Denomination / Church <span>*</span>
                </label>

                <select
                  id="denomination"
                  name="denomination"
                  value={form.denomination}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select your church / denomination
                  </option>

                  <option value="RCCG">
                    RCCG — Redeemed Christian Church of God
                  </option>

                  <option value="Living Faith Church">
                    Living Faith Church (Winners Chapel)
                  </option>

                  <option value="Deeper Life Bible Church">
                    Deeper Life Bible Church
                  </option>

                  <option value="Christ Embassy">
                    Christ Embassy
                  </option>

                  <option value="MFM">
                    Mountain of Fire and Miracles Ministries (MFM)
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

              </div>

            </div>


            {/* OTHER CHURCH FIELD */}
            {form.denomination === "Other" && (
              <div className="form-group">

                <label htmlFor="otherDenomination">
                  Please specify your church / denomination{" "}
                  <span>*</span>
                </label>

                <input
                  id="otherDenomination"
                  name="otherDenomination"
                  type="text"
                  value={form.otherDenomination}
                  onChange={handleChange}
                  placeholder="Enter your church or denomination"
                  required
                />

              </div>
            )}


            {/* ADDITIONAL INFORMATION */}
            <div className="form-section-label">
              ADDITIONAL INFORMATION
            </div>


            {/* HEALTH */}
            <div className="form-group">

              <label htmlFor="health">
                Health Condition
                <small> (optional)</small>
              </label>

              <input
                id="health"
                name="health"
                type="text"
                value={form.health}
                onChange={handleChange}
                placeholder="Any health condition we should know about"
              />

            </div>


            {/* EXPECTATION */}
            <div className="form-group">

              <label htmlFor="expectation">
                Expectation for the Conference <span>*</span>
              </label>

              <textarea
                id="expectation"
                name="expectation"
                rows={4}
                value={form.expectation}
                onChange={handleChange}
                placeholder="What do you hope to gain from Word Conference 2026?"
                required
              />

            </div>


            {/* ERROR */}
            {error && (
              <div className="form-error">
                {error}
              </div>
            )}


            {/* SUBMIT */}
            <button
              type="submit"
              className="register-btn"
              disabled={submitting}
            >
              {submitting
                ? "SUBMITTING..."
                : "REGISTER NOW"}
            </button>

          </form>


          {/* FOOTER */}
          <div className="form-footer">
            WORD CONFERENCE 2026
          </div>

        </div>

      </section>

    </main>
  );
}
