import React, { useRef } from "react";
import {
  SiPython,
  SiReact,
  SiFigma,
  SiZapier,
  SiWordpress,
  SiWebflow,
  SiFlutter,
} from "react-icons/si";
import { ArrowRight, Mail, Sparkles } from "lucide-react";

const techItems = [
  { label: "Python", icon: <SiPython /> },
  { label: "React", icon: <SiReact /> },
  { label: "Figma", icon: <SiFigma /> },
  { label: "Zapier", icon: <SiZapier /> },
  { label: "WordPress", icon: <SiWordpress /> },
  { label: "Webflow", icon: <SiWebflow /> },
  { label: "Flutter", icon: <SiFlutter /> },
];

const cards = [
  {
    title: "Business strategy",
    description:
      "We dig deep before we design. Strategy first, every time.",
  },
  {
    title: "Design & execution",
    description:
      "Prototypes that feel real, built for launch and growth.",
  },
  {
    title: "Growth & analytics",
    description:
      "We track what works, then build the next move from that data.",
  },
];

const reviews = [
  {
    quote: "The VR experience made our brand feel modern and effortless.",
    author: "– Product Lead, Studio X",
  },
  {
    quote: "Everything was delivered with speed, quality, and care.",
    author: "– Founder, Bright Labs",
  },
];

const ScreenWebsite = () => {
  const containerRef = useRef(null);

  const scrollToSection = (sectionId) => {
    const container = containerRef.current;
    const target = container?.querySelector(`#${sectionId}`);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "rgba(12, 14, 19, 0.92)",
        borderRadius: "28px",
        border: "1px solid rgba(255,255,255,0.08)",
        overflow: "hidden",
        color: "#f8fafc",
        fontFamily: "Inter, sans-serif",
        boxShadow: "0 0 60px rgba(0, 0, 0, 0.28)",
      }}
    >
      <div
        style={{
          padding: "18px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(5, 7, 12, 0.9)",
        }}
      >
        <div>
          <div style={{ fontSize: "12px", letterSpacing: "0.22em", opacity: 0.65 }}>
            ALC VR PORTAL
          </div>
          <div style={{ marginTop: "4px", fontSize: "18px", fontWeight: 700 }}>
            Welcome to the website shell
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          {[["home", "Home"], ["services", "Services"], ["stats", "Stats"], ["contact", "Contact"]].map(
            ([id, label]) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                style={{
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.08)",
                  color: "#f8fafc",
                  borderRadius: "999px",
                  padding: "10px 14px",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                {label}
              </button>
            )
          )}
        </div>
      </div>

      <div
        ref={containerRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "28px",
          gap: "28px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <section id="home" style={{ paddingBottom: "26px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "24px", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: "320px" }}>
              <div style={{ fontSize: "44px", fontWeight: 800, lineHeight: 1.02, marginBottom: "18px" }}>
                Your web experience, fully inside the screen.
              </div>
              <p style={{ fontSize: "16px", lineHeight: 1.8, opacity: 0.8, maxWidth: "680px" }}>
                Scroll through the interactive site content while the metro animation keeps running behind the glass.
                This is the same design direction as the app layout from App.jsx, now embedded inside the transparent panel.
              </p>
            </div>

            <div
              style={{
                minWidth: "260px",
                borderRadius: "24px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                padding: "20px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                <Sparkles size={20} />
                <span style={{ fontWeight: 700 }}>Fast-track innovation</span>
              </div>
              <p style={{ opacity: 0.8, lineHeight: 1.7, fontSize: "14px" }}>
                Compact, premium content designed to feel like the main website, scaled to fit the screen surface.
              </p>
            </div>
          </div>
        </section>

        <section id="services" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "18px" }}>
          {cards.map((card) => (
            <div
              key={card.title}
              style={{
                borderRadius: "24px",
                padding: "22px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                minHeight: "170px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div style={{ fontSize: "16px", fontWeight: 700, marginBottom: "16px" }}>{card.title}</div>
              <div style={{ opacity: 0.8, lineHeight: 1.8, fontSize: "14px" }}>{card.description}</div>
            </div>
          ))}
        </section>

        <section style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
            <div style={{ flex: 1, minWidth: "320px" }}>
              <div style={{ fontSize: "24px", fontWeight: 700, marginBottom: "12px" }}>Built for every workflow</div>
              <p style={{ opacity: 0.8, lineHeight: 1.8, fontSize: "14px" }}>
                The screen runs the site in a floating web UI. Interactive buttons, cards, and scroll sections keep it feeling like a full application.
              </p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" }}>
              {techItems.map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 14px",
                    borderRadius: "999px",
                    background: "rgba(255,255,255,0.06)",
                    fontSize: "13px",
                  }}
                >
                  <span style={{ display: "grid", placeItems: "center" }}>{item.icon}</span>
                  {item.label}
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "18px",
            }}
          >
            {reviews.map((review) => (
              <div
                key={review.quote}
                style={{
                  borderRadius: "24px",
                  padding: "22px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div style={{ fontSize: "15px", lineHeight: 1.8, opacity: 0.85 }}>
                  “{review.quote}”
                </div>
                <div style={{ marginTop: "18px", opacity: 0.7, fontSize: "13px", fontWeight: 600 }}>
                  {review.author}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="stats" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "18px" }}>
          <div style={{ padding: "22px", borderRadius: "24px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ fontSize: "18px", fontWeight: 700, marginBottom: "12px" }}>80% faster time-to-market</div>
            <div style={{ opacity: 0.78, lineHeight: 1.8, fontSize: "14px" }}>
              We keep launches moving without sacrificing polish.
            </div>
          </div>
          <div style={{ padding: "22px", borderRadius: "24px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ fontSize: "18px", fontWeight: 700, marginBottom: "12px" }}>Design and engineering in sync</div>
            <div style={{ opacity: 0.78, lineHeight: 1.8, fontSize: "14px" }}>
              Every screen and interaction is built with purpose.
            </div>
          </div>
          <div style={{ padding: "22px", borderRadius: "24px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ fontSize: "18px", fontWeight: 700, marginBottom: "12px" }}>Interactive, not just impressive</div>
            <div style={{ opacity: 0.78, lineHeight: 1.8, fontSize: "14px" }}>
              The website is designed to feel alive at every step.
            </div>
          </div>
        </section>

        <section id="contact" style={{ borderRadius: "24px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", padding: "30px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "20px", flexWrap: "wrap" }}>
            <div style={{ minWidth: "320px", maxWidth: "640px" }}>
              <div style={{ fontSize: "24px", fontWeight: 700, marginBottom: "14px" }}>Get in touch</div>
              <p style={{ opacity: 0.8, lineHeight: 1.8, fontSize: "14px" }}>
                The full website runs inside the panel and can be used as an interactive preview while the metro story continues.
              </p>
            </div>
            <button
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                minWidth: "170px",
                borderRadius: "999px",
                padding: "14px 18px",
                background: "#2563eb",
                color: "white",
                border: "none",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              <Mail size={16} /> Contact us
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ScreenWebsite;
