import { useState, useMemo, useEffect } from "react";
import axios from "axios";
import {
  Search,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Clock,
  Users,
  BookOpen,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { DashboardLayout } from "./DashboardLayout";
import { Page } from "./Navbar";
import { useClubId } from "../utils/club";

type BookingStatus = "confirmed" | "pending" | "completed" | "cancelled";

interface Booking {
  id: string;
  member: string;
  avatar: string;
  gradient: string;
  activity: string;
  sport: string;
  coach: string;
  date: string;
  time: string;
  duration: string;
  price: number;
  status: BookingStatus;
  notes: string;
}

const BOOKINGS: Booking[] = [];

const getApiBaseUrl = () => {
  const configuredUrl = (import.meta as any).env?.VITE_API_URL;
  if (typeof configuredUrl === "string" && configuredUrl.trim())
    return configuredUrl.replace(/\/$/, "");
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

const SC: Record<
  BookingStatus,
  { bg: string; text: string; dot: string; label: string; Icon: any }
> = {
  confirmed: {
    bg: "#EFF4FF",
    text: "#0F62FE",
    dot: "#0F62FE",
    label: "Confirmed",
    Icon: CheckCircle,
  },
  pending: {
    bg: "#FFFBEB",
    text: "#D97706",
    dot: "#F59E0B",
    label: "Pending",
    Icon: AlertCircle,
  },
  completed: {
    bg: "#F0FDF4",
    text: "#16A34A",
    dot: "#22C55E",
    label: "Completed",
    Icon: Check,
  },
  cancelled: {
    bg: "#FFF1F2",
    text: "#DC2626",
    dot: "#EF4444",
    label: "Cancelled",
    Icon: XCircle,
  },
};

const PER_PAGE = 8;

export function BookingsPage({ navigate }: { navigate: (page: Page) => void }) {
  const [bookings, setBookings] = useState(BOOKINGS);
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState<"All" | BookingStatus>("All");
  const [sportF, setSportF] = useState("All");
  const [page, setPage] = useState(1);
  const [flash, setFlash] = useState("");
  const clubId = useClubId();
  const toast = (m: string) => {
    setFlash(m);
    setTimeout(() => setFlash(""), 2500);
  };

  const filtered = useMemo(
    () =>
      bookings.filter((b) => {
        if (
          search &&
          !b.member.toLowerCase().includes(search.toLowerCase()) &&
          !b.activity.toLowerCase().includes(search.toLowerCase()) &&
          !b.id.includes(search)
        )
          return false;
        if (statusF !== "All" && b.status !== statusF) return false;
        if (sportF !== "All" && b.sport !== sportF) return false;
        return true;
      }),
    [bookings, search, statusF, sportF],
  );

  const pages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const confirm = (id: string) => {
    setBookings((bs) =>
      bs.map((b) => (b.id === id ? { ...b, status: "confirmed" } : b)),
    );
    toast("Booking confirmed.");
  };
  const cancel = (id: string) => {
    setBookings((bs) =>
        bs.map((b) =>
          b.id === id ? { ...b, status: "cancelled", duration: "-" } : b,
        ),
      );
      toast("Booking cancelled.");
    };

  const stats = {
    today: bookings.filter((b) => b.date === "Jun 28, 2026").length,
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    revenue: bookings
      .filter((b) => b.status !== "cancelled")
      .reduce((a, b) => a + b.price, 0),
  };

  const sports = ["All", ...Array.from(new Set(bookings.map((b) => b.sport)))];

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const res = await axios
          .get(`${API_BASE_URL}/club/${clubId}/dashboard/bookings`, {
            headers: getAuthHeaders(),
          })
          .catch(() => null);
        const payload = res?.data ?? null;

        console.log("BOOKINGS_RAW", payload);

        if (res && payload && Array.isArray(payload.data)) {
          const mapped = payload.data.map((bk: any) => {
            const fullName = bk.user?.fullName || bk.user?.email || "Member";
            const avatar = fullName
              .split(" ")
              .map((p: string) => p[0])
              .slice(0, 2)
              .join("");
            const activity = bk.slot?.activity || {};
            const start = bk.slot?.start_time
              ? new Date(bk.slot.start_time)
              : null;
            return {
              id: `#B-${bk.id}`,
              member: fullName,
              avatar,
              gradient: "linear-gradient(135deg,#0F62FE,#22C55E)",
              activity: activity.name || activity.category || "Activity",
              sport: activity.category || "Sport",
              coach: activity.coach || "",
              date: bk.createdAt
                ? new Date(bk.createdAt).toLocaleDateString()
                : "â€”",
              time: start
                ? start.toLocaleTimeString()
                : (bk.slot?.start_time ?? "â€”"),
              duration: bk.slot?.duration ? `${bk.slot.duration} min` : '-',
              price: activity.price ?? 0,
              status: "confirmed",
              notes: bk.notes || "",
            } as Booking;
          });
          setBookings(mapped);
        }
      } catch (err) {
        console.error("Failed to load bookings", err);
      }
    };

    void loadBookings();
  }, []);

  return (
    <DashboardLayout navigate={navigate} currentPage="bookings">
      {flash && (
        <div
          style={{
            position: "fixed",
            top: 80,
            right: 24,
            background: "#0D1B2A",
            color: "white",
            borderRadius: 12,
            padding: "11px 18px",
            zIndex: 300,
            fontSize: 13,
            display: "flex",
            alignItems: "center",
            gap: 8,
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          }}
        >
          <Check size={14} color="#22C55E" />
          {flash}
        </div>
      )}

      <div style={{ marginBottom: 24 }}>
        <h1
          style={{ fontSize: 24, fontWeight: 800, color: "#111827", margin: 0 }}
        >
          Bookings
        </h1>
        <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>
          Track and manage all session bookings
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px,1fr))",
          gap: 14,
          marginBottom: 22,
        }}
      >
        {[
          {
            icon: BookOpen,
            label: "Today's Bookings",
            value: stats.today,
            color: "#0F62FE",
            bg: "#EFF4FF",
          },
          {
            icon: AlertCircle,
            label: "Pending",
            value: stats.pending,
            color: "#F59E0B",
            bg: "#FFFBEB",
          },
          {
            icon: CheckCircle,
            label: "Confirmed",
            value: stats.confirmed,
            color: "#22C55E",
            bg: "#F0FDF4",
          },
          {
            icon: Clock,
            label: "Total Revenue",
            value: `$${stats.revenue}`,
            color: "#8B5CF6",
            bg: "#F5F3FF",
          },
        ].map((c) => (
          <div
            key={c.label}
            style={{
              background: "white",
              borderRadius: 14,
              padding: "15px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              display: "flex",
              gap: 11,
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: c.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <c.icon size={17} color={c.color} />
            </div>
            <div>
              <p
                style={{
                  fontSize: 19,
                  fontWeight: 800,
                  color: "#111827",
                  margin: 0,
                }}
              >
                {c.value}
              </p>
              <p style={{ fontSize: 11, color: "#6B7280", margin: 0 }}>
                {c.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          background: "white",
          borderRadius: 12,
          padding: "13px 16px",
          marginBottom: 14,
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <div style={{ position: "relative", flex: "1 1 200px" }}>
          <Search
            size={14}
            color="#9CA3AF"
            style={{
              position: "absolute",
              left: 11,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search member, activity, IDâ€¦"
            style={{
              paddingLeft: 33,
              paddingRight: 12,
              height: 36,
              border: "1.5px solid #E5E7EB",
              borderRadius: 9,
              fontSize: 13,
              color: "#111827",
              outline: "none",
              width: "100%",
              boxSizing: "border-box",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#0F62FE")}
            onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
          />
        </div>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
          {(
            ["All", "pending", "confirmed", "completed", "cancelled"] as const
          ).map((s) => (
            <button
              key={s}
              onClick={() => {
                setStatusF(s);
                setPage(1);
              }}
              style={{
                padding: "5px 11px",
                borderRadius: 100,
                border: statusF === s ? "none" : "1.5px solid #E5E7EB",
                background:
                  statusF === s
                    ? s === "All"
                      ? "#0F62FE"
                      : (SC[s as BookingStatus]?.bg ?? "#0F62FE")
                    : "white",
                color:
                  statusF === s
                    ? s === "All"
                      ? "white"
                      : (SC[s as BookingStatus]?.text ?? "white")
                    : "#374151",
                fontSize: 11,
                fontWeight: 500,
                cursor: "pointer",
                textTransform: "capitalize",
              }}
            >
              {s}
            </button>
          ))}
        </div>
        <select
          value={sportF}
          onChange={(e) => {
            setSportF(e.target.value);
            setPage(1);
          }}
          style={{
            height: 36,
            border: "1.5px solid #E5E7EB",
            borderRadius: 9,
            fontSize: 13,
            color: "#374151",
            padding: "0 10px",
            outline: "none",
            background: "white",
          }}
        >
          {sports.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      <div
        style={{
          background: "white",
          borderRadius: 14,
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          overflow: "hidden",
          marginBottom: 14,
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table
            style={{ width: "100%", borderCollapse: "collapse", minWidth: 820 }}
          >
            <thead>
              <tr
                style={{
                  background: "#F9FAFB",
                  borderBottom: "1px solid #E5E7EB",
                }}
              >
                {[
                  "ID",
                  "Member",
                  "Activity",
                  "Date & Time",
                  "Duration",
                  "Price",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "11px 13px",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#6B7280",
                      textAlign: "left",
                      whiteSpace: "nowrap",
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    style={{
                      padding: 40,
                      textAlign: "center",
                      color: "#9CA3AF",
                      fontSize: 14,
                    }}
                  >
                    No bookings found
                  </td>
                </tr>
              ) : (
                paginated.map((b, i) => (
                  <tr
                    key={b.id}
                    style={{
                      borderBottom:
                        i < paginated.length - 1 ? "1px solid #F3F4F6" : "none",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#FAFBFF")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "white")
                    }
                  >
                    <td
                      style={{
                        padding: "12px 13px",
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#6B7280",
                      }}
                    >
                      {b.id}
                    </td>
                    <td style={{ padding: "12px 13px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            background: b.gradient,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 11,
                            fontWeight: 700,
                            color: "white",
                            flexShrink: 0,
                          }}
                        >
                          {b.avatar}
                        </div>
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "#111827",
                          }}
                        >
                          {b.member}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: "12px 13px" }}>
                      <p
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#111827",
                          margin: 0,
                        }}
                      >
                        {b.activity}
                      </p>
                      <p style={{ fontSize: 11, color: "#9CA3AF", margin: 0 }}>
                        {b.coach}
                      </p>
                    </td>
                    <td style={{ padding: "12px 13px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                        }}
                      >
                        <Calendar size={12} color="#9CA3AF" />
                        <div>
                          <p
                            style={{
                              fontSize: 13,
                              color: "#374151",
                              margin: 0,
                              fontWeight: 500,
                            }}
                          >
                            {b.date}
                          </p>
                          <p
                            style={{
                              fontSize: 11,
                              color: "#9CA3AF",
                              margin: 0,
                            }}
                          >
                            {b.time}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "12px 13px",
                        fontSize: 12,
                        color: "#6B7280",
                      }}
                    >
                      {b.duration}
                    </td>
                    <td
                      style={{
                        padding: "12px 13px",
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#111827",
                      }}
                    >
                      ${b.price}
                    </td>
                    <td style={{ padding: "12px 13px" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          padding: "3px 9px",
                          borderRadius: 100,
                          background: SC[b.status].bg,
                          color: SC[b.status].text,
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      >
                        <span
                          style={{
                            width: 5,
                            height: 5,
                            borderRadius: "50%",
                            background: SC[b.status].dot,
                          }}
                        />
                        {SC[b.status].label}
                      </span>
                    </td>
                    <td style={{ padding: "12px 13px" }}>
                      <div style={{ display: "flex", gap: 5 }}>
                        {b.status === "pending" && (
                          <>
                            <button
                              onClick={() => confirm(b.id)}
                              title="Confirm"
                              style={{
                                width: 28,
                                height: 28,
                                borderRadius: 7,
                                border: "none",
                                background: "#F0FDF4",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#22C55E",
                              }}
                            >
                              <Check size={13} />
                            </button>
                            <button
                              onClick={() => cancel(b.id)}
                              title="Cancel"
                              style={{
                                width: 28,
                                height: 28,
                                borderRadius: 7,
                                border: "none",
                                background: "#FFF1F2",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#EF4444",
                              }}
                            >
                              <X size={13} />
                            </button>
                          </>
                        )}
                        {b.status === "confirmed" && (
                          <button
                            onClick={() => cancel(b.id)}
                            title="Cancel"
                            style={{
                              width: 28,
                              height: 28,
                              borderRadius: 7,
                              border: "1px solid #E5E7EB",
                              background: "white",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#EF4444",
                            }}
                          >
                            <X size={13} />
                          </button>
                        )}
                        {(b.status === "completed" || b.status === "cancelled") && (
                          <span style={{ fontSize: 11, color: "#9CA3AF" }}>
                            -
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div
          style={{
            padding: "12px 16px",
            borderTop: "1px solid #F3F4F6",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 13, color: "#6B7280" }}>
            {filtered.length} bookings
          </span>
          <div style={{ display: "flex", gap: 5 }}>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{
                width: 30,
                height: 30,
                borderRadius: 7,
                border: "1.5px solid #E5E7EB",
                background: "white",
                cursor: page === 1 ? "not-allowed" : "pointer",
                opacity: page === 1 ? 0.4 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ChevronLeft size={13} />
            </button>
            {[...Array(pages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 7,
                  border: "1.5px solid",
                  borderColor: page === i + 1 ? "#0F62FE" : "#E5E7EB",
                  background: page === i + 1 ? "#0F62FE" : "white",
                  color: page === i + 1 ? "white" : "#374151",
                  fontSize: 12,
                  fontWeight: page === i + 1 ? 700 : 400,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              disabled={page === pages}
              style={{
                width: 30,
                height: 30,
                borderRadius: 7,
                border: "1.5px solid #E5E7EB",
                background: "white",
                cursor: page === pages ? "not-allowed" : "pointer",
                opacity: page === pages ? 0.4 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
