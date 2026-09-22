"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import QRCode from "react-qr-code";
import html2canvas from "html2canvas";
import "./confirmation.css";

function ConfirmationContent() {
  const searchParams = useSearchParams();

  const name = searchParams.get("name") || "";
  const email = searchParams.get("email") || "";
  const gender = searchParams.get("gender") || "";
  const denomination = searchParams.get("denomination") || "";
  const health = searchParams.get("health") || "";
  const expectation = searchParams.get("expectation") || "";
  const code = searchParams.get("code") || "";

  const downloadPNG = async () => {
    const ticket = document.getElementById("ticket");

    if (!ticket) return;

    const canvas = await html2canvas(ticket, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const image = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = image;
    link.download = `${name}-Retreat-Ticket.png`;
    link.click();
  };

  return (
    <div className="confirmation-container">
      <div id="ticket" className="confirmation-card">
        <img src="/logo.png" alt="The Connect" className="ticket-logo" />

        <h1 className="success-title">Registration Successful </h1>

        <p className="success-text">
          Your registration for the Word Conference 2026 has
          been completed successfully.
        </p>

        <div className="details">
          <p><strong>Name:</strong> {name}</p>
          <p><strong>Email:</strong> {email}</p>
          <p><strong>Gender:</strong> {gender}</p>
          <p><strong>Denomination:</strong> {denomination}</p>
          <p><strong>Health:</strong> {health || "None"}</p>
          <p><strong>Expectation:</strong> {expectation}</p>
          <p className="reg-code"><strong>Registration Code:</strong> {code}</p>
        </div>

        <div className="qr-wrapper">
          <QRCode
            value={JSON.stringify({
              name,
              email,
              gender,
              denomination,
              health,
              expectation,
              code,
            })}
            size={200}
          />
        </div>
      </div>

      <div className="download-wrapper">
        <button className="download-btn" onClick={downloadPNG}>
          Download Ticket
        </button>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div>Loading confirmation...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
