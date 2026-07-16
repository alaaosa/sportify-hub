import {
  Users,
  BookOpen,
  DollarSign,
  Calendar,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  MoreHorizontal,
  Eye,
  Check,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { DashboardLayout } from "./DashboardLayout";
import { Page } from "./Navbar";
import { useEffect, useState } from "react";
import { useClubId } from "../utils/club";
import axios from "axios";

const getApiBaseUrl = () => {
  const configuredUrl = (import.meta as any).env?.VITE_API_URL;
  if (typeof configuredUrl === "string" && configuredUrl.trim()) {
    return configuredUrl.replace(/\/$/, "");
  }
  return "http://localhost:4000";
};

const API_BASE_URL = getApiBaseUrl();

const getAuthHeaders = (): Record<string, string> => {
  if (typeof window === "undefined") return { Accept: "application/json" };
  const token = window.localStorage.getItem("token");
  const headers: Record<string, string> = { Accept: "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
};

const areaData = [
  { month: "Jan", revenue: 2400, bookings: 2210 },
  { month: "Feb", revenue: 1398, bookings: 2290 },
  { month: "Mar", revenue: 9800, bookings: 2000 },
  { month: "Apr", revenue: 3908, bookings: 2108 },
  { month: "May", revenue: 4800, bookings: 2810 },
  { month: "Jun", revenue: 3800, bookings: 2290 },
  { month: "Jul", revenue: 4300, bookings: 2100 },
];

const barData = [
  { day: "Mon", slots: 24 },
  { day: "Tue", slots: 18 },
  { day: "Wed", slots: 32 },
  { day: "Thu", slots: 28 },
  { day: "Fri", slots: 35 },
  { day: "Sat", slots: 42 },
  { day: "Sun", slots: 19 },
];

const recentMembers = [
  { name: "Aisha Ali", joined: "2 days ago" },
  { name: "Omar Khaled", joined: "1 week ago" },
  { name: "Sara Nabil", joined: "3 weeks ago" },
];

let recentBookings: any[] = [];

let statCards: any[] = [];

const statusColors: Record<
  string,
  { bg: string; text: string; label: string }
> = {
  confirmed: { bg: "#F0FDF4", text: "#16A34A", label: "Confirmed" },
  completed: { bg: "#EFF4FF", text: "#0F62FE", label: "Completed" },
  cancelled: { bg: "#FFF1F2", text: "#EF4444", label: "Cancelled" },
};

const planColors: Record<string, string> = {
  Elite: "#F59E0B",
  Premium: "#0F62FE",
  Basic: "#6B7280",
};

const BOOKINGS_PER_PAGE = 8;

interface DashboardProps {
  navigate: (page: Page) => void;
}

export function Dashboard({ navigate }: DashboardProps) {
  const [bookings, setBookings] = useState<any[]>([]);
  const [stats, setStats] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [upcomingActivities, setUpcomingActivities] = useState<any[]>([]);
  const clubId = useClubId();

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [bRes, sRes] = await Promise.allSettled([
          axios
            .get(`${API_BASE_URL}/club/${clubId}/dashboard/bookings`, {
              headers: getAuthHeaders(),
            })
            .catch(() => null),
          axios
            .get(`${API_BASE_URL}/club/${clubId}/dashboard/stats`, {
              headers: getAuthHeaders(),
            })
            .catch(() => null),
        ]);

        const aRes = await axios
          .get(`${API_BASE_URL}/club/${clubId}/activity`, {
            headers: getAuthHeaders(),
          })
          .catch(() => null);

        if (bRes.status === "fulfilled" && bRes.value) {
          const payload = bRes.value.data;
          const items = Array.isArray(payload?.data) ? payload.data : [];
          const mapped = items.map((bk: any) => ({
            id: `#B-${bk.id}`,
            member: bk.user?.fullName || "Member",
            avatar: bk.user?.fullName
              ? bk.user.fullName
                  .split(" ")
                  .map((p: string) => p[0])
                  .slice(0, 2)
                  .join("")
              : "U",
            sport:
              bk.slot?.activity?.name ||
              bk.slot?.activity?.category ||
              "Activity",
            date: bk.createdAt
              ? new Date(bk.createdAt).toLocaleString()
              : "â€”",
            status: "confirmed",
            amount: bk.slot?.activity?.price ?? 0,
          }));
          setBookings(mapped);
        }

        if (sRes.status === "fulfilled" && sRes.value) {
          const payload = sRes.value.data;
          setStats(payload?.data ?? null);
        }

        if (aRes) {
          const payload = aRes.data;
          const list = Array.isArray(payload?.data) ? payload.data : [];
          const mappedActivities = list.map((it: any) => ({
            id: it.id,
            name: it.name || it.title || "Activity",
            coach: it.coach || it.coach_name || "Coach",
            time:
              it.next_slot && it.next_slot.start_time
                ? it.next_slot.start_time
                : it.time || "TBD",
            slots: Array.isArray(it.slots)
              ? it.slots.length
              : Number(it.slots ?? 0),
            maxSlots: it.capacity ?? it.max_capacity ?? 0,
            color: it.color || "#0F62FE",
          }));
          setUpcomingActivities(mappedActivities.slice(0, 6));
        } else {
          setUpcomingActivities([]);
        }
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      }
    };

    void loadDashboard();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [bookings]);

  const statCardsLocal = stats
    ? [
        {
          title: "Total Members",
          value: String(stats.totalMembers || 0),
          change: "+0%",
          up: true,
          icon: Users,
          color: "#0F62FE",
          bg: "#EFF4FF",
        },
        {
          title: "Today's Bookings",
          value: String(stats.todaysBookings || 0),
          change: "+0%",
          up: true,
          icon: BookOpen,
          color: "#22C55E",
          bg: "#F0FDF4",
        },
        {
          title: "Monthly Revenue",
          value: `$${Number(stats.monthlyRevenue || 0)}`,
          change: "+0%",
          up: true,
          icon: DollarSign,
          color: "#F59E0B",
          bg: "#FFFBEB",
        },
        {
          title: "Upcoming Events",
          value: String(stats.upcomingEvents || 0),
          change: "-0%",
          up: false,
          icon: Calendar,
          color: "#8B5CF6",
          bg: "#F5F3FF",
        },
      ]
    : [];

  const totalPages = Math.ceil(bookings.length / BOOKINGS_PER_PAGE);
  const startIndex = (currentPage - 1) * BOOKINGS_PER_PAGE;
  const paginatedBookings = bookings.slice(
    startIndex,
    startIndex + BOOKINGS_PER_PAGE,
  );

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <DashboardLayout navigate={navigate} currentPage="dashboard">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 28,
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: "#111827",
            }}
          >
            Dashboard
          </h1>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <select
            style={{
              padding: "8px 14px",
              borderRadius: 10,
              border: "1.5px solid #E5E7EB",
              background: "white",
              color: "#374151",
              cursor: "pointer",
              outline: "none",
            }}
          >
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 3 months</option>
          </select>
          <button
            style={{
              padding: "8px 18px",
              borderRadius: 10,
              background: "linear-gradient(135deg, #0F62FE, #0043CE)",
              color: "white",
              fontSize: 13,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(15,98,254,0.3)",
            }}
          >
            Export Report
          </button>
        </div>
      </div>

      {}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 20,
          marginBottom: 28,
        }}
      >
        {statCardsLocal.map((card) => (
          <div
            key={card.title}
            style={{
              background: "white",
              borderRadius: 16,
              padding: "20px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              border: "1px solid #F3F4F6",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)")
            }
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: card.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <card.icon size={20} color={card.color} />
              </div>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: card.up ? "#22C55E" : "#EF4444",
                  background: card.up ? "#F0FDF4" : "#FFF1F2",
                  padding: "3px 8px",
                  borderRadius: 100,
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                }}
              >
                {card.up ? (
                  <TrendingUp size={11} />
                ) : (
                  <TrendingDown size={11} />
                )}{" "}
                {card.change}
              </span>
            </div>
            <p
              style={{
                fontSize: 27,
                fontWeight: 800,
                color: "#111827",
                margin: "0 0 4px",
                letterSpacing: "-0.5px",
              }}
            >
              {card.value}
            </p>
            <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>
              {card.title}
            </p>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: 20,
          marginBottom: 28,
        }}
        className="grid-cols-1 lg:grid-cols-5"
      >
        <div
          style={{
            background: "white",
            borderRadius: 16,
            padding: "24px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            gridColumn: "span 3",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#111827",
                  margin: 0,
                }}
              >
                Revenue & Bookings
              </h3>
              <p style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>
                Past 7 months performance
              </p>
            </div>
            <div style={{ display: "flex", gap: 16 }}>
              {[
                { color: "#0F62FE", label: "Revenue" },
                { color: "#22C55E", label: "Bookings" },
              ].map((l) => (
                <div
                  key={l.label}
                  style={{ display: "flex", alignItems: "center", gap: 6 }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: l.color,
                    }}
                  />
                  <span style={{ fontSize: 12, color: "#6B7280" }}>
                    {l.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart
              data={areaData}
              margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0F62FE" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#0F62FE" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "#9CA3AF" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#9CA3AF" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "none",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  fontSize: 13,
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#0F62FE"
                strokeWidth={2.5}
                fill="url(#colorRevenue)"
                dot={false}
              />
              <Area
                type="monotone"
                dataKey="bookings"
                stroke="#22C55E"
                strokeWidth={2.5}
                fill="url(#colorBookings)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {}
        <div
          style={{
            background: "white",
            borderRadius: 16,
            padding: "24px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            gridColumn: "span 2",
          }}
        >
          <div style={{ marginBottom: 20 }}>
            <h3
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "#111827",
                margin: 0,
              }}
            >
              Weekly Slots
            </h3>
            <p style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>
              Booked slots this week
            </p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={barData}
              margin={{ top: 5, right: 0, left: -30, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#F3F4F6"
                vertical={false}
              />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 12, fill: "#9CA3AF" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#9CA3AF" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "none",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  fontSize: 13,
                }}
              />
              <Bar dataKey="slots" fill="#0F62FE" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}
        className="grid-cols-1 lg:grid-cols-2"
      >
        <div
          style={{
            background: "white",
            borderRadius: 16,
            padding: "24px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <h3
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "#111827",
                margin: 0,
              }}
            >
              Recent Bookings
            </h3>
            <button
              onClick={() => navigate("dashboard")}
              style={{
                fontSize: 13,
                color: "#0F62FE",
                fontWeight: 600,
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              View all <ArrowUpRight size={14} />
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {paginatedBookings.map((b, i) => (
              <div
                key={b.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 0",
                  borderBottom:
                    i < paginatedBookings.length - 1
                      ? "1px solid #F9FAFB"
                      : "none",
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #0F62FE, #22C55E)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "white",
                    flexShrink: 0,
                  }}
                >
                  {b.avatar}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#111827",
                      margin: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {b.member}
                  </p>
                  <p style={{ fontSize: 11, color: "#9CA3AF", margin: 0 }}>
                    {b.sport} Â· {b.date}
                  </p>
                </div>
                <span
                  style={{
                    padding: "3px 10px",
                    borderRadius: 100,
                    background: statusColors[b.status].bg,
                    color: statusColors[b.status].text,
                    fontSize: 11,
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  {statusColors[b.status].label}
                </span>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#111827",
                    flexShrink: 0,
                  }}
                >
                  ${b.amount}
                </span>
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 16,
                paddingTop: 12,
                borderTop: "1px solid #F3F4F6",
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  color: "#6B7280",
                }}
              >
                Page {currentPage} of {totalPages}
              </span>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  style={{
                    padding: "6px 10px",
                    borderRadius: 8,
                    border: "1px solid #E5E7EB",
                    background: currentPage === 1 ? "#F9FAFB" : "white",
                    color: currentPage === 1 ? "#D1D5DB" : "#374151",
                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  <ChevronLeft size={14} /> Previous
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  style={{
                    padding: "6px 10px",
                    borderRadius: 8,
                    border: "1px solid #E5E7EB",
                    background:
                      currentPage === totalPages ? "#F9FAFB" : "white",
                    color: currentPage === totalPages ? "#D1D5DB" : "#374151",
                    cursor:
                      currentPage === totalPages ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  Next <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>

        {}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {}
          <div
            style={{
              background: "white",
              borderRadius: 16,
              padding: "24px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#111827",
                  margin: 0,
                }}
              >
                New Members
              </h3>
              <button
                style={{
                  fontSize: 13,
                  color: "#0F62FE",
                  fontWeight: 600,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                See all <ArrowUpRight size={14} />
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {recentMembers.map((m) => (
                <div
                  key={m.name}
                  style={{ display: "flex", alignItems: "center", gap: 12 }}
                >
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: "50%",
                      background: m.gradient,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontWeight: 700,
                      color: "white",
                      flexShrink: 0,
                    }}
                  >
                    {m.avatar}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#111827",
                        margin: 0,
                      }}
                    >
                      {m.name}
                    </p>
                    <p style={{ fontSize: 11, color: "#9CA3AF", margin: 0 }}>
                      {m.sport} Â· {m.joined}
                    </p>
                  </div>
                  <span
                    style={{
                      padding: "3px 10px",
                      borderRadius: 100,
                      background:
                        m.plan === "Elite"
                          ? "#FFFBEB"
                          : m.plan === "Premium"
                            ? "#EFF4FF"
                            : "#F9FAFB",
                      color: planColors[m.plan],
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    {m.plan}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {}
          <div
            style={{
              background: "white",
              borderRadius: 16,
              padding: "24px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#111827",
                  margin: 0,
                }}
              >
                Upcoming Activities
              </h3>
              <button
                onClick={() => navigate("activities")}
                style={{
                  fontSize: 13,
                  color: "#0F62FE",
                  fontWeight: 600,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                Manage <ArrowUpRight size={14} />
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {upcomingActivities.map((a) => (
                <div
                  key={a.name}
                  style={{ display: "flex", alignItems: "center", gap: 12 }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: a.color,
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#111827",
                        margin: 0,
                      }}
                    >
                      {a.name}
                    </p>
                    <p style={{ fontSize: 11, color: "#9CA3AF", margin: 0 }}>
                      {a.coach} Â· {a.time}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p
                      style={{
                        fontSize: 18,
                        fontWeight: 800,
                        color: a.slots <= 3 ? "#EF4444" : "#111827",
                        margin: 0,
                      }}
                    >
                      {a.slots}
                    </p>
                    <p style={{ fontSize: 10, color: "#9CA3AF", margin: 0 }}>
                      available slots
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
