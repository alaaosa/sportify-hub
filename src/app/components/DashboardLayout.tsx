import { useState } from "react";
import {
  LayoutDashboard,
  Dumbbell,
  Calendar,
  Users,
  CreditCard,
  BookOpen,
  UserCheck,
  DollarSign,
  BarChart2,
  Settings,
  Bell,
  Search,
  ChevronRight,
  LogOut,
  Zap,
  Menu,
  X,
} from "lucide-react";
import { Page } from "./Navbar";

interface DashboardLayoutProps {
  navigate: (page: Page) => void;
  currentPage: Page;
  children: React.ReactNode;
}

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", page: "dashboard" as Page },
  { icon: Dumbbell, label: "Activities", page: "activities" as Page },
  { icon: Calendar, label: "Manage Events", page: "events" as Page },
  { icon: Users, label: "Members", page: "members" as Page },
  { icon: CreditCard, label: "Membership Plans", page: "memberships" as Page },
  { icon: BookOpen, label: "Bookings", page: "bookings" as Page },
  { icon: UserCheck, label: "Coaches", page: "coaches" as Page },
  { icon: DollarSign, label: "Payments", page: "payments" as Page },
  { icon: BarChart2, label: "Reports", page: "reports" as Page },
];

export function DashboardLayout({
  navigate,
  currentPage,
  children,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const notifications: any[] = [];

  const SidebarContent = () => (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {}
      <div style={{ padding: "20px 16px", borderBottom: "1px solid #1E3A5F" }}>
        <button
          onClick={() => navigate("landing")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: "linear-gradient(135deg, #0F62FE 0%, #0043CE 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(15,98,254,0.4)",
            }}
          >
            <Zap size={18} color="white" fill="white" />
          </div>
          {sidebarOpen && (
            <span style={{ fontSize: 17, fontWeight: 800, color: "white" }}>
              Sportify<span style={{ color: "#3B82F6" }}>Hub</span>
            </span>
          )}
        </button>
      </div>

      {}
      {sidebarOpen && (
        <div
          style={{
            margin: "16px",
            padding: "14px",
            background: "#1E3A5F",
            borderRadius: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: "linear-gradient(135deg, #22C55E, #16A34A)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                fontWeight: 800,
                color: "white",
              }}
            >
              A
            </div>
            <div>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "white",
                  margin: 0,
                }}
              >
                Arena Sports Club
              </p>
              <p style={{ fontSize: 11, color: "#94A3B8", margin: 0 }}>
                Club Owner
              </p>
            </div>
          </div>
        </div>
      )}

      {}
      <nav style={{ flex: 1, padding: "8px 12px", overflowY: "auto" }}>
        {sidebarItems.map((item) => {
          const active = currentPage === item.page;
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.page)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                width: "100%",
                padding: "10px 12px",
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                marginBottom: 2,
                transition: "all 0.2s",
                background: active
                  ? "linear-gradient(135deg, #0F62FE, #0043CE)"
                  : "transparent",
                color: active ? "white" : "#94A3B8",
                justifyContent: sidebarOpen ? "flex-start" : "center",
              }}
              onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.background = "#1E3A5F";
              }}
              onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.background = "transparent";
              }}
            >
              <item.icon size={18} />
              {sidebarOpen && (
                <span style={{ fontSize: 14, fontWeight: active ? 600 : 400 }}>
                  {item.label}
                </span>
              )}
              {sidebarOpen && active && (
                <ChevronRight size={14} style={{ marginLeft: "auto" }} />
              )}
            </button>
          );
        })}
      </nav>

      {}
      <div style={{ padding: "12px", borderTop: "1px solid #1E3A5F" }}>
        <button
          onClick={() => navigate("landing")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            width: "100%",
            padding: "10px 12px",
            borderRadius: 10,
            border: "none",
            cursor: "pointer",
            background: "transparent",
            color: "#94A3B8",
            transition: "all 0.2s",
            justifyContent: sidebarOpen ? "flex-start" : "center",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#1E3A5F")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
        >
          <LogOut size={18} />
          {sidebarOpen && <span style={{ fontSize: 14 }}>Exit Dashboard</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#F8FAFC",
        overflow: "hidden",
      }}
    >
      {}
      <aside
        style={{
          width: sidebarOpen ? 240 : 68,
          background: "#0D1B2A",
          flexShrink: 0,
          transition: "width 0.3s ease",
          overflow: "hidden",
          position: "relative",
          zIndex: 20,
        }}
        className="hidden md:block"
      >
        <SidebarContent />
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            position: "absolute",
            right: -12,
            top: 76,
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: "#0F62FE",
            border: "2px solid #0D1B2A",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 10,
          }}
        >
          <ChevronRight
            size={12}
            color="white"
            style={{
              transform: sidebarOpen ? "rotate(180deg)" : "none",
              transition: "transform 0.3s",
            }}
          />
        </button>
      </aside>

      {}
      {mobileSidebarOpen && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 40 }}
          className="md:hidden"
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
            }}
            onClick={() => setMobileSidebarOpen(false)}
          />
          <aside
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: 240,
              background: "#0D1B2A",
              zIndex: 50,
            }}
          >
            <SidebarContent />
          </aside>
        </div>
      )}

      {}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {}
        <header
          style={{
            background: "white",
            borderBottom: "1px solid #E5E7EB",
            padding: "0 24px",
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button
              onClick={() => setMobileSidebarOpen(true)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 4,
              }}
              className="md:hidden"
            >
              <Menu size={22} color="#374151" />
            </button>
            {}
            <div style={{ position: "relative" }}>
              <Search
                size={16}
                color="#9CA3AF"
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              />
              <input
                placeholder="Search members, bookings..."
                style={{
                  paddingLeft: 36,
                  paddingRight: 16,
                  height: 38,
                  border: "1.5px solid #E5E7EB",
                  borderRadius: 10,
                  background: "#F9FAFB",
                  fontSize: 13,
                  color: "#374151",
                  outline: "none",
                  width: 260,
                }}
                onFocus={(e) => (e.target.style.borderColor = "#0F62FE")}
                onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
              />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: "#F9FAFB",
                  border: "1.5px solid #E5E7EB",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  position: "relative",
                }}
              >
                <Bell size={18} color="#374151" />
                <span
                  style={{
                    position: "absolute",
                    top: 6,
                    right: 6,
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#EF4444",
                    border: "1.5px solid white",
                  }}
                />
              </button>
              {notifOpen && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: 48,
                    width: 320,
                    background: "white",
                    borderRadius: 16,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
                    border: "1px solid #E5E7EB",
                    zIndex: 100,
                  }}
                >
                  <div
                    style={{
                      padding: "16px 20px",
                      borderBottom: "1px solid #F3F4F6",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: 15,
                        color: "#111827",
                      }}
                    >
                      Notifications
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        color: "#0F62FE",
                        cursor: "pointer",
                        fontWeight: 500,
                      }}
                    >
                      Mark all read
                    </span>
                  </div>
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      style={{
                        padding: "14px 20px",
                        borderBottom: "1px solid #F3F4F6",
                        display: "flex",
                        gap: 12,
                        cursor: "pointer",
                        background: n.unread ? "#F0F7FF" : "white",
                      }}
                    >
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: n.unread ? "#0F62FE" : "transparent",
                          marginTop: 6,
                          flexShrink: 0,
                        }}
                      />
                      <div>
                        <p
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "#111827",
                            margin: 0,
                          }}
                        >
                          {n.title}
                        </p>
                        <p
                          style={{
                            fontSize: 12,
                            color: "#6B7280",
                            margin: "2px 0 0",
                          }}
                        >
                          {n.text}
                        </p>
                        <p
                          style={{
                            fontSize: 11,
                            color: "#9CA3AF",
                            margin: "4px 0 0",
                          }}
                        >
                          {n.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "6px 14px",
                borderRadius: 10,
                border: "1.5px solid #E5E7EB",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #0F62FE, #22C55E)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "white",
                }}
              >
                MC
              </div>
              <div className="hidden md:block">
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#111827",
                    margin: 0,
                  }}
                >
                  Marcus Chen
                </p>
                <p style={{ fontSize: 11, color: "#6B7280", margin: 0 }}>
                  Club Owner
                </p>
              </div>
            </div>
          </div>
        </header>

        {}
        <main style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
