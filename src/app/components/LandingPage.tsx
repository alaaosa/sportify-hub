import { useEffect, useState } from "react";
import axios from "axios";
import {
  Search,
  MapPin,
  Star,
  ChevronRight,
  Play,
  Shield,
  Clock,
  CreditCard,
  Users,
  Trophy,
  Zap,
  ArrowRight,
  Check,
  Quote,
  Calendar,
  Ticket,
  Dumbbell,
  Waves,
  Target,
  Activity,
  Heart,
  Flame,
} from "lucide-react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { Page } from "./Navbar";
import { getStoredClubId } from "../utils/club";

const IMG = {
  gym1: "https://images.unsplash.com/photo-1761971975769-97e598bf526b?w=800&q=80",
  gym2: "https://images.unsplash.com/photo-1775993703558-e7afab02b7bd?w=800&q=80",
  gym3: "https://images.unsplash.com/photo-1775993167571-cd1ff4cadada?w=800&q=80",
  gym4: "https://images.unsplash.com/photo-1765728617805-b9f22d64e5b3?w=800&q=80",
  football:
    "https://images.unsplash.com/photo-1679391029864-d46f366a456b?w=800&q=80",
  footballField:
    "https://images.unsplash.com/photo-1676746610993-fa0c050d1f6d?w=800&q=80",
  footballNight:
    "https://images.unsplash.com/photo-1676746424139-77f8bd8922a8?w=800&q=80",
  swimming:
    "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&q=80",
  swimming2:
    "https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=800&q=80",
  tennis:
    "https://images.unsplash.com/photo-1545151414-8a948e1ea54f?w=800&q=80",
  tennisCourt:
    "https://images.unsplash.com/photo-1717869835053-bc3f150e105f?w=800&q=80",
  yoga: "https://images.unsplash.com/photo-1554245064-3ab88761ac5d?w=800&q=80",
  basketball:
    "https://images.unsplash.com/photo-1590227632180-80a3bf110871?w=800&q=80",
  stadium:
    "https://images.unsplash.com/photo-1569337042150-c21c85b80a10?w=800&q=80",
};

const sportCategories = [];

const getApiBaseUrl = () => {
  const configuredUrl = (import.meta as any).env?.VITE_API_URL;
  if (typeof configuredUrl === "string" && configuredUrl.trim()) {
    return configuredUrl.replace(/\/$/, "");
  }
  return "http://localhost:4000";
};

const API_BASE_URL = getApiBaseUrl();

interface LandingSlotDetail {
  id?: number;
  start_time: string;
  end_time: string;
  is_booked?: boolean;
}

interface LandingActivity {
  id: number;
  name: string;
  coach: string;
  category: string;
  price: number;
  image: string;
  badge: string;
  description: string;
  slots?: number;
  slotDetails?: LandingSlotDetail[];
}

const getAuthHeaders = (): Record<string, string> => {
  if (typeof window === "undefined") return { Accept: "application/json" };
  const token = window.localStorage.getItem("token");
  const headers: Record<string, string> = { Accept: "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
};

const normalizePlans = (payload: any) => {
  const list = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload?.plans)
        ? payload.plans
        : [];

  return list.map((plan: any, index: number) => ({
    name: plan?.name || plan?.title || `Plan ${index + 1}`,
    price: Number(plan?.price ?? plan?.amount ?? 0),
    color: plan?.color || "#0F62FE",
    gradient: `linear-gradient(135deg, ${plan?.color || "#0F62FE"}, #0043CE)`,
    features: (() => {
      const v = plan?.features;
      if (Array.isArray(v)) return v;
      if (typeof v === "string") {
        const s = v.trim();
        if (s.startsWith("[") && s.endsWith("]")) {
          try {
            const parsed = JSON.parse(s);
            if (Array.isArray(parsed)) return parsed;
          } catch {}
          const inner = s.slice(1, -1);
          return inner
            .split(",")
            .map((x: string) =>
              x.replace(/^\s*"|"\s*$|^\s*'|'\s*$/g, "").trim(),
            )
            .filter(Boolean);
        }
        return s
          .split(",")
          .map((x: string) => x.replace(/^\s*"|"\s*$|^\s*'|'\s*$/g, "").trim())
          .filter(Boolean);
      }
      return ["Club access", "Flexible booking"];
    })(),
    cta: plan?.popular || index === 1 ? "Most Popular" : "Join Plan",
    popular: Boolean(plan?.popular || index === 1),
  }));
};

const normalizeEvents = (payload: any) => {
  const list = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload?.events)
        ? payload.events
        : [];

  return list.map((event: any, index: number) => {
    const startDate = event?.start_date || event?.date || event?.startDate;
    const parsedDate = startDate ? new Date(startDate) : null;
    const isValidDate = parsedDate && !Number.isNaN(parsedDate.getTime());
    const maxSeats = Number(event?.max_capacity ?? event?.maxSeats ?? 30);
    const currentCapacity = Number(event?.current_capacity ?? 0);
    const seats = Number(
      event?.available_seats ??
        event?.availableSeats ??
        event?.seats ??
        Math.max(0, maxSeats - currentCapacity),
    );

    return {
      id: event?.id ?? index + 1,
      banner: event?.image || event?.banner || IMG.gym1,
      title: event?.title || event?.name || "Upcoming Event",
      sport: event?.category || event?.sport || "Club Event",
      club:
        event?.club?.name ||
        event?.clubName ||
        event?.club ||
        "SportifyHub Club",
      date: isValidDate
        ? parsedDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "TBD",
      time: isValidDate
        ? parsedDate.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
          })
        : "TBD",
      seats: Math.max(0, maxSeats > 0 ? maxSeats - currentCapacity : seats),
      maxSeats: Number.isFinite(maxSeats) ? maxSeats : 30,
      currentCapacity,
      price: Number(event?.price ?? 0),
    };
  });
};

const normalizeActivities = (payload: any) => {
  const list = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload?.activities)
        ? payload.activities
        : [];

  return list.map((activity: any, index: number) => {
    const slotsData = Array.isArray(activity?.slots) ? activity.slots : [];

    return {
      id: activity?.id ?? index + 1,
      name: activity?.name || activity?.title || "Activity Session",
      coach:
        activity?.coach_name ||
        activity?.coachName ||
        activity?.coach ||
        "Certified Coach",
      category: activity?.category || activity?.sport || "Fitness",
      price: Number(activity?.price ?? activity?.amount ?? 0),
      image: activity?.image || activity?.banner || IMG.gym1,
      badge: activity?.badge || "Live Class",
      description:
        activity?.description ||
        `Join a premium ${activity?.category || "fitness"} session with expert guidance.`,
      slots: slotsData.length,
      slotDetails: slotsData,
    };
  });
};

const whyFeatures = [
  {
    icon: Zap,
    title: "Easy Booking",
    desc: "Book any sport session in under 60 seconds with our streamlined checkout process.",
    color: "#0F62FE",
  },
  {
    icon: Shield,
    title: "Verified Clubs",
    desc: "Every club is vetted and verified to meet our quality and safety standards.",
    color: "#22C55E",
  },
  {
    icon: Clock,
    title: "Real-time Availability",
    desc: "See live slot availability and never show up to a full session again.",
    color: "#F59E0B",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    desc: "End-to-end encrypted payments with instant confirmation and refund protection.",
    color: "#8B5CF6",
  },
];

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Marathon Runner",
    avatar: "SM",
    rating: 5,
    text: "SportifyHub completely changed how I train. I found an amazing athletics club nearby and book my sessions in seconds. The variety of sports and clubs is unmatched!",
    gradient: "linear-gradient(135deg, #0F62FE, #22C55E)",
  },
  {
    name: "James Rodriguez",
    role: "Football Coach",
    avatar: "JR",
    rating: 5,
    text: "As a coach, managing my team's bookings used to be a nightmare. Now everything's in one dashboard â€” bookings, payments, attendance. It's a game changer.",
    gradient: "linear-gradient(135deg, #F59E0B, #EF4444)",
  },
  {
    name: "Priya Sharma",
    role: "Yoga Instructor",
    avatar: "PS",
    rating: 5,
    text: "My studio gets consistently filled thanks to SportifyHub. The platform brings quality students and handles all admin. I can focus on what I love â€” teaching.",
    gradient: "linear-gradient(135deg, #8B5CF6, #EC4899)",
  },
];

interface LandingPageProps {
  navigate: (page: Page) => void;
}

export function LandingPage({ navigate }: LandingPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSport, setSelectedSport] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [hoveredClub, setHoveredClub] = useState<number | null>(null);
  const [plansData, setPlansData] = useState<any[]>([]);
  const [eventsData, setEventsData] = useState<any[]>([]);
  const [activitiesData, setActivitiesData] = useState<LandingActivity[]>([]);
  const [selectedActivity, setSelectedActivity] =
    useState<LandingActivity | null>(null);
  const [activitySlots, setActivitySlots] = useState<any[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [bookingMessage, setBookingMessage] = useState("");
  const [bookingInProgressId, setBookingInProgressId] = useState<number | null>(
    null,
  );
  const [joiningEventId, setJoiningEventId] = useState<number | null>(null);
  const [unjoiningEventId, setUnjoiningEventId] = useState<number | null>(null);
  const [joinedEventIds, setJoinedEventIds] = useState<number[]>([]);
  const [joinEventMessage, setJoinEventMessage] = useState("");
  const activeClubId = getStoredClubId();

  const syncJoinedEventState = async (events: any[]) => {
    const token = window.localStorage.getItem("token");
    if (!token || events.length === 0) {
      return;
    }

    try {
      const results = await Promise.allSettled(
        events.map((event) =>
          axios
            .get(
              `${API_BASE_URL}/club/${activeClubId}/event/${event.id}/registered`,
              {
                headers: { ...getAuthHeaders(), Accept: "application/json" },
              },
            )
            .catch(() => null),
        ),
      );

      const registeredIds = results.flatMap((result, index) => {
        if (result.status !== "fulfilled" || !result.value) return [];
        const payload = result.value.data ?? null;
        return payload?.data?.isRegistered ? [events[index].id] : [];
      });

      const mergedIds = registeredIds.flat();
      setJoinedEventIds((prev) => {
        const next = new Set([...prev, ...mergedIds]);
        return Array.from(next);
      });
    } catch (error) {
      console.error("Failed to load joined event state", error);
    }
  };

  const handleJoinEvent = async (event: any) => {
    const token = window.localStorage.getItem("token");
    if (!token) {
      setJoinEventMessage("Please sign in before joining an event.");
      return;
    }

    try {
      setJoiningEventId(event.id);
      setJoinEventMessage("");
      const response = await axios
        .post(
          `${API_BASE_URL}/club/${activeClubId}/event/${event.id}/register`,
          {},
          {
            headers: {
              ...getAuthHeaders(),
              "Content-Type": "application/json",
            },
          },
        )
        .catch((err) => err.response ?? null);
      const result = response?.data ?? null;

      const isAlreadyRegistered =
        response?.status === 409 ||
        /already registered|already joined/i.test(result?.message || "");

      if (
        response &&
        response.status >= 200 &&
        response.status < 300 &&
        result?.success
      ) {
        setJoinedEventIds((prev) =>
          prev.includes(event.id) ? prev : [...prev, event.id],
        );
        setEventsData((prev) =>
          prev.map((item) => {
            if (item.id !== event.id) return item;

            const updatedEvent = result?.data?.event;
            const maxSeats = Number(
              updatedEvent?.max_capacity ?? item.maxSeats ?? 0,
            );
            const currentCapacity = Number(updatedEvent?.current_capacity ?? 0);
            const nextSeats =
              maxSeats > 0
                ? Math.max(0, maxSeats - currentCapacity)
                : Math.max(0, item.seats - 1);

            return {
              ...item,
              seats: nextSeats,
              maxSeats: Number.isFinite(maxSeats) ? maxSeats : item.maxSeats,
              currentCapacity,
            };
          }),
        );
        setJoinEventMessage(
          result.message || "You joined the event successfully.",
        );
      } else if (isAlreadyRegistered) {
        setJoinedEventIds((prev) =>
          prev.includes(event.id) ? prev : [...prev, event.id],
        );
        setJoinEventMessage(
          result?.message || "You are already registered for this event.",
        );
      } else {
        setJoinEventMessage(result?.message || "Failed to join event.");
      }
    } catch (error) {
      console.error("Failed to join event", error);
      setJoinEventMessage("Failed to join event.");
    } finally {
      setJoiningEventId(null);
    }
  };

  const handleUnjoinEvent = async (event: any) => {
    const token = window.localStorage.getItem("token");
    if (!token) {
      setJoinEventMessage("Please sign in before leaving an event.");
      return;
    }

    if (!window.confirm("Are you sure you want to cancel your registration?")) {
      return;
    }

    try {
      setUnjoiningEventId(event.id);
      setJoinEventMessage("");
      const response = await axios
        .delete(
          `${API_BASE_URL}/club/${activeClubId}/event/${event.id}/unregister`,
          {
            headers: {
              ...getAuthHeaders(),
              "Content-Type": "application/json",
            },
          },
        )
        .catch((err) => err.response ?? null);
      const result = response?.data ?? null;

      if (
        response &&
        response.status >= 200 &&
        response.status < 300 &&
        result?.success
      ) {
        setJoinedEventIds((prev) => prev.filter((id) => id !== event.id));

        setEventsData((prev) =>
          prev.map((item) => {
            if (item.id !== event.id) return item;

            const updatedEvent = result?.data?.event;
            const maxSeats = Number(
              updatedEvent?.max_capacity ?? item.maxSeats ?? 0,
            );
            const currentCapacity = Number(
              updatedEvent?.current_capacity ??
                Math.max(0, (item.currentCapacity ?? 0) - 1),
            );
            const nextSeats =
              maxSeats > 0
                ? Math.max(0, maxSeats - currentCapacity)
                : Math.max(0, (item.seats ?? 0) + 1);

            return {
              ...item,
              seats: nextSeats,
              maxSeats: Number.isFinite(maxSeats) ? maxSeats : item.maxSeats,
              currentCapacity,
            };
          }),
        );

        setJoinEventMessage(result?.message || "You left the event.");
      } else {
        setJoinEventMessage(result?.message || "Failed to leave event.");
      }
    } catch (error) {
      console.error("Failed to leave event", error);
      setJoinEventMessage("Failed to leave event.");
    } finally {
      setUnjoiningEventId(null);
    }
  };

  useEffect(() => {
    const loadLandingContent = async () => {
      const clubId = activeClubId;

      try {
        const [plansResponse, eventsResponse, activitiesResponse] =
          await Promise.allSettled([
            axios
              .get(`${API_BASE_URL}/club/${clubId}/plan`, {
                headers: { Accept: "application/json" },
              })
              .catch(() => null),
            axios
              .get(`${API_BASE_URL}/club/${clubId}/event`, {
                headers: { Accept: "application/json" },
              })
              .catch(() => null),
            axios
              .get(`${API_BASE_URL}/club/${clubId}/activity`, {
                headers: { Accept: "application/json" },
              })
              .catch(() => null),
          ]);

        const plansResult =
          plansResponse.status === "fulfilled" && plansResponse.value
            ? plansResponse.value.data
            : null;
        const eventsResult =
          eventsResponse.status === "fulfilled" && eventsResponse.value
            ? eventsResponse.value.data
            : null;
        const activitiesResult =
          activitiesResponse.status === "fulfilled" && activitiesResponse.value
            ? activitiesResponse.value.data
            : null;

        const normalizedPlans = normalizePlans(plansResult);
        if (normalizedPlans.length > 0) {
          setPlansData(normalizedPlans);
        }

        const normalizedEvents = normalizeEvents(eventsResult);
        if (normalizedEvents.length > 0) {
          setEventsData(normalizedEvents);
        }

        const normalizedActivities = normalizeActivities(activitiesResult);
        if (normalizedActivities.length > 0) {
          setActivitiesData(normalizedActivities);
        }

        const normalizedEventsForState =
          normalizedEvents.length > 0 ? normalizedEvents : [];
        if (normalizedEventsForState.length > 0) {
          await syncJoinedEventState(normalizedEventsForState);
        }
      } catch (error) {
        console.error("Failed to load landing page content", error);
      }
    };

    void loadLandingContent();
  }, []);

  const closeSlotModal = () => {
    setSelectedActivity(null);
    setActivitySlots([]);
    setBookingMessage("");
    setBookingInProgressId(null);
  };

  const openSlotModal = async (activity: any) => {
    setSelectedActivity(activity);
    setBookingMessage("");
    setSlotsLoading(true);

    const cachedSlots = Array.isArray(activity?.slotDetails)
      ? activity.slotDetails
      : [];
    if (cachedSlots.length > 0) {
      setActivitySlots(cachedSlots);
    }

    try {
      const response = await axios
        .get(
          `${API_BASE_URL}/club/${activity.clubId ?? activeClubId}/activity/${activity.id}/slots`,
          { headers: getAuthHeaders() },
        )
        .catch(() => null);
      const payload = response?.data ?? null;
      const slots = Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload?.slots)
          ? payload.slots
          : Array.isArray(payload)
            ? payload
            : [];

      if (response && response.status >= 200 && response.status < 300) {
        if (slots.length > 0) {
          setActivitySlots(slots);
        } else if (cachedSlots.length > 0) {
          setBookingMessage("Showing cached slot details from activity card.");
        } else {
          setActivitySlots([]);
        }
      } else {
        throw new Error(
          payload?.message || `Request failed (${response?.status})`,
        );
      }
    } catch (error) {
      console.error("Failed to load slots", error);
      if (cachedSlots.length > 0) {
        setBookingMessage("Showing cached slot details from activity card.");
        setActivitySlots(cachedSlots);
      } else {
        setActivitySlots([]);
        setBookingMessage("Failed to load slot availability.");
      }
    } finally {
      setSlotsLoading(false);
    }
  };

  const handleBookSlot = async (slot: any) => {
    if (!selectedActivity) return;

    const token =
      typeof window !== "undefined"
        ? window.localStorage.getItem("token")
        : null;
    if (!token) {
      setBookingMessage("Please sign in to book this slot.");
      return;
    }

    try {
      setBookingInProgressId(slot.id);
      const response = await axios
        .post(
          `${API_BASE_URL}/club/${activeClubId}/activity/${selectedActivity.id}/slot/${slot.id}/book`,
          {},
          {
            headers: {
              ...getAuthHeaders(),
              "Content-Type": "application/json",
            },
          },
        )
        .catch((err) => err.response ?? null);
      const payload = response?.data ?? null;

      if (
        response &&
        response.status >= 200 &&
        response.status < 300 &&
        payload?.success
      ) {
        setBookingMessage(payload.message || "Slot booked successfully.");
        await openSlotModal(selectedActivity);
      } else {
        setBookingMessage(payload?.message || "Booking failed.");
      }
    } catch (error) {
      console.error("Failed to book slot", error);
      setBookingMessage("Failed to book slot.");
    } finally {
      setBookingInProgressId(null);
    }
  };

  return (
    <div style={{ background: "#F8FAFC", minHeight: "100vh" }}>
      <Navbar navigate={navigate} currentPage="landing" />

      {}
      <section
        style={{
          background:
            "linear-gradient(135deg, #0B1829 0%, #0D2847 50%, #091B3B 100%)",
          position: "relative",
          overflow: "hidden",
          minHeight: 680,
        }}
      >
        {}
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(15,98,254,0.15) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -60,
            left: 100,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(34,197,94,0.1) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 100,
            left: -60,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "80px 24px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 60,
            alignItems: "center",
          }}
          className="grid-cols-1 md:grid-cols-2"
        >
          {}
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(15,98,254,0.15)",
                border: "1px solid rgba(15,98,254,0.3)",
                borderRadius: 100,
                padding: "6px 16px",
                marginBottom: 24,
              }}
            >
              <Zap size={14} color="#3B82F6" fill="#3B82F6" />
              <span style={{ fontSize: 13, color: "#93C5FD", fontWeight: 500 }}>
                1,200+ Sports Clubs Worldwide
              </span>
            </div>
            <h1
              style={{
                fontSize: "clamp(32px, 4vw, 52px)",
                fontWeight: 900,
                color: "white",
                lineHeight: 1.15,
                marginBottom: 20,
                letterSpacing: "-1px",
              }}
            >
              Welcome to
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #3B82F6, #22C55E)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Your Sports Club
              </span>
              <br />
              Book. Train. Excel.
            </h1>
            <p
              style={{
                fontSize: 17,
                color: "#94A3B8",
                lineHeight: 1.75,
                marginBottom: 36,
                maxWidth: 500,
              }}
            >
              Discover sports clubs, gyms, football fields, swimming pools,
              tennis courts, and events â€” all in one place. Book in seconds,
              no memberships required.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button
                onClick={() => navigate("club-profile")}
                style={{
                  padding: "14px 28px",
                  borderRadius: 12,
                  background: "linear-gradient(135deg, #0F62FE, #0043CE)",
                  color: "white",
                  fontSize: 15,
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  boxShadow: "0 8px 24px rgba(15,98,254,0.4)",
                  transition: "transform 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-2px)")
                }
                onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
              >
                Explore Clubs <ArrowRight size={16} />
              </button>
              <button
                onClick={() => navigate("dashboard")}
                style={{
                  padding: "14px 28px",
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.08)",
                  backdropFilter: "blur(10px)",
                  color: "white",
                  fontSize: 15,
                  fontWeight: 600,
                  border: "1.5px solid rgba(255,255,255,0.15)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.12)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.08)")
                }
              >
                <Play size={14} fill="white" /> Join Now
              </button>
            </div>
            {}
            <div
              style={{
                display: "flex",
                gap: 32,
                marginTop: 48,
                flexWrap: "wrap",
              }}
            >
              {[
                { value: "1,200+", label: "Sports Clubs" },
                { value: "50K+", label: "Active Members" },
                { value: "8,000+", label: "Monthly Events" },
              ].map((s) => (
                <div key={s.label}>
                  <p
                    style={{
                      fontSize: 26,
                      fontWeight: 800,
                      color: "white",
                      margin: 0,
                      letterSpacing: "-0.5px",
                    }}
                  >
                    {s.value}
                  </p>
                  <p
                    style={{
                      fontSize: 12,
                      color: "#64748B",
                      margin: "2px 0 0",
                    }}
                  >
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {}
          <div
            style={{ position: "relative", height: 480 }}
            className="hidden md:block"
          >
            {}
            <div
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                width: "88%",
                height: 320,
                borderRadius: 20,
                overflow: "hidden",
                boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
              }}
            >
              <img
                src={IMG.gym1}
                alt="Sports"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)",
                }}
              />
            </div>
            {}
            <div
              style={{
                position: "absolute",
                left: 0,
                bottom: 20,
                width: "52%",
                height: 200,
                borderRadius: 16,
                overflow: "hidden",
                boxShadow: "0 16px 40px rgba(0,0,0,0.4)",
                border: "3px solid rgba(255,255,255,0.1)",
              }}
            >
              <img
                src={IMG.footballField}
                alt="Football"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            {}
            <div
              style={{
                position: "absolute",
                top: 20,
                left: 20,
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 14,
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                gap: 10,
                boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "linear-gradient(135deg, #22C55E, #16A34A)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Check size={16} color="white" strokeWidth={3} />
              </div>
              <div>
                <p
                  style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.7)",
                    margin: 0,
                  }}
                >
                  Booking Confirmed
                </p>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "white",
                    margin: 0,
                  }}
                >
                  Football - 5PM Today
                </p>
              </div>
            </div>
            {}
            <div
              style={{
                position: "absolute",
                bottom: 80,
                right: 10,
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 14,
                padding: "12px 16px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 6,
                }}
              >
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} fill="#F59E0B" color="#F59E0B" />
                ))}
                <span
                  style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.8)",
                    fontWeight: 600,
                  }}
                >
                  4.9
                </span>
              </div>
              <p
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.7)",
                  margin: 0,
                }}
              >
                Rated by 48K members
              </p>
            </div>
          </div>
        </div>
      </section>

      {}
      <section
        style={{
          padding: "0 24px",
          marginTop: -32,
          position: "relative",
          zIndex: 10,
        }}
      >
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div
            style={{
              background: "white",
              borderRadius: 20,
              boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
              padding: "24px 28px",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: 16,
                alignItems: "end",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                  gap: 12,
                }}
              >
                {}
                <div>
                  <label
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#6B7280",
                      textTransform: "uppercase",
                      letterSpacing: 0.8,
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    Search
                  </label>
                  <div style={{ position: "relative" }}>
                    <Search
                      size={15}
                      color="#9CA3AF"
                      style={{
                        position: "absolute",
                        left: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                      }}
                    />
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Club, activity..."
                      style={{
                        width: "100%",
                        paddingLeft: 34,
                        paddingRight: 12,
                        height: 44,
                        border: "1.5px solid #E5E7EB",
                        borderRadius: 10,
                        fontSize: 14,
                        color: "#111827",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#0F62FE")}
                      onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                    />
                  </div>
                </div>
                {}
                <div>
                  <label
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#6B7280",
                      textTransform: "uppercase",
                      letterSpacing: 0.8,
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    Sport
                  </label>
                  <select
                    value={selectedSport}
                    onChange={(e) => setSelectedSport(e.target.value)}
                    style={{
                      width: "100%",
                      height: 44,
                      border: "1.5px solid #E5E7EB",
                      borderRadius: 10,
                      fontSize: 14,
                      color: "#111827",
                      padding: "0 12px",
                      outline: "none",
                      background: "white",
                      boxSizing: "border-box",
                    }}
                  >
                    <option value="">All Sports</option>
                    {[
                      "Football",
                      "Gym",
                      "Swimming",
                      "Basketball",
                      "Tennis",
                      "Yoga",
                      "Martial Arts",
                    ].map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                {}
                <div>
                  <label
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#6B7280",
                      textTransform: "uppercase",
                      letterSpacing: 0.8,
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    City
                  </label>
                  <div style={{ position: "relative" }}>
                    <MapPin
                      size={15}
                      color="#9CA3AF"
                      style={{
                        position: "absolute",
                        left: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                      }}
                    />
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      style={{
                        width: "100%",
                        height: 44,
                        border: "1.5px solid #E5E7EB",
                        borderRadius: 10,
                        fontSize: 14,
                        color: "#111827",
                        paddingLeft: 34,
                        paddingRight: 12,
                        outline: "none",
                        background: "white",
                        boxSizing: "border-box",
                      }}
                    >
                      <option value="">Any City</option>
                      {[
                        "San Francisco",
                        "New York",
                        "Los Angeles",
                        "Chicago",
                        "Miami",
                      ].map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {}
                <div>
                  <label
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#6B7280",
                      textTransform: "uppercase",
                      letterSpacing: 0.8,
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    Date
                  </label>
                  <div style={{ position: "relative" }}>
                    <Calendar
                      size={15}
                      color="#9CA3AF"
                      style={{
                        position: "absolute",
                        left: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                      }}
                    />
                    <input
                      type="date"
                      style={{
                        width: "100%",
                        height: 44,
                        border: "1.5px solid #E5E7EB",
                        borderRadius: 10,
                        fontSize: 14,
                        color: "#111827",
                        paddingLeft: 34,
                        paddingRight: 12,
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                </div>
              </div>
              <button
                onClick={() => navigate("club-profile")}
                style={{
                  height: 44,
                  padding: "0 28px",
                  borderRadius: 10,
                  background: "linear-gradient(135deg, #0F62FE, #0043CE)",
                  color: "white",
                  fontSize: 15,
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  whiteSpace: "nowrap",
                  boxShadow: "0 6px 20px rgba(15,98,254,0.35)",
                }}
              >
                <Search size={16} /> Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#0F62FE",
                textTransform: "uppercase",
                letterSpacing: 1.2,
              }}
            >
              Browse by Sport
            </span>
            <h2
              style={{
                fontSize: "clamp(26px, 3vw, 38px)",
                fontWeight: 800,
                color: "#111827",
                marginTop: 8,
                letterSpacing: "-0.5px",
              }}
            >
              Popular Sports
            </h2>
            <p style={{ fontSize: 16, color: "#6B7280", marginTop: 8 }}>
              Find clubs and activities for your favorite sport
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
              gap: 16,
            }}
          >
            {sportCategories.map((sport) => (
              <button
                key={sport.name}
                onClick={() => navigate("club-profile")}
                style={{
                  position: "relative",
                  aspectRatio: "3/4",
                  borderRadius: 16,
                  overflow: "hidden",
                  border: "none",
                  cursor: "pointer",
                  transition: "transform 0.25s, box-shadow 0.25s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(-6px) scale(1.02)";
                  e.currentTarget.style.boxShadow =
                    "0 16px 40px rgba(0,0,0,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow =
                    "0 4px 16px rgba(0,0,0,0.08)";
                }}
              >
                <img
                  src={sport.image}
                  alt={sport.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: `linear-gradient(to top, ${sport.color}DD 0%, rgba(0,0,0,0.2) 60%, transparent 100%)`,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: "rgba(255,255,255,0.15)",
                    backdropFilter: "blur(10px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <sport.icon size={16} color="white" />
                </div>
                <div
                  style={{
                    position: "absolute",
                    bottom: 12,
                    left: 12,
                    right: 12,
                    textAlign: "left",
                  }}
                >
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "white",
                      margin: 0,
                    }}
                  >
                    {sport.name}
                  </p>
                  <p
                    style={{
                      fontSize: 11,
                      color: "rgba(255,255,255,0.8)",
                      margin: "2px 0 0",
                    }}
                  >
                    {sport.clubs} clubs
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {}
      <section style={{ padding: "0 24px 80px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: 40,
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <div>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#0F62FE",
                  textTransform: "uppercase",
                  letterSpacing: 1.2,
                }}
              >
                Discover More
              </span>
              <h2
                style={{
                  fontSize: "clamp(26px, 3vw, 38px)",
                  fontWeight: 800,
                  color: "#111827",
                  marginTop: 8,
                  letterSpacing: "-0.5px",
                }}
              >
                Activities
              </h2>
            </div>
            {}
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 24,
            }}
          >
            {activitiesData.map((activity) => (
              <div
                key={activity.id}
                onMouseEnter={() => setHoveredClub(activity.id)}
                onMouseLeave={() => setHoveredClub(null)}
                style={{
                  background: "white",
                  borderRadius: 20,
                  overflow: "hidden",
                  boxShadow:
                    hoveredClub === activity.id
                      ? "0 16px 48px rgba(15,98,254,0.15)"
                      : "0 4px 20px rgba(0,0,0,0.07)",
                  transition: "all 0.3s",
                  transform:
                    hoveredClub === activity.id ? "translateY(-4px)" : "none",
                }}
              >
                <div style={{ position: "relative", height: 200 }}>
                  <img
                    src={activity.image}
                    alt={activity.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  {activity.badge && (
                    <span
                      style={{
                        position: "absolute",
                        top: 14,
                        left: 14,
                        padding: "4px 12px",
                        borderRadius: 100,
                        background:
                          activity.badge === "Top Rated"
                            ? "#0F62FE"
                            : activity.badge === "Popular"
                              ? "#22C55E"
                              : activity.badge === "New"
                                ? "#F59E0B"
                                : "#8B5CF6",
                        color: "white",
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      {activity.badge}
                    </span>
                  )}
                </div>
                <div style={{ padding: "20px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 8,
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
                      {activity.name}
                    </h3>
                    <div
                      style={{
                        background: "#EFF4FF",
                        color: "#0F62FE",
                        padding: "4px 10px",
                        borderRadius: 999,
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      {activity.category}
                    </div>
                  </div>
                  <p
                    style={{
                      fontSize: 13,
                      color: "#6B7280",
                      margin: "0 0 12px",
                      lineHeight: 1.5,
                    }}
                  >
                    {activity.description}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 10,
                      marginBottom: 12,
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <Users size={14} color="#9CA3AF" />
                      <span style={{ fontSize: 13, color: "#6B7280" }}>
                        {activity.coach}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        marginTop: 6,
                      }}
                    >
                      <Clock size={14} color="#9CA3AF" />
                      <span style={{ fontSize: 13, color: "#6B7280" }}>
                        {activity.slots ?? 0} slots available
                      </span>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 11, color: "#9CA3AF" }}>
                        Starting from
                      </div>
                      <div
                        style={{
                          fontSize: 18,
                          fontWeight: 800,
                          color: "#0F62FE",
                        }}
                      >
                        {"$" + Number(activity.price).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => void openSlotModal(activity)}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
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
                    Book Activity
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedActivity && (
        <div
          onClick={closeSlotModal}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(15, 23, 42, 0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 560,
              background: "white",
              borderRadius: 20,
              padding: 24,
              boxShadow: "0 20px 60px rgba(15, 23, 42, 0.25)",
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
              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 12,
                    color: "#0F62FE",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}
                >
                  Available slots
                </p>
                <h3
                  style={{
                    margin: "8px 0 0",
                    fontSize: 22,
                    fontWeight: 800,
                    color: "#111827",
                  }}
                >
                  {selectedActivity.name}
                </h3>
              </div>
              <button
                onClick={closeSlotModal}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 999,
                  border: "none",
                  background: "#F3F4F6",
                  color: "#374151",
                  cursor: "pointer",
                  fontSize: 18,
                  lineHeight: 1,
                }}
              >
                ✕
              </button>
            </div>

            <p style={{ margin: "0 0 18px", color: "#6B7280", fontSize: 13 }}>
              Choose a slot and confirm your booking.
            </p>

            {bookingMessage ? (
              <div
                style={{
                  marginBottom: 14,
                  padding: "12px 14px",
                  borderRadius: 14,
                  background: bookingMessage.includes("success")
                    ? "#F0FDF4"
                    : "#FEF2F2",
                  color: bookingMessage.includes("success")
                    ? "#166534"
                    : "#991B1B",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {bookingMessage}
              </div>
            ) : null}

            {slotsLoading ? (
              <div style={{ color: "#6B7280", fontSize: 14 }}>
                Loading slots...
              </div>
            ) : activitySlots.length === 0 ? (
              <div style={{ color: "#6B7280", fontSize: 14 }}>
                No slots are available for this activity yet.
              </div>
            ) : (
              <div style={{ display: "grid", gap: 12 }}>
                {activitySlots.map((slot) => (
                  <div
                    key={slot.id}
                    style={{
                      border: "1px solid #E5E7EB",
                      borderRadius: 16,
                      padding: "14px 16px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 700,
                          color: "#111827",
                        }}
                      >
                        {slot.start_time} - {slot.end_time}
                      </div>
                      <div
                        style={{ fontSize: 12, color: "#6B7280", marginTop: 3 }}
                      >
                        {slot.is_booked ? "Booked" : "Available"}
                      </div>
                    </div>
                    <button
                      onClick={() => void handleBookSlot(slot)}
                      disabled={
                        slot.is_booked || bookingInProgressId === slot.id
                      }
                      style={{
                        padding: "10px 14px",
                        borderRadius: 12,
                        border: "none",
                        background: slot.is_booked ? "#E5E7EB" : "#0F62FE",
                        color: slot.is_booked ? "#6B7280" : "white",
                        cursor: slot.is_booked ? "not-allowed" : "pointer",
                        fontWeight: 700,
                        fontSize: 13,
                      }}
                    >
                      {bookingInProgressId === slot.id
                        ? "Booking..."
                        : slot.is_booked
                          ? "Booked"
                          : "Book"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {}
      <section style={{ padding: "0 24px 80px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: 40,
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <div>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#22C55E",
                  textTransform: "uppercase",
                  letterSpacing: 1.2,
                }}
              >
                Don't Miss Out
              </span>
              <h2
                style={{
                  fontSize: "clamp(26px, 3vw, 38px)",
                  fontWeight: 800,
                  color: "#111827",
                  marginTop: 8,
                  letterSpacing: "-0.5px",
                }}
              >
                Upcoming Events
              </h2>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                flexWrap: "wrap",
                justifyContent: "flex-end",
              }}
            >
              {joinEventMessage ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 12px",
                    borderRadius: 999,
                    background: joinEventMessage.includes("success")
                      ? "#ECFDF3"
                      : "#FEF2F2",
                    color: joinEventMessage.includes("success")
                      ? "#166534"
                      : "#B91C1C",
                    fontSize: 13,
                    fontWeight: 600,
                    border: joinEventMessage.includes("success")
                      ? "1px solid #A7F3D0"
                      : "1px solid #FECACA",
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: joinEventMessage.includes("success")
                        ? "#16A34A"
                        : "#DC2626",
                      color: "white",
                      flexShrink: 0,
                    }}
                  >
                    <Check size={12} />
                  </span>
                  <span>{joinEventMessage}</span>
                </div>
              ) : null}
              {}
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
              gap: 24,
            }}
          >
            {eventsData.map((event) => (
              <div
                key={event.id}
                style={{
                  background: "white",
                  borderRadius: 20,
                  overflow: "hidden",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow =
                    "0 16px 48px rgba(0,0,0,0.12)";
                  (e.currentTarget as HTMLDivElement).style.transform =
                    "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow =
                    "0 4px 20px rgba(0,0,0,0.07)";
                  (e.currentTarget as HTMLDivElement).style.transform = "none";
                }}
              >
                <div style={{ position: "relative", height: 180 }}>
                  <img
                    src={event.banner}
                    alt={event.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
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
                      top: 14,
                      left: 14,
                      padding: "4px 12px",
                      borderRadius: 100,
                      background: "#22C55E",
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
                      bottom: 14,
                      right: 14,
                      padding: "4px 12px",
                      borderRadius: 100,
                      background: "rgba(255,255,255,0.9)",
                      color: "#111827",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    {"$" + Number(event.price).toLocaleString()}
                  </span>
                </div>
                <div style={{ padding: "20px" }}>
                  <h3
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: "#111827",
                      margin: "0 0 10px",
                    }}
                  >
                    {event.title}
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                      marginBottom: 16,
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <Calendar size={13} color="#0F62FE" />
                      <span style={{ fontSize: 13, color: "#374151" }}>
                        {event.date} at {event.time}
                      </span>
                    </div>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <MapPin size={13} color="#6B7280" />
                      <span style={{ fontSize: 13, color: "#6B7280" }}>
                        {event.club}
                      </span>
                    </div>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <Users size={13} color="#6B7280" />
                      <span style={{ fontSize: 13, color: "#6B7280" }}>
                        {event.currentCapacity} seats of {event.maxSeats}
                      </span>
                    </div>
                  </div>
                  {}
                  <div
                    style={{
                      height: 4,
                      background: "#F3F4F6",
                      borderRadius: 100,
                      marginBottom: 16,
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        borderRadius: 100,
                        background: event.seats < 10 ? "#EF4444" : "#22C55E",
                        width: `${
                          event.maxSeats > 0
                            ? (event.currentCapacity / event.maxSeats) * 100
                            : 0
                        }%`,
                        transition: "width 0.5s",
                      }}
                    />
                  </div>
                  <button
                    onClick={() =>
                      void (joinedEventIds.includes(event.id)
                        ? handleUnjoinEvent(event)
                        : handleJoinEvent(event))
                    }
                    disabled={
                      joiningEventId === event.id ||
                      unjoiningEventId === event.id
                    }
                    style={{
                      width: "100%",
                      padding: "11px",
                      borderRadius: 12,
                      background:
                        joiningEventId === event.id ||
                        joinedEventIds.includes(event.id)
                          ? "#E5E7EB"
                          : "linear-gradient(135deg, #22C55E, #16A34A)",
                      color:
                        joiningEventId === event.id ||
                        joinedEventIds.includes(event.id)
                          ? "#4B5563"
                          : "white",
                      fontSize: 14,
                      fontWeight: 600,
                      border:
                        joiningEventId === event.id ||
                        joinedEventIds.includes(event.id)
                          ? "1px solid #D1D5DB"
                          : "none",
                      cursor:
                        joiningEventId === event.id ||
                        unjoiningEventId === event.id
                          ? "not-allowed"
                          : "pointer",
                      boxShadow:
                        joiningEventId === event.id ||
                        joinedEventIds.includes(event.id)
                          ? "none"
                          : "0 4px 12px rgba(34,197,94,0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                    }}
                  >
                    {joinedEventIds.includes(event.id) ? (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 18,
                          height: 18,
                          borderRadius: "50%",
                          background: "#16A34A",
                          color: "white",
                        }}
                      >
                        <Check size={12} />
                      </span>
                    ) : (
                      <Ticket size={15} />
                    )}
                    {joiningEventId === event.id
                      ? "Joining..."
                      : unjoiningEventId === event.id
                        ? "Unjoining..."
                        : joinedEventIds.includes(event.id)
                          ? "Joined Event"
                          : "Join Event"}
                  </button>
                </div>
              </div>
            ))}
          </div>
          {joinEventMessage ? (
            <div
              style={{
                marginTop: 16,
                color: joinEventMessage.includes("success")
                  ? "#16A34A"
                  : "#B91C1C",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {joinEventMessage}
            </div>
          ) : null}
        </div>
      </section>

      {}
      <section
        style={{
          padding: "80px 24px",
          background: "linear-gradient(180deg, #EFF4FF 0%, #F8FAFC 100%)",
        }}
      >
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#0F62FE",
                textTransform: "uppercase",
                letterSpacing: 1.2,
              }}
            >
              Simple Pricing
            </span>
            <h2
              style={{
                fontSize: "clamp(26px, 3vw, 38px)",
                fontWeight: 800,
                color: "#111827",
                marginTop: 8,
                letterSpacing: "-0.5px",
              }}
            >
              Membership Plans
            </h2>
            <p style={{ fontSize: 16, color: "#6B7280", marginTop: 8 }}>
              Choose the plan that fits your active lifestyle
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 24,
              alignItems: "start",
            }}
          >
            {plansData.map((plan, i) => (
              <div
                key={plan.name}
                style={{
                  background: plan.popular ? plan.gradient : "white",
                  borderRadius: 20,
                  padding: 28,
                  boxShadow: plan.popular
                    ? "0 20px 60px rgba(15,98,254,0.25)"
                    : "0 4px 20px rgba(0,0,0,0.07)",
                  position: "relative",
                  transform: plan.popular ? "scale(1.04)" : "none",
                  transition: "transform 0.3s, box-shadow 0.3s",
                }}
                onMouseEnter={(e) => {
                  if (!plan.popular)
                    (e.currentTarget as HTMLDivElement).style.boxShadow =
                      "0 16px 48px rgba(0,0,0,0.12)";
                }}
                onMouseLeave={(e) => {
                  if (!plan.popular)
                    (e.currentTarget as HTMLDivElement).style.boxShadow =
                      "0 4px 20px rgba(0,0,0,0.07)";
                }}
              >
                {plan.popular && (
                  <span
                    style={{
                      position: "absolute",
                      top: -14,
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "#F59E0B",
                      color: "white",
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "5px 16px",
                      borderRadius: 100,
                      whiteSpace: "nowrap",
                    }}
                  >
                    â­ Most Popular
                  </span>
                )}
                <div style={{ marginBottom: 20 }}>
                  <h3
                    style={{
                      fontSize: 20,
                      fontWeight: 800,
                      color: plan.popular ? "white" : "#111827",
                      margin: "0 0 6px",
                    }}
                  >
                    {plan.name}
                  </h3>
                  <div>
                    <span
                      style={{
                        fontSize: 36,
                        fontWeight: 900,
                        color: plan.popular ? "white" : plan.color,
                      }}
                    >
                      {"$" + Number(plan.price).toLocaleString()}
                    </span>
                    <span
                      style={{
                        fontSize: 14,
                        color: plan.popular
                          ? "rgba(255,255,255,0.7)"
                          : "#9CA3AF",
                      }}
                    >
                      /month
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    marginBottom: 24,
                  }}
                >
                  {plan.features.map((f: string) => (
                    <div
                      key={f}
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          background: plan.popular
                            ? "rgba(255,255,255,0.2)"
                            : "#EFF4FF",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Check
                          size={11}
                          color={plan.popular ? "white" : "#0F62FE"}
                          strokeWidth={3}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: 13,
                          color: plan.popular
                            ? "rgba(255,255,255,0.85)"
                            : "#374151",
                        }}
                      >
                        {f}
                      </span>
                    </div>
                  ))}
                </div>
                <button
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: 12,
                    background: plan.popular
                      ? "rgba(255,255,255,0.2)"
                      : plan.name === "Elite"
                        ? plan.gradient
                        : "linear-gradient(135deg, #0F62FE, #0043CE)",
                    color: "white",
                    fontSize: 14,
                    fontWeight: 700,
                    border: plan.popular
                      ? "1.5px solid rgba(255,255,255,0.4)"
                      : "none",
                    cursor: "pointer",
                    backdropFilter: "blur(10px)",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    if (plan.popular)
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    if (plan.popular)
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.2)";
                  }}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#0F62FE",
                textTransform: "uppercase",
                letterSpacing: 1.2,
              }}
            >
              Why Us
            </span>
            <h2
              style={{
                fontSize: "clamp(26px, 3vw, 38px)",
                fontWeight: 800,
                color: "#111827",
                marginTop: 8,
                letterSpacing: "-0.5px",
              }}
            >
              Why Choose Sportify<span style={{ color: "#0F62FE" }}>Hub</span>
            </h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 24,
            }}
          >
            {whyFeatures.map((f) => (
              <div
                key={f.title}
                style={{
                  background: "white",
                  borderRadius: 20,
                  padding: "32px 24px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
                  textAlign: "center",
                  transition: "all 0.3s",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform =
                    "translateY(-6px)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow =
                    `0 16px 48px ${f.color}20`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "none";
                  (e.currentTarget as HTMLDivElement).style.boxShadow =
                    "0 4px 20px rgba(0,0,0,0.07)";
                }}
              >
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 16,
                    background: `${f.color}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                  }}
                >
                  <f.icon size={26} color={f.color} />
                </div>
                <h3
                  style={{
                    fontSize: 17,
                    fontWeight: 700,
                    color: "#111827",
                    margin: "0 0 10px",
                  }}
                >
                  {f.title}
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    color: "#6B7280",
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {}
      <section style={{ padding: "0 24px 80px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#0F62FE",
                textTransform: "uppercase",
                letterSpacing: 1.2,
              }}
            >
              Real Stories
            </span>
            <h2
              style={{
                fontSize: "clamp(26px, 3vw, 38px)",
                fontWeight: 800,
                color: "#111827",
                marginTop: 8,
                letterSpacing: "-0.5px",
              }}
            >
              What Our Members Say
            </h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 24,
            }}
          >
            {testimonials.map((t) => (
              <div
                key={t.name}
                style={{
                  background: "white",
                  borderRadius: 20,
                  padding: "28px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
                  position: "relative",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform =
                    "translateY(-4px)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow =
                    "0 16px 48px rgba(0,0,0,0.12)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "none";
                  (e.currentTarget as HTMLDivElement).style.boxShadow =
                    "0 4px 20px rgba(0,0,0,0.07)";
                }}
              >
                <Quote
                  size={28}
                  color="#EFF4FF"
                  fill="#EFF4FF"
                  style={{ position: "absolute", top: 20, right: 20 }}
                />
                <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={14} fill="#F59E0B" color="#F59E0B" />
                  ))}
                </div>
                <p
                  style={{
                    fontSize: 14,
                    color: "#374151",
                    lineHeight: 1.75,
                    margin: "0 0 24px",
                  }}
                >
                  "{t.text}"
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      background: t.gradient,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14,
                      fontWeight: 700,
                      color: "white",
                    }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: "#111827",
                        margin: 0,
                      }}
                    >
                      {t.name}
                    </p>
                    <p style={{ fontSize: 12, color: "#6B7280", margin: 0 }}>
                      {t.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {}
      <section style={{ padding: "0 24px 80px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div
            style={{
              background:
                "linear-gradient(135deg, #0F62FE 0%, #0043CE 50%, #003587 100%)",
              borderRadius: 24,
              padding: "60px 48px",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -60,
                right: -60,
                width: 240,
                height: 240,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.05)",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: -40,
                left: -40,
                width: 180,
                height: 180,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.05)",
              }}
            />
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "rgba(255,255,255,0.7)",
                textTransform: "uppercase",
                letterSpacing: 1.2,
              }}
            >
              Ready to Start?
            </span>
            <h2
              style={{
                fontSize: "clamp(24px, 3vw, 40px)",
                fontWeight: 900,
                color: "white",
                marginTop: 12,
                letterSpacing: "-0.5px",
              }}
            >
              Join 50,000+ Athletes Today
            </h2>
            <p
              style={{
                fontSize: 16,
                color: "rgba(255,255,255,0.75)",
                marginTop: 12,
                marginBottom: 36,
              }}
            >
              Discover your nearest sports club, book a session, and start your
              journey.
            </p>
            <div
              style={{
                display: "flex",
                gap: 16,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => navigate("club-profile")}
                style={{
                  padding: "14px 32px",
                  borderRadius: 12,
                  background: "white",
                  color: "#0F62FE",
                  fontSize: 15,
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                }}
              >
                Explore Clubs
              </button>
              <button
                onClick={() => navigate("dashboard")}
                style={{
                  padding: "14px 32px",
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.12)",
                  color: "white",
                  fontSize: 15,
                  fontWeight: 700,
                  border: "1.5px solid rgba(255,255,255,0.3)",
                  cursor: "pointer",
                  backdropFilter: "blur(10px)",
                }}
              >
                Club Dashboard
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer navigate={navigate} />
    </div>
  );
}
