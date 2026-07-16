import {
  Zap,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Page } from "./Navbar";

interface FooterProps {
  navigate: (page: Page) => void;
}

export function Footer({ navigate }: FooterProps) {
  const sports = [
    "Football",
    "Basketball",
    "Swimming",
    "Tennis",
    "Gym & Fitness",
    "Yoga",
    "Martial Arts",
    "Volleyball",
  ];

  const links = [
    { label: "About Us", page: "landing" as Page },
    { label: "Find Clubs", page: "club-profile" as Page },
    { label: "Events", page: "events" as Page },
    { label: "Dashboard", page: "dashboard" as Page },
  ];

  return (
    <footer style={{ background: "#0D1B2A", color: "#CBD5E1" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "64px 24px 0" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 48,
          }}
        >
          {}
          <div style={{ gridColumn: "span 1" }}>
            <button
              onClick={() => navigate("landing")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "none",
                border: "none",
                cursor: "pointer",
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background:
                    "linear-gradient(135deg, #0F62FE 0%, #0043CE 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Zap size={18} color="white" fill="white" />
              </div>
              <span style={{ fontSize: 18, fontWeight: 800, color: "white" }}>
                Sportify<span style={{ color: "#0F62FE" }}>Hub</span>
              </span>
            </button>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.7,
                color: "#94A3B8",
                marginBottom: 24,
              }}
            >
              The all-in-one platform to discover, book, and manage sports
              clubs, activities, and events near you.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <button
                  key={i}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "#1E293B",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#0F62FE")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "#1E293B")
                  }
                >
                  <Icon size={16} color="#CBD5E1" />
                </button>
              ))}
            </div>
          </div>

          {}
          <div>
            <h4
              style={{
                color: "white",
                fontWeight: 700,
                marginBottom: 20,
                fontSize: 15,
              }}
            >
              Quick Links
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {links.map((item) => (
                <button
                  key={item.label}
                  onClick={() => navigate(item.page)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#94A3B8",
                    fontSize: 14,
                    textAlign: "left",
                    padding: 0,
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#0F62FE")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#94A3B8")
                  }
                >
                  {item.label}
                </button>
              ))}
              <button
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#94A3B8",
                  fontSize: 14,
                  textAlign: "left",
                  padding: 0,
                }}
              >
                Memberships
              </button>
              <button
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#94A3B8",
                  fontSize: 14,
                  textAlign: "left",
                  padding: 0,
                }}
              >
                Pricing
              </button>
            </div>
          </div>

          {}
          <div>
            <h4
              style={{
                color: "white",
                fontWeight: 700,
                marginBottom: 20,
                fontSize: 15,
              }}
            >
              Sports Categories
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {sports.map((sport) => (
                <button
                  key={sport}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#94A3B8",
                    fontSize: 14,
                    textAlign: "left",
                    padding: 0,
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#22C55E")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#94A3B8")
                  }
                >
                  {sport}
                </button>
              ))}
            </div>
          </div>

          {}
          <div>
            <h4
              style={{
                color: "white",
                fontWeight: 700,
                marginBottom: 20,
                fontSize: 15,
              }}
            >
              Support
            </h4>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                marginBottom: 28,
              }}
            >
              {[
                "Help Center",
                "Privacy Policy",
                "Terms of Service",
                "Cookie Policy",
                "Accessibility",
                "Partner Program",
              ].map((item) => (
                <button
                  key={item}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#94A3B8",
                    fontSize: 14,
                    textAlign: "left",
                    padding: 0,
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
            <h4
              style={{
                color: "white",
                fontWeight: 700,
                marginBottom: 16,
                fontSize: 15,
              }}
            >
              Contact
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Mail size={15} color="#0F62FE" />
                <span style={{ fontSize: 13, color: "#94A3B8" }}>
                  hello@sportifyhub.com
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Phone size={15} color="#0F62FE" />
                <span style={{ fontSize: 13, color: "#94A3B8" }}>
                  +1 (800) 123-4567
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <MapPin size={15} color="#0F62FE" />
                <span style={{ fontSize: 13, color: "#94A3B8" }}>
                  San Francisco, CA
                </span>
              </div>
            </div>
          </div>
        </div>

        {}
        <div
          style={{
            borderTop: "1px solid #1E293B",
            marginTop: 48,
            padding: "24px 0",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
          }}
        >
          <p style={{ fontSize: 13, color: "#64748B" }}>
            © 2026 SportifyHub. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: 24 }}>
            <span style={{ fontSize: 13, color: "#64748B" }}>
              Privacy Policy
            </span>
            <span style={{ fontSize: 13, color: "#64748B" }}>
              Terms of Service
            </span>
            <span style={{ fontSize: 13, color: "#64748B" }}>
              Cookie Policy
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
