import QRCode from "react-qr-code";

const TRANSPORTATION_GROUP_URL =
  "https://chat.whatsapp.com/KBaT0KcHHvb3xEt1Vppugy";

export default function TransportationSection() {
  return (
    <section className="transportation-section" aria-labelledby="transportation-title">
      <div className="transportation-content">
        <p className="transportation-label">CONFERENCE TRANSPORTATION</p>
        <h2 id="transportation-title">Need transportation to the conference?</h2>
        <p className="transportation-description">
          Join the Word Conference Transportation group 2026 on WhatsApp
          for pickup locations, departure times, and transport arrangements.
        </p>
        <p className="transportation-description">
          <strong>Transportation locations:</strong> Lusada, Agbara, and Badagry.
        </p>
        <a
          href={TRANSPORTATION_GROUP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="transportation-link"
        >
          Join Transportation WhatsApp Group
          <span className="transportation-link-note">Opens in a new tab</span>
        </a>
      </div>
      <div className="transportation-qr">
        <QRCode
          value={TRANSPORTATION_GROUP_URL}
          size={128}
          title="Scan to join the Word Conference Transportation WhatsApp group"
        />
        <p>Scan to join the group</p>
      </div>
    </section>
  );
}
