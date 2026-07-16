import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Plus,
  Calendar,
  Users,
  DollarSign,
  Trophy,
  Edit,
  Trash2,
  Eye,
  Copy,
  MoreHorizontal,
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
} from "lucide-react";
import { DashboardLayout } from "./DashboardLayout";
import { Page } from "./Navbar";
import { useClubId } from "../utils/club";

interface EventItem {
  id: number;
  title: string;
  banner?: string;
  sport: string;
  club?: string;
  startDate: string;
  endDate: string;
  deadline: string;
  participants: number;
  maxCapacity: number;
  price: number;
  status: "upcoming" | "completed" | "cancelled";
  revenue: number;
}

interface AttendeeItem {
  name: string;
  avatar: string;
  event: string;
  status: "confirmed" | "pending" | "waitlist";
  gradient: string;
}

interface TimelineItem {
  date: string;
  title: string;
  event: string;
  type: "deadline" | "start";
}

interface EventsPageProps {
  navigate: (page: Page) => void;
}

const statusConfig: Record<
  string,
  { bg: string; text: string; label: string }
> = {
  upcoming: { bg: "#EFF4FF", text: "#0F62FE", label: "Upcoming" },
  completed: { bg: "#F0FDF4", text: "#22C55E", label: "Completed" },
  cancelled: { bg: "#FFF1F2", text: "#EF4444", label: "Cancelled" },
};

const attendeeStatusConfig: Record<string, { bg: string; text: string }> = {
  confirmed: { bg: "#F0FDF4", text: "#16A34A" },
  pending: { bg: "#FFFBEB", text: "#D97706" },
  waitlist: { bg: "#F5F3FF", text: "#7C3AED" },
};

export function EventsPage({ navigate }: EventsPageProps) {
  const [showCreate, setShowCreate] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterSport, setFilterSport] = useState("All");
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [eventTitle, setEventTitle] = useState("");
  const [eventPrice, setEventPrice] = useState("");
  const [eventCapacity, setEventCapacity] = useState("");
  const [eventStart, setEventStart] = useState("");
  const [eventEnd, setEventEnd] = useState("");
  const [eventSport, setEventSport] = useState("Football");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const clubId = useClubId();
  const API_BASE_URL =
    (import.meta as any)?.env?.VITE_API_URL || "http://localhost:4000"

  const [events, setEvents] = useState<EventItem[]>([]);
  const [attendees, setAttendees] = useState<AttendeeItem[]>([]);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<
    Record<number, { color: string; label: string }[]>
  >({});

  const resetEventForm = () => {
    setEditingEvent(null);
    setEventTitle("");
    setEventPrice("");
    setEventCapacity("");
    setEventStart("");
    setEventEnd("");
    setEventSport("Football");
    setErrorMessage("");
  };

  const openCreateModal = () => {
    resetEventForm();
    setShowCreate(true);
  };

  const openEditModal = (event: EventItem) => {
    setEditingEvent(event);
    setEventTitle(event.title);
    setEventPrice(String(event.price));
    setEventCapacity(String(event.maxCapacity));
    setEventStart(
      event.startDate
        ? new Date(event.startDate).toISOString().slice(0, 10)
        : "",
    );
    setEventEnd(
      event.endDate ? new Date(event.endDate).toISOString().slice(0, 10) : "",
    );
    setEventSport(event.sport);
    setErrorMessage("");
    setShowCreate(true);
  };

  const closeModal = () => {
    setShowCreate(false);
    resetEventForm();
  };

  const loadEvents = useCallback(async () => {
    try {
      const res = await axios
        .get(`${API_BASE_URL}/club/${clubId}/event`)
        .catch(() => null);
      const result = res?.data ?? null;

      if (!res || result?.success === false) {
        throw new Error(result?.message || "Failed to fetch events");
      }

      const list = Array.isArray(result)
        ? result
        : Array.isArray(result?.data)
          ? result.data
          : [];

      const mappedEvents: EventItem[] = list.map((event: any) => {
        const startDate = event.start_date || event.startDate || "";
        const endDate = event.end_date || event.endDate || "";
        const start = new Date(startDate);
        const end = new Date(endDate);
        const now = new Date();
        let status: EventItem["status"] = "upcoming";

        if (end && !Number.isNaN(end.getTime()) && now > end) {
          status = "completed";
        }

        return {
          id: event.id,
          title: event.title || "Untitled Event",
          sport: event.category || "Multi-Sport",
          startDate:
            start && !Number.isNaN(start.getTime())
              ? start.toLocaleDateString()
              : String(startDate || "—"),
          endDate:
            end && !Number.isNaN(end.getTime())
              ? end.toLocaleDateString()
              : String(endDate || "—"),
          deadline:
            start && !Number.isNaN(start.getTime())
              ? start.toLocaleDateString()
              : "—",
          participants: event.participants || 0,
          maxCapacity: event.max_capacity || 0,
          price: event.price || 0,
          status,
          revenue: event.revenue || 0,
        };
      });

      setEvents(mappedEvents);

      const timelineItems: TimelineItem[] = mappedEvents
        .slice(0, 4)
        .flatMap((event) => [
          {
            date: event.startDate,
            title: "Event Starts",
            event: event.title,
            type: "start" as const,
          },
          {
            date: event.deadline,
            title: "Registration Deadline",
            event: event.title,
            type: "deadline" as const,
          },
        ]);
      setTimeline(timelineItems);

      const calendarMap: Record<number, { color: string; label: string }[]> =
        {};
      mappedEvents.forEach((event) => {
        const date = new Date(event.startDate);
        const day = date.getDate();
        if (!Number.isNaN(day)) {
          calendarMap[day] = [{ color: "#0F62FE", label: event.title }];
        }
      });
      setCalendarEvents(calendarMap);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  }, [API_BASE_URL, clubId]);

  useEffect(() => {
    void loadEvents();
  }, [loadEvents]);

  const handleSubmitEvent = async () => {
    if (
      !eventTitle.trim() ||
      !eventPrice ||
      !eventCapacity ||
      !eventStart ||
      !eventEnd
    ) {
      setErrorMessage("Please fill all required fields.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const payload = {
        title: eventTitle.trim(),
        price: Number(eventPrice),
        max_capacity: Number(eventCapacity),
        start_date: new Date(eventStart).toISOString(),
        end_date: new Date(eventEnd).toISOString(),
        category: eventSport,
      };

      const url = editingEvent
        ? `${API_BASE_URL}/club/${clubId}/event/${editingEvent.id}`
        : `${API_BASE_URL}/club/${clubId}/event`;

      const res = editingEvent
        ? await axios.put(url, payload, {
            headers: { "Content-Type": "application/json" },
          })
        : await axios.post(url, payload, {
            headers: { "Content-Type": "application/json" },
          });

      const result = res.data;
      if (res.status < 200 || res.status >= 300 || result?.success === false) {
        throw new Error(result?.message || "Failed to save event");
      }

      await loadEvents();
      closeModal();
    } catch (error) {
      console.error("Save event failed:", error);
      setErrorMessage("Something went wrong while saving the event.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: number) => {
    if (!window.confirm("Delete this event?")) return;

    setLoading(true);
    try {
      const res = await axios.delete(
        `${API_BASE_URL}/club/${clubId}/event/${eventId}`,
      );
      const result = res.data;
      if (res.status < 200 || res.status >= 300 || result?.success === false) {
        throw new Error(result?.message || "Failed to delete event");
      }

      await loadEvents();
    } catch (error) {
      console.error("Delete event failed:", error);
      setErrorMessage("Something went wrong while deleting the event.");
    } finally {
      setLoading(false);
    }
  };

  const statsCards = useMemo(() => {
    const upcoming = events.filter((e) => e.status === "upcoming").length;
    const completed = events.filter((e) => e.status === "completed").length;
    const totalRegistrations = events.reduce(
      (sum, e) => sum + (e.participants || 0),
      0,
    );
    const totalRevenue = events.reduce((sum, e) => sum + (e.revenue || 0), 0);

    return [
      {
        title: "Upcoming Events",
        value: String(upcoming),
        icon: Calendar,
        color: "#0F62FE",
        bg: "#EFF4FF",
        change: "",
      },
      {
        title: "Completed Events",
        value: String(completed),
        icon: CheckCircle,
        color: "#22C55E",
        bg: "#F0FDF4",
        change: "",
      },
      {
        title: "Total Registrations",
        value: totalRegistrations.toLocaleString(),
        icon: Users,
        color: "#F59E0B",
        bg: "#FFFBEB",
        change: "",
      },
      {
        title: "Events Revenue",
        value: `$${totalRevenue.toLocaleString()}`,
        icon: DollarSign,
        color: "#8B5CF6",
        bg: "#F5F3FF",
        change: "",
      },
    ];
  }, [events]);

  const filtered = useMemo(() => {
    return events.filter((e) => {
      const matchStatus =
        filterStatus === "All" || e.status === filterStatus.toLowerCase();
      const matchSport = filterSport === "All" || e.sport === filterSport;
      return matchStatus && matchSport;
    });
  }, [events, filterStatus, filterSport]);

  const ActionMenu = ({
    event,
    onEdit,
    onDelete,
  }: {
    event: EventItem;
    onEdit: (event: EventItem) => void;
    onDelete: (id: number) => void;
  }) => {
    const [open, setOpen] = useState(false);

    return (
      <div style={{ position: "relative" }}>
        <button
          onClick={() => setOpen(!open)}
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            border: "1px solid #E5E7EB",
            background: "white",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MoreHorizontal size={15} color="#6B7280" />
        </button>

        {open && (
          <div
            style={{
              position: "absolute",
              right: 0,
              top: 38,
              background: "white",
              borderRadius: 12,
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              border: "1px solid #E5E7EB",
              padding: 6,
              zIndex: 20,
              width: 140,
            }}
          >
            {[
              { icon: Eye, label: "View Details", color: "#374151" },
              { icon: Edit, label: "Edit", color: "#0F62FE" },
              { icon: Copy, label: "Duplicate", color: "#8B5CF6" },
              { icon: Trash2, label: "Delete", color: "#EF4444" },
            ].map((action) => (
              <button
                key={action.label}
                onClick={() => {
                  setOpen(false);
                  if (action.label === "Edit") {
                    onEdit(event);
                  } else if (action.label === "Delete") {
                    onDelete(event.id);
                  }
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: 8,
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  color: action.color,
                  fontSize: 13,
                  fontWeight: 500,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#F9FAFB")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "none")
                }
              >
                <action.icon size={14} color={action.color} />
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <DashboardLayout navigate={navigate} currentPage="events">
      {}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 24,
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
              margin: 0,
            }}
          >
            Events
          </h1>
          <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>
            Manage and track all your sports events
          </p>
        </div>

        <button
          onClick={openCreateModal}
          style={{
            padding: "10px 20px",
            borderRadius: 10,
            background: "linear-gradient(135deg, #0F62FE, #0043CE)",
            color: "white",
            fontSize: 13,
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            boxShadow: "0 4px 12px rgba(15,98,254,0.3)",
          }}
        >
          <Plus size={14} /> Create Event
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        {statsCards.map((card) => (
          <div
            key={card.title}
            style={{
              background: "white",
              borderRadius: 14,
              padding: "18px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              border: "1px solid #F3F4F6",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: card.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <card.icon size={18} color={card.color} />
              </div>

              {card.change ? (
                <span
                  style={{
                    fontSize: 11,
                    color: card.color,
                    fontWeight: 600,
                    background: card.bg,
                    padding: "2px 8px",
                    borderRadius: 100,
                  }}
                >
                  {card.change}
                </span>
              ) : null}
            </div>

            <p
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: "#111827",
                margin: "0 0 3px",
                letterSpacing: "-0.5px",
              }}
            >
              {card.value}
            </p>
            <p style={{ fontSize: 12, color: "#6B7280", margin: 0 }}>
              {card.title}
            </p>
          </div>
        ))}
      </div>

      {}
      <div
        style={{
          background: "white",
          borderRadius: 14,
          padding: "14px 20px",
          marginBottom: 20,
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
          Filter:
        </span>

        {["All", "Upcoming", "Completed"].map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            style={{
              padding: "6px 14px",
              borderRadius: 100,
              border: filterStatus === s ? "none" : "1.5px solid #E5E7EB",
              background: filterStatus === s ? "#0F62FE" : "white",
              color: filterStatus === s ? "white" : "#374151",
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {s}
          </button>
        ))}

        <div
          style={{
            width: 1,
            height: 24,
            background: "#E5E7EB",
            margin: "0 4px",
          }}
        />

        <select
          value={filterSport}
          onChange={(e) => setFilterSport(e.target.value)}
          style={{
            height: 34,
            border: "1.5px solid #E5E7EB",
            borderRadius: 10,
            fontSize: 12,
            color: "#374151",
            padding: "0 10px",
            outline: "none",
            background: "white",
          }}
        >
          <option value="All">All Sports</option>
          {[
            "Football",
            "Swimming",
            "Tennis",
            "Basketball",
            "Yoga",
            "Multi-Sport",
          ].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}
        className="grid-cols-1 xl:grid-cols-3"
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 20,
            alignContent: "start",
          }}
        >
          {filtered.length > 0 ? (
            filtered.map((event) => (
              <div
                key={event.id}
                style={{
                  background: "white",
                  borderRadius: 18,
                  overflow: "hidden",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow =
                    "0 12px 36px rgba(0,0,0,0.1)";
                  (e.currentTarget as HTMLDivElement).style.transform =
                    "translateY(-3px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow =
                    "0 2px 12px rgba(0,0,0,0.06)";
                  (e.currentTarget as HTMLDivElement).style.transform = "none";
                }}
              >
                <div style={{ position: "relative", height: 160 }}>
                  {event.banner ? (
                    <img
                      src={event.banner}
                      alt={event.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        background: "linear-gradient(135deg, #0F62FE, #0043CE)",
                      }}
                    />
                  )}

                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)",
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      top: 12,
                      left: 12,
                      padding: "3px 10px",
                      borderRadius: 100,
                      background: "#0F62FE",
                      color: "white",
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    {event.sport}
                  </span>
                  <span
                    style={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      padding: "3px 10px",
                      borderRadius: 100,
                      background: statusConfig[event.status]?.bg || "#EFF4FF",
                      color: statusConfig[event.status]?.text || "#0F62FE",
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    {statusConfig[event.status]?.label || event.status}
                  </span>
                </div>

                <div style={{ padding: "16px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 10,
                    }}
                  >
                    <h3
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: "#111827",
                        margin: 0,
                        flex: 1,
                        paddingRight: 8,
                      }}
                    >
                      {event.title}
                    </h3>
                    <ActionMenu
                      event={event}
                      onEdit={openEditModal}
                      onDelete={handleDeleteEvent}
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 5,
                      marginBottom: 12,
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <Calendar size={12} color="#6B7280" />
                      <span style={{ fontSize: 12, color: "#6B7280" }}>
                        {event.startDate}
                        {event.startDate !== event.endDate
                          ? ` – ${event.endDate}`
                          : ""}
                      </span>
                    </div>

                    <div
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <Clock size={12} color="#EF4444" />
                      <span style={{ fontSize: 12, color: "#6B7280" }}>
                        Deadline: {event.deadline}
                      </span>
                    </div>

                    <div
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <Users size={12} color="#6B7280" />
                      <span style={{ fontSize: 12, color: "#6B7280" }}>
                        {event.participants}/{event.maxCapacity} registered
                      </span>
                    </div>
                  </div>

                  <div
                    style={{
                      height: 4,
                      background: "#F3F4F6",
                      borderRadius: 100,
                      marginBottom: 12,
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        borderRadius: 100,
                        background:
                          event.participants === event.maxCapacity
                            ? "#EF4444"
                            : "#22C55E",
                        width: `${event.maxCapacity ? (event.participants / event.maxCapacity) * 100 : 0}%`,
                      }}
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <span style={{ fontSize: 10, color: "#9CA3AF" }}>
                        Ticket Price
                      </span>
                      <p
                        style={{
                          fontSize: 16,
                          fontWeight: 800,
                          color: "#0F62FE",
                          margin: 0,
                        }}
                      >
                        ${event.price}
                      </p>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: 10, color: "#9CA3AF" }}>
                        Revenue
                      </span>
                      <p
                        style={{
                          fontSize: 14,
                          fontWeight: 700,
                          color: "#22C55E",
                          margin: 0,
                        }}
                      >
                        ${event.revenue.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div
              style={{
                background: "white",
                borderRadius: 18,
                padding: 32,
                textAlign: "center",
                color: "#6B7280",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                gridColumn: "1 / -1",
              }}
            >
              No events found.
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
              padding: "20px",
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
              <h4
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#111827",
                  margin: 0,
                }}
              >
                July 2026
              </h4>
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    border: "1px solid #E5E7EB",
                    background: "white",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ChevronLeft size={13} />
                </button>
                <button
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    border: "1px solid #E5E7EB",
                    background: "white",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: 2,
                marginBottom: 4,
              }}
            >
              {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                <div
                  key={i}
                  style={{
                    textAlign: "center",
                    fontSize: 10,
                    fontWeight: 600,
                    color: "#9CA3AF",
                    padding: "4px 0",
                  }}
                >
                  {d}
                </div>
              ))}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: 2,
              }}
            >
              {[...Array(3)].map((_, i) => (
                <div key={`empty-${i}`} />
              ))}

              {[...Array(31)].map((_, i) => {
                const day = i + 1;
                const hasEvent = calendarEvents[day];
                const isToday = day === 28;

                return (
                  <div
                    key={day}
                    style={{
                      textAlign: "center",
                      padding: "3px 0",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: "50%",
                        background: isToday
                          ? "#0F62FE"
                          : hasEvent
                            ? "#EFF4FF"
                            : "transparent",
                        color: isToday
                          ? "white"
                          : hasEvent
                            ? "#0F62FE"
                            : "#374151",
                        fontSize: 11,
                        fontWeight: hasEvent || isToday ? 700 : 400,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto",
                        cursor: hasEvent ? "pointer" : "default",
                      }}
                    >
                      {day}
                    </div>
                    {hasEvent && (
                      <div
                        style={{
                          width: 4,
                          height: 4,
                          borderRadius: "50%",
                          background: hasEvent[0].color,
                          margin: "1px auto 0",
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {}
          <div
            style={{
              background: "white",
              borderRadius: 16,
              padding: "20px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}
          >
            <h4
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "#111827",
                margin: "0 0 16px",
              }}
            >
              Event Timeline
            </h4>

            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {timeline.length > 0 ? (
                timeline.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: 14,
                      position: "relative",
                      paddingBottom: i < timeline.length - 1 ? 16 : 0,
                    }}
                  >
                    {i < timeline.length - 1 && (
                      <div
                        style={{
                          position: "absolute",
                          left: 15,
                          top: 28,
                          width: 2,
                          bottom: 0,
                          background: "#E5E7EB",
                        }}
                      />
                    )}
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background:
                          item.type === "start" ? "#EFF4FF" : "#FFFBEB",
                        border: `2px solid ${item.type === "start" ? "#0F62FE" : "#F59E0B"}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        zIndex: 1,
                      }}
                    >
                      {item.type === "start" ? (
                        <Trophy size={13} color="#0F62FE" />
                      ) : (
                        <Clock size={13} color="#F59E0B" />
                      )}
                    </div>

                    <div>
                      <p
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: item.type === "start" ? "#0F62FE" : "#D97706",
                          margin: "0 0 2px",
                        }}
                      >
                        {item.date}
                      </p>
                      <p
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#111827",
                          margin: 0,
                        }}
                      >
                        {item.title}
                      </p>
                      <p style={{ fontSize: 11, color: "#6B7280", margin: 0 }}>
                        {item.event}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>
                  No timeline items yet.
                </p>
              )}
            </div>
          </div>

          {}
          <div
            style={{
              background: "white",
              borderRadius: 16,
              padding: "20px",
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
              <h4
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#111827",
                  margin: 0,
                }}
              >
                Recent Attendees
              </h4>
              <span
                style={{
                  fontSize: 12,
                  color: "#0F62FE",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                View all
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {attendees.length > 0 ? (
                attendees.map((a) => (
                  <div
                    key={`${a.name}-${a.event}`}
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: "50%",
                        background: a.gradient,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        fontWeight: 700,
                        color: "white",
                        flexShrink: 0,
                      }}
                    >
                      {a.avatar}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
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
                      <p
                        style={{
                          fontSize: 11,
                          color: "#9CA3AF",
                          margin: 0,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {a.event}
                      </p>
                    </div>

                    <span
                      style={{
                        padding: "3px 8px",
                        borderRadius: 100,
                        background:
                          attendeeStatusConfig[a.status]?.bg || "#F3F4F6",
                        color:
                          attendeeStatusConfig[a.status]?.text || "#374151",
                        fontSize: 10,
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                    </span>
                  </div>
                ))
              ) : (
                <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>
                  No attendees yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {}
      {showCreate && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
          onClick={closeModal}
        >
          <div
            style={{
              background: "white",
              borderRadius: 20,
              padding: 28,
              width: "100%",
              maxWidth: 520,
              boxShadow: "0 24px 60px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#111827",
                  margin: 0,
                }}
              >
                {editingEvent ? "Edit Event" : "Create New Event"}
              </h3>
              <button
                onClick={closeModal}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  border: "1px solid #E5E7EB",
                  background: "white",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  color: "#6B7280",
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#374151",
                    display: "block",
                    marginBottom: 5,
                  }}
                >
                  Event Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Summer Football League"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  style={{
                    width: "100%",
                    height: 40,
                    border: "1.5px solid #E5E7EB",
                    borderRadius: 10,
                    padding: "0 12px",
                    fontSize: 13,
                    color: "#111827",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#0F62FE")}
                  onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <div>
                  <label
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#374151",
                      display: "block",
                      marginBottom: 5,
                    }}
                  >
                    Ticket Price ($)
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={eventPrice}
                    onChange={(e) => setEventPrice(e.target.value)}
                    style={{
                      width: "100%",
                      height: 40,
                      border: "1.5px solid #E5E7EB",
                      borderRadius: 10,
                      padding: "0 12px",
                      fontSize: 13,
                      color: "#111827",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#374151",
                      display: "block",
                      marginBottom: 5,
                    }}
                  >
                    Max Capacity
                  </label>
                  <input
                    type="number"
                    placeholder="32"
                    value={eventCapacity}
                    onChange={(e) => setEventCapacity(e.target.value)}
                    style={{
                      width: "100%",
                      height: 40,
                      border: "1.5px solid #E5E7EB",
                      borderRadius: 10,
                      padding: "0 12px",
                      fontSize: 13,
                      color: "#111827",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <div>
                  <label
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#374151",
                      display: "block",
                      marginBottom: 5,
                    }}
                  >
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={eventStart}
                    onChange={(e) => setEventStart(e.target.value)}
                    style={{
                      width: "100%",
                      height: 40,
                      border: "1.5px solid #E5E7EB",
                      borderRadius: 10,
                      padding: "0 12px",
                      fontSize: 13,
                      color: "#111827",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#374151",
                      display: "block",
                      marginBottom: 5,
                    }}
                  >
                    End Date
                  </label>
                  <input
                    type="date"
                    value={eventEnd}
                    onChange={(e) => setEventEnd(e.target.value)}
                    style={{
                      width: "100%",
                      height: 40,
                      border: "1.5px solid #E5E7EB",
                      borderRadius: 10,
                      padding: "0 12px",
                      fontSize: 13,
                      color: "#111827",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              <div>
                <label
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#374151",
                    display: "block",
                    marginBottom: 5,
                  }}
                >
                  Sport Category
                </label>
                <select
                  value={eventSport}
                  onChange={(e) => setEventSport(e.target.value)}
                  style={{
                    width: "100%",
                    height: 40,
                    border: "1.5px solid #E5E7EB",
                    borderRadius: 10,
                    padding: "0 12px",
                    fontSize: 13,
                    color: "#111827",
                    outline: "none",
                    background: "white",
                    boxSizing: "border-box",
                  }}
                >
                  {[
                    "Football",
                    "Swimming",
                    "Tennis",
                    "Basketball",
                    "Yoga",
                    "Multi-Sport",
                  ].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>

              {errorMessage ? (
                <div style={{ color: "#DC2626", fontSize: 12, marginTop: 4 }}>
                  {errorMessage}
                </div>
              ) : null}

              <div style={{ display: "flex", gap: 10, paddingTop: 8 }}>
                <button
                  onClick={closeModal}
                  style={{
                    flex: 1,
                    padding: "11px",
                    borderRadius: 10,
                    border: "1.5px solid #E5E7EB",
                    background: "white",
                    color: "#374151",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>

                <button
                  onClick={handleSubmitEvent}
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: "11px",
                    borderRadius: 10,
                    background: loading
                      ? "#94A3B8"
                      : "linear-gradient(135deg, #0F62FE, #0043CE)",
                    color: "white",
                    fontSize: 14,
                    fontWeight: 600,
                    border: "none",
                    cursor: loading ? "not-allowed" : "pointer",
                    boxShadow: "0 4px 12px rgba(15,98,254,0.3)",
                  }}
                >
                  {editingEvent ? "Save Changes" : "Create Event"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
