import { useState } from "react";
import {
  HelpCircle,
  MessageCircleQuestion,
  ShieldCheck,
  Clock3,
  Sparkles,
} from "lucide-react";
import { Navbar } from "./Navbar";
import { Page } from "./Navbar";

interface FAQPageProps {
  navigate: (page: Page) => void;
}

const faqs = [
  {
    question: "How can I book a sports session?",
    answer:
      "Choose a club or activity from the homepage, click the Book button, select an available time slot, and confirm — your booking will be completed immediately.",
    icon: Clock3,
  },
  {
    question: "Can I cancel or modify my booking later?",
    answer:
      "Yes — you can edit or cancel bookings from the Bookings section. Please check the club's cancellation policy; most changes must be made at least 24 hours before the scheduled time.",
    icon: MessageCircleQuestion,
  },
  {
    question: "What payment methods are accepted?",
    answer:
      "The platform supports card payments and common digital wallets. Some clubs may offer pay-on-arrival depending on their policy.",
    icon: ShieldCheck,
  },
  {
    question: "Are there activities suitable for children?",
    answer:
      "Yes — the platform lists family- and kid-friendly classes and activities, including beginner programs taught by qualified instructors.",
    icon: Sparkles,
  },
];

export function FAQPage({ navigate }: FAQPageProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC" }}>
      <Navbar navigate={navigate} currentPage="faq" />
      <div
        style={{ maxWidth: 980, margin: "0 auto", padding: "32px 24px 60px" }}
      >
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 8,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "#EFF4FF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <HelpCircle size={22} color="#0F62FE" />
            </div>
            <div>
              <h1
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  color: "#111827",
                  margin: 0,
                }}
              >
                Help Center
              </h1>
              <p style={{ fontSize: 14, color: "#6B7280", margin: "4px 0 0" }}>
                Common questions about bookings, activities, and payments
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gap: 12 }}>
          {faqs.map((item, index) => {
            const Icon = item.icon;
            const isOpen = openIndex === index;

            return (
              <div
                key={item.question}
                style={{
                  background: "white",
                  borderRadius: 16,
                  border: "1px solid #E5E7EB",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
                }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "18px 20px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: "#F5F3FF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Icon size={18} color="#7C3AED" />
                    </div>
                    <span
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: "#111827",
                      }}
                    >
                      {item.question}
                    </span>
                  </div>
                  <span style={{ fontSize: 18, color: "#6B7280" }}>
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                {isOpen && (
                  <div style={{ padding: "0 20px 18px 68px" }}>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 14,
                        lineHeight: 1.7,
                        color: "#4B5563",
                      }}
                    >
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
