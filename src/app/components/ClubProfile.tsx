import { useEffect, useState } from "react";
import axios from "axios";
import {
  Star,
  MapPin,
  CheckCircle,
  Heart,
  Share2,
  Phone,
  Globe,
  Clock,
  Users,
  Trophy,
  Dumbbell,
  Waves,
  Zap,
  ChevronRight,
  Calendar,
  Shield,
  Wifi,
  Car,
  Coffee,
  Check,
  Quote,
  Camera,
} from "lucide-react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { Page } from "./Navbar";
import { useClubId } from "../utils/club";

const IMGS = {
  hero: "https://images.unsplash.com/photo-1761971975769-97e598bf526b?w=1200&q=80",
  gym1: "https://images.unsplash.com/photo-1775993703558-e7afab02b7bd?w=600&q=80",
  gym2: "https://images.unsplash.com/photo-1775993167571-cd1ff4cadada?w=600&q=80",
  gym3: "https://images.unsplash.com/photo-1765728617805-b9f22d64e5b3?w=600&q=80",
  football:
    "https://images.unsplash.com/photo-1679391029864-d46f366a456b?w=600&q=80",
  swimming:
    "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600&q=80",
  swimming2:
    "https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=600&q=80",
  tennis:
    "https://images.unsplash.com/photo-1545151414-8a948e1ea54f?w=600&q=80",
  yoga: "https://images.unsplash.com/photo-1554245064-3ab88761ac5d?w=600&q=80",
  basket:
    "https://images.unsplash.com/photo-1590227632180-80a3bf110871?w=600&q=80",
  night:
    "https://images.unsplash.com/photo-1676746424139-77f8bd8922a8?w=600&q=80",
};

const tabs = [
  "Overview",
  "Activities",
  "Events",
  "Memberships",
  "Coaches",
  "Gallery",
  "Reviews",
] as const;
type Tab = (typeof tabs)[number];

const API_BASE_URL =
  (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env
    ?.VITE_API_URL || "http://localhost:4000";

const getAuthHeaders = (): Record<string, string> => {
  if (typeof window === "undefined") return { Accept: "application/json" };
  const token = window.localStorage.getItem("token");
  const headers: Record<string, string> = { Accept: "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
};
const normalizeActivities = (payload: any) => {
  const list = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : [];
  return list.map((item: any, index: number) => ({
    id: item?.id ?? index + 1,
    name: item?.name || item?.title || "Activity",
    image: item?.image || IMGS.gym1,
    price: Number(item?.price ?? 0),
    duration: item?.duration || item?.category || "Session",
    coach: item?.coach_name || item?.coach || "Certified Coach",
    slots: Number(item?.slots ?? 0),
    capacity: Number(item?.capacity ?? item?.max_capacity ?? 0),
    tag: item?.tag || (index === 0 ? "Popular" : null),
    description: item?.description || "Live session available now.",
  }));
};

const normalizeEvents = (payload: any) => {
  const list = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : [];
  return list.map((item: any, index: number) => {
    const maxSeats = Number(item?.max_capacity ?? 30);
    const currentCapacity = Number(item?.current_capacity ?? 0);
    const seats = Number(item?.available_seats ?? item?.seats ?? 0);

    return {
      id: item?.id ?? index + 1,
      title: item?.title || item?.name || "Event",
      banner: item?.banner || item?.image || IMGS.football,
      date: item?.start_date
        ? new Date(item.start_date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        : "TBD",
      sport: item?.category || item?.sport || "Club Event",
      price: Number(item?.price ?? 0),
      seats: maxSeats > 0 ? Math.max(0, maxSeats - currentCapacity) : seats,
      maxSeats,
      currentCapacity,
    };
  });
};

const normalizePlans = (payload: any) => {
  const list = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : [];
  return list.map((item: any, index: number) => ({
    id: item?.id ?? index + 1,
    name: item?.name || `Plan ${index + 1}`,
    price: Number(item?.price ?? 0),
    period: item?.period || "month",
    color: item?.color || "#0F62FE",
    popular: Boolean(item?.popular || index === 1),
    features: (() => {
      const v = item?.features;
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
  }));
};

const normalizeCoaches = (payload: any) => {
  const list = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : [];
  return list.map((item: any, index: number) => ({
    id: item?.id ?? index + 1,
    name: item?.fullName || item?.name || "Coach",
    sport: item?.sport || item?.category || "Training",
    exp: item?.experience ? `${item.experience} years` : "Experienced",
    rating: 4.8 + (index % 2) * 0.1,
    reviews: 120 + index * 17,
    avatar: (item?.fullName || "C")
      .split(" ")
      .map((part: string) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase(),
    gradient: [
      "linear-gradient(135deg, #EF4444, #F97316)",
      "linear-gradient(135deg, #06B6D4, #0F62FE)",
      "linear-gradient(135deg, #22C55E, #0F62FE)",
      "linear-gradient(135deg, #8B5CF6, #EC4899)",
    ][index % 4],
    specialty: item?.spechiality || item?.specialty || "Certified Coach",
    bio: item?.bio || "Professional trainer ready to support your goals.",
  }));
};

const FACILITY_ICONS: Record<
  string,
  React.FC<{ size: number; color: string }>
> = {
  wifi: Wifi,
  car: Car,
  coffee: Coffee,
  shield: Shield,
  pool: Waves,
  default: Trophy,
};

interface ClubFacility {
  id: number;
  label: string;
  icon: React.FC<{ size: number; color: string }>;
}

const normalizeClubFacilities = (payload: any): ClubFacility[] => {
  const list = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : [];
  return list.map((item: any, index: number) => {
    const rawLabel =
      typeof item === "string"
        ? item
        : item?.facility || item?.name || item?.label || "Facility";
    const label = String(rawLabel).trim();
    const key = label.toLowerCase();
    const icon =
      FACILITY_ICONS[key] ||
      FACILITY_ICONS[
        Object.keys(FACILITY_ICONS).find((k) => key.includes(k)) || "default"
      ];
    return {
      id: index + 1,
      label,
      icon,
    };
  });
};

const reviews = [
  {
    name: "Ahmed Hassan",
    role: "Member",
    avatar: "AH",
    rating: 5,
    date: "2 weeks ago",
    text: "Great facilities and amazing coaching. The booking system makes it so convenient to schedule my sessions!",
    gradient: "linear-gradient(135deg, #0F62FE, #22C55E)",
  },
  {
    name: "Fatima Al-Mansouri",
    role: "Member",
    avatar: "FM",
    rating: 5,
    date: "1 month ago",
    text: "Professional staff and well-maintained equipment. I've seen significant improvement in my performance since joining.",
    gradient: "linear-gradient(135deg, #F59E0B, #EF4444)",
  },
  {
    name: "Muhammad Khan",
    role: "Member",
    avatar: "MK",
    rating: 5,
    date: "3 weeks ago",
    text: "Excellent training programs and supportive community. Definitely recommend to anyone looking to start their fitness journey.",
    gradient: "linear-gradient(135deg, #8B5CF6, #EC4899)",
  },
  {
    name: "Layla Ibrahim",
    role: "Member",
    avatar: "LI",
    rating: 5,
    date: "1 week ago",
    text: "The instructors are highly qualified and motivating. The facilities are state-of-the-art. Best decision ever!",
    gradient: "linear-gradient(135deg, #06B6D4, #F59E0B)",
  },
];

const galleryImages = [
  IMGS.gym3,
  IMGS.football,
  IMGS.swimming2,
  IMGS.tennis,
  IMGS.yoga,
  IMGS.basket,
  IMGS.gym2,
  IMGS.night,
  IMGS.gym1,
];

interface ClubProfileProps {
  navigate: (page: Page) => void;
}

export function ClubProfile({ navigate }: ClubProfileProps) {
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [followed, setFollowed] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [activitiesData, setActivitiesData] = useState<any[]>([]);
  const [eventsData, setEventsData] = useState<any[]>([]);
  const [plansData, setPlansData] = useState<any[]>([]);
  const [coachesData, setCoachesData] = useState<any[]>([]);
  const [clubInfo, setClubInfo] = useState<any | null>(null);
  const clubName = clubInfo?.clubName || clubInfo?.name || "Arena Sports Club";
  const [loading, setLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState<any | null>(null);
  const [activitySlots, setActivitySlots] = useState<any[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [bookingMessage, setBookingMessage] = useState("");
  const [bookingInProgressId, setBookingInProgressId] = useState<number | null>(
    null,
  );
  const [joiningEventId, setJoiningEventId] = useState<number | null>(null);
  const [joinedEventIds, setJoinedEventIds] = useState<number[]>([]);
  const [unjoiningEventId, setUnjoiningEventId] = useState<number | null>(null);
  const [joinEventMessage, setJoinEventMessage] = useState("");

  const clubId = useClubId();

  const syncJoinedEventState = async (events: any[]) => {
    const token = window.localStorage.getItem("token");
    if (!token || events.length === 0) {
      return;
    }

    try {
      const results = await Promise.allSettled(
        events.map((event) =>
          axios.get(
            `${API_BASE_URL}/club/${clubId}/event/${event.id}/registered`,
            {
              headers: {
                ...getAuthHeaders(),
                Accept: "application/json",
              },
            },
          ),
        ),
      );

      const registeredIds = results.flatMap((result, index) => {
        if (result.status !== "fulfilled") {
          return [];
        }

        const payload = result.value?.data;
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
      const response = await axios.post(
        `${API_BASE_URL}/club/${clubId}/event/${event.id}/register`,
        {},
        {
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
          },
        },
      );
      const result = response.data;

      const isAlreadyRegistered =
        response.status === 409 ||
        /already registered|already joined/i.test(result?.message || "");

      if (response.status >= 200 && response.status < 300 && result?.success) {
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
    } catch (error: any) {
      const result = error?.response?.data;
      const isAlreadyRegistered =
        error?.response?.status === 409 ||
        /already registered|already joined/i.test(result?.message || "");
      if (isAlreadyRegistered) {
        setJoinedEventIds((prev) =>
          prev.includes(event.id) ? prev : [...prev, event.id],
        );
        setJoinEventMessage(
          result?.message || "You are already registered for this event.",
        );
      } else {
        console.error("Failed to join event", error);
        setJoinEventMessage(result?.message || "Failed to join event.");
      }
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
      const response = await axios.delete(
        `${API_BASE_URL}/club/${clubId}/event/${event.id}/unregister`,
        {
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
          },
        },
      );
      const result = response.data;

      if (response.status >= 200 && response.status < 300 && result?.success) {
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
    } catch (error: any) {
      console.error("Failed to leave event", error);
      setJoinEventMessage(
        error?.response?.data?.message || "Failed to leave event.",
      );
    } finally {
      setUnjoiningEventId(null);
    }
  };

  const ratingBreakdown = [5, 4, 3, 2, 1].map((r) => ({
    rating: r,
    pct: r === 5 ? 68 : r === 4 ? 22 : r === 3 ? 7 : r === 2 ? 2 : 1,
  }));

  useEffect(() => {
    const loadClubProfileData = async () => {
      setLoading(true);
      try {
        const [clubRes, activitiesRes, eventsRes, plansRes, coachesRes] =
          await Promise.allSettled([
            axios.get(`${API_BASE_URL}/admin/${clubId}`, {
              headers: { Accept: "application/json" },
            }),
            axios.get(`${API_BASE_URL}/club/${clubId}/activity`, {
              headers: { Accept: "application/json" },
            }),
            axios.get(`${API_BASE_URL}/club/${clubId}/event`, {
              headers: { Accept: "application/json" },
            }),
            axios.get(`${API_BASE_URL}/club/${clubId}/plan`, {
              headers: { Accept: "application/json" },
            }),
            axios.get(`${API_BASE_URL}/club/${clubId}/coach`, {
              headers: { Accept: "application/json" },
            }),
          ]);

        const clubResult =
          clubRes.status === "fulfilled" ? clubRes.value?.data : null;
        const activitiesResult =
          activitiesRes.status === "fulfilled"
            ? activitiesRes.value?.data
            : null;
        const eventsResult =
          eventsRes.status === "fulfilled" ? eventsRes.value?.data : null;
        const plansResult =
          plansRes.status === "fulfilled" ? plansRes.value?.data : null;
        const coachesResult =
          coachesRes.status === "fulfilled" ? coachesRes.value?.data : null;

        setClubInfo(clubResult?.data ?? null);
        setActivitiesData(normalizeActivities(activitiesResult));
        const normalizedEvents = normalizeEvents(eventsResult);
        setEventsData(normalizedEvents);
        await syncJoinedEventState(normalizedEvents);
        setPlansData(normalizePlans(plansResult));
        setCoachesData(normalizeCoaches(coachesResult));
      } catch (error) {
        console.error("Failed to load club profile data", error);
      } finally {
        setLoading(false);
      }
    };

    void loadClubProfileData();
  }, [clubId]);

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

    try {
      const response = await axios.get(
        `${API_BASE_URL}/club/${clubId}/activity/${activity.id}/slots`,
        { headers: getAuthHeaders() },
      );
      const payload = response.data;
      const slots = Array.isArray(payload?.data) ? payload.data : [];
      setActivitySlots(slots);
    } catch (error) {
      console.error("Failed to load slots", error);
      setActivitySlots([]);
      setBookingMessage("Failed to load slot availability.");
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
      const response = await axios.post(
        `${API_BASE_URL}/club/${clubId}/activity/${selectedActivity.id}/slot/${slot.id}/book`,
        {},
        {
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
          },
        },
      );
      const payload = response.data;
      if (response.status >= 200 && response.status < 300 && payload?.success) {
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
      <Navbar navigate={navigate} currentPage="club-profile" />

      <div style={{ position: "relative", height: 380, overflow: "hidden" }}>
        <img
          src={IMGS.hero}
          alt="Club"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 100%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "0 24px 32px",
            maxWidth: 1280,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 20,
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-end", gap: 20 }}>
              <div
                style={{
                  width: 88,
                  height: 88,
                  borderRadius: 20,
                  background: "linear-gradient(135deg, #0F62FE, #0043CE)",
                  border: "4px solid white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                  flexShrink: 0,
                }}
              >
                <Zap size={36} color="white" fill="white" />
              </div>
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 6,
                  }}
                >
                  <h1
                    style={{
                      fontSize: 28,
                      fontWeight: 900,
                      color: "white",
                      margin: 0,
                      letterSpacing: "-0.5px",
                    }}
                  >
                    {clubName}
                  </h1>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      background: "#22C55E",
                      borderRadius: 100,
                      padding: "3px 10px",
                    }}
                  >
                    <CheckCircle size={12} color="white" fill="white" />
                    <span
                      style={{ fontSize: 11, color: "white", fontWeight: 700 }}
                    >
                      Verified
                    </span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 5 }}
                  >
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill="#F59E0B" color="#F59E0B" />
                    ))}
                    <span
                      style={{ fontSize: 14, fontWeight: 700, color: "white" }}
                    >
                      4.9
                    </span>
                    <span
                      style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}
                    >
                      (648 reviews)
                    </span>
                  </div>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <MapPin size={14} color="rgba(255,255,255,0.8)" />
                    <span
                      style={{ fontSize: 13, color: "rgba(255,255,255,0.8)" }}
                    >
                      123 Sports Ave, San Francisco, CA
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {}
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setFollowed(!followed)}
                style={{
                  padding: "10px 20px",
                  borderRadius: 12,
                  background: followed ? "#22C55E" : "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(10px)",
                  color: "white",
                  fontSize: 14,
                  fontWeight: 600,
                  border: `1.5px solid ${followed ? "transparent" : "rgba(255,255,255,0.3)"}`,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  transition: "all 0.2s",
                }}
              >
                <Heart size={15} fill={followed ? "white" : "none"} />{" "}
                {followed ? "Following" : "Follow"}
              </button>
              <button
                style={{
                  padding: "10px 20px",
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(10px)",
                  color: "white",
                  fontSize: 14,
                  fontWeight: 600,
                  border: "1.5px solid rgba(255,255,255,0.3)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                }}
              >
                <Share2 size={15} /> Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {}
      <div
        style={{
          background: "white",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          position: "sticky",
          top: 68,
          zIndex: 30,
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 24px",
            display: "flex",
            overflowX: "auto",
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "16px 20px",
                fontSize: 14,
                fontWeight: activeTab === tab ? 700 : 500,
                color: activeTab === tab ? "#0F62FE" : "#6B7280",
                border: "none",
                background: "none",
                cursor: "pointer",
                borderBottom:
                  activeTab === tab
                    ? "2.5px solid #0F62FE"
                    : "2.5px solid transparent",
                whiteSpace: "nowrap",
                transition: "all 0.2s",
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "36px 24px" }}>
        {activeTab === "Overview" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 340px",
              gap: 28,
            }}
            className="grid-cols-1 xl:grid-cols-3"
          >
            <div>
              <div
                style={{
                  background: "white",
                  borderRadius: 18,
                  padding: "28px",
                  marginBottom: 24,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                }}
              >
                <h2
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: "#111827",
                    margin: "0 0 16px",
                  }}
                >
                  About the Club
                </h2>
                {(() => {
                  const rawDescription =
                    clubInfo?.description || clubInfo?.decription || "";
                  const descriptionLines = rawDescription
                    ? rawDescription
                        .split(/\r?\n/)
                        .map((line: string) => line.trim())
                        .filter(Boolean)
                    : [
                        "Arena Sports Club is San Francisco's premier multi-sport facility, offering world-class amenities across 15,000 sq ft of indoor and outdoor space. Founded in 2012, we've grown to serve over 3,000 active members across all fitness levels and sports disciplines.",
                        "Our professional coaching staff, state-of-the-art equipment, and welcoming community make us the top choice for athletes, fitness enthusiasts, and families looking for a comprehensive sports experience.",
                      ];

                  return descriptionLines.map((line: string, index: number) => (
                    <p
                      key={index}
                      style={{
                        fontSize: 14,
                        color: "#374151",
                        lineHeight: 1.8,
                        margin: index === 0 ? 0 : "12px 0 0",
                      }}
                    >
                      {line}
                    </p>
                  ));
                })()}
              </div>

              <div
                style={{
                  background: "white",
                  borderRadius: 18,
                  padding: "28px",
                  marginBottom: 24,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                }}
              >
                <h2
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: "#111827",
                    margin: "0 0 20px",
                  }}
                >
                  Facilities
                </h2>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(160px, 1fr))",
                    gap: 12,
                  }}
                >
                  {normalizeClubFacilities(clubInfo?.facilities).map((f) => (
                    <div
                      key={f.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "12px 14px",
                        borderRadius: 12,
                        background: "#F9FAFB",
                        border: "1px solid #F3F4F6",
                      }}
                    >
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          background: "#EFF4FF",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <f.icon size={15} color="#0F62FE" />
                      </div>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 500,
                          color: "#374151",
                        }}
                      >
                        {f.label}
                      </span>
                      <Check
                        size={13}
                        color="#22C55E"
                        strokeWidth={3}
                        style={{ marginLeft: "auto" }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {}
              <div
                style={{
                  background: "white",
                  borderRadius: 18,
                  padding: "28px",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                }}
              >
                <h2
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: "#111827",
                    margin: "0 0 16px",
                  }}
                >
                  Location
                </h2>
                <div
                  style={{
                    height: 220,
                    borderRadius: 14,
                    background: "linear-gradient(135deg, #EFF4FF, #DBEAFE)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1.5px solid #BFDBFE",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{ position: "absolute", inset: 0, opacity: 0.05 }}
                  >
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={i}
                        style={{
                          position: "absolute",
                          left: `$$$$${i * 9}%`,
                          top: 0,
                          bottom: 0,
                          width: 1,
                          background: "#0F62FE",
                        }}
                      />
                    ))}
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        style={{
                          position: "absolute",
                          top: `$$$$${i * 14}%`,
                          left: 0,
                          right: 0,
                          height: 1,
                          background: "#0F62FE",
                        }}
                      />
                    ))}
                  </div>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      background: "#0F62FE",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 0 0 10px rgba(15,98,254,0.15)",
                      marginBottom: 12,
                    }}
                  >
                    <MapPin size={22} color="white" fill="white" />
                  </div>
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#0F62FE",
                      margin: 0,
                    }}
                  >
                    {clubName}
                  </p>
                  <p
                    style={{
                      fontSize: 12,
                      color: "#6B7280",
                      margin: "4px 0 0",
                    }}
                  >
                    123 Sports Ave, San Francisco, CA 94102
                  </p>
                  <button
                    style={{
                      marginTop: 14,
                      padding: "8px 20px",
                      borderRadius: 10,
                      background: "#0F62FE",
                      color: "white",
                      fontSize: 13,
                      fontWeight: 600,
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Get Directions
                  </button>
                </div>
              </div>
            </div>

            {}
            <div>
              {}
              <div
                style={{
                  background: "white",
                  borderRadius: 18,
                  padding: "24px",
                  marginBottom: 20,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                }}
              >
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#111827",
                    margin: "0 0 16px",
                  }}
                >
                  Quick Info
                </h3>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 14 }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: "#EFF4FF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Clock size={16} color="#0F62FE" />
                    </div>
                    <div>
                      <p style={{ fontSize: 11, color: "#9CA3AF", margin: 0 }}>
                        Working Hours
                      </p>
                      <p
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#111827",
                          margin: 0,
                        }}
                      >
                        6:00 AM â€“ 11:00 PM Daily
                      </p>
                    </div>
                  </div>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: "#EFF4FF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Users size={16} color="#0F62FE" />
                    </div>
                    <div>
                      <p style={{ fontSize: 11, color: "#9CA3AF", margin: 0 }}>
                        Active Members
                      </p>
                      <p
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#111827",
                          margin: 0,
                        }}
                      >
                        3,200+ members
                      </p>
                    </div>
                  </div>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: "#EFF4FF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Phone size={16} color="#0F62FE" />
                    </div>
                    <div>
                      <p style={{ fontSize: 11, color: "#9CA3AF", margin: 0 }}>
                        Contact
                      </p>
                      <p
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#111827",
                          margin: 0,
                        }}
                      >
                        +1 (415) 555-0190
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  style={{
                    width: "100%",
                    marginTop: 20,
                    padding: "12px",
                    borderRadius: 12,
                    background: "linear-gradient(135deg, #0F62FE, #0043CE)",
                    color: "white",
                    fontSize: 14,
                    fontWeight: 700,
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(15,98,254,0.3)",
                  }}
                >
                  Book a Session
                </button>
              </div>

              <div
                style={{
                  background: "white",
                  borderRadius: 18,
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
                    Top Coaches
                  </h3>
                  <button
                    onClick={() => setActiveTab("Coaches")}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#0F62FE",
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    See all <ChevronRight size={13} />
                  </button>
                </div>
                {(loading ? [] : coachesData).slice(0, 3).map((c) => (
                  <div
                    key={c.name}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      marginBottom: 12,
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: c.gradient,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 13,
                        fontWeight: 700,
                        color: "white",
                        flexShrink: 0,
                      }}
                    >
                      {c.avatar}
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
                        {c.name}
                      </p>
                      <p style={{ fontSize: 11, color: "#9CA3AF", margin: 0 }}>
                        {c.sport}
                      </p>
                    </div>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 3 }}
                    >
                      <Star size={11} fill="#F59E0B" color="#F59E0B" />
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: "#111827",
                        }}
                      >
                        {Number(c.rating).toFixed(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "Activities" && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <h2
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: "#111827",
                  margin: 0,
                }}
              >
                Available Activities
              </h2>
              <span style={{ fontSize: 13, color: "#6B7280" }}>
                {(loading ? [] : activitiesData).length} activities found
              </span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 20,
              }}
            >
              {(loading ? [] : activitiesData).length === 0 ? (
                <div
                  style={{
                    gridColumn: "1 / -1",
                    background: "white",
                    borderRadius: 18,
                    padding: "24px",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                    color: "#6B7280",
                  }}
                >
                  No activities available yet.
                </div>
              ) : (
                (loading ? [] : activitiesData).map((act) => (
                  <div
                    key={act.name}
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
                      (e.currentTarget as HTMLDivElement).style.transform =
                        "none";
                    }}
                  >
                    <div style={{ position: "relative", height: 160 }}>
                      <img
                        src={act.image}
                        alt={act.name}
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
                            "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)",
                        }}
                      />
                      {act.tag && (
                        <span
                          style={{
                            position: "absolute",
                            top: 12,
                            left: 12,
                            padding: "3px 10px",
                            borderRadius: 100,
                            background:
                              act.tag === "Popular"
                                ? "#0F62FE"
                                : act.tag === "Top Rated"
                                  ? "#F59E0B"
                                  : "#22C55E",
                            color: "white",
                            fontSize: 11,
                            fontWeight: 700,
                          }}
                        >
                          {act.tag}
                        </span>
                      )}
                    </div>
                    <div style={{ padding: 18 }}>
                      <h3
                        style={{
                          fontSize: 15,
                          fontWeight: 700,
                          color: "#111827",
                          margin: "0 0 4px",
                        }}
                      >
                        {act.name}
                      </h3>
                      <p
                        style={{
                          fontSize: 12,
                          color: "#6B7280",
                          margin: "0 0 10px",
                        }}
                      >
                        Coach: {act.coach}
                      </p>
                      <div
                        style={{ display: "flex", gap: 8, marginBottom: 14 }}
                      >
                        <span
                          style={{
                            padding: "3px 10px",
                            borderRadius: 100,
                            background: "#EFF4FF",
                            color: "#0F62FE",
                            fontSize: 11,
                            fontWeight: 500,
                          }}
                        >
                          {act.duration}
                        </span>
                      </div>
                      {Array.isArray(act.slotDetails) &&
                      act.slotDetails.length > 0 ? (
                        <div
                          style={{
                            marginBottom: 14,
                            padding: "10px 12px",
                            borderRadius: 14,
                            background: "#F8FAFC",
                          }}
                        >
                          <p
                            style={{
                              margin: 0,
                              fontSize: 11,
                              color: "#6B7280",
                            }}
                          >
                            Next slot:
                          </p>
                          <p
                            style={{
                              margin: "4px 0 0",
                              fontSize: 13,
                              fontWeight: 700,
                              color: "#111827",
                            }}
                          >
                            {act.slotDetails[0].start_time} -
                            {act.slotDetails[0].end_time}
                          </p>
                        </div>
                      ) : null}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span
                          style={{
                            fontSize: 18,
                            fontWeight: 800,
                            color: "#0F62FE",
                          }}
                        >
                          ${act.price}
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 400,
                              color: "#9CA3AF",
                            }}
                          >
                            /session
                          </span>
                        </span>
                        <button
                          onClick={() => void openSlotModal(act)}
                          style={{
                            padding: "8px 18px",
                            borderRadius: 10,
                            background:
                              "linear-gradient(135deg, #0F62FE, #0043CE)",
                            color: "white",
                            fontSize: 13,
                            fontWeight: 600,
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          Book
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

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
                          style={{
                            fontSize: 12,
                            color: "#6B7280",
                            marginTop: 3,
                          }}
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
        {activeTab === "Memberships" && (
          <div style={{ maxWidth: 940, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <h2
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: "#111827",
                  margin: 0,
                }}
              >
                Membership Plans
              </h2>
              <p style={{ fontSize: 15, color: "#6B7280", marginTop: 8 }}>
                Flexible plans for every athlete
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
              {(loading ? [] : plansData).length === 0 ? (
                <div
                  style={{
                    gridColumn: "1 / -1",
                    background: "white",
                    borderRadius: 18,
                    padding: "24px",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                    color: "#6B7280",
                    textAlign: "center",
                  }}
                >
                  No membership plans available yet.
                </div>
              ) : (
                (loading ? [] : plansData).map((plan) => (
                  <div
                    key={plan.name}
                    style={{
                      background: plan.popular
                        ? "linear-gradient(135deg, #0F62FE, #0043CE)"
                        : "white",
                      borderRadius: 20,
                      padding: "28px",
                      boxShadow: plan.popular
                        ? "0 20px 60px rgba(15,98,254,0.25)"
                        : "0 4px 20px rgba(0,0,0,0.07)",
                      position: "relative",
                      transform: plan.popular ? "scale(1.04)" : "none",
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
                          padding: "5px 14px",
                          borderRadius: 100,
                          whiteSpace: "nowrap",
                        }}
                      >
                        â­ Most Popular
                      </span>
                    )}
                    <h3
                      style={{
                        fontSize: 20,
                        fontWeight: 800,
                        color: plan.popular ? "white" : "#111827",
                        margin: "0 0 8px",
                      }}
                    >
                      {plan.name}
                    </h3>
                    <div style={{ marginBottom: 20 }}>
                      <span
                        style={{
                          fontSize: 36,
                          fontWeight: 900,
                          color: plan.popular
                            ? "white"
                            : plan.name === "Elite"
                              ? "#F59E0B"
                              : "#0F62FE",
                        }}
                      >
                        ${plan.price}
                      </span>
                      <span
                        style={{
                          fontSize: 14,
                          color: plan.popular
                            ? "rgba(255,255,255,0.6)"
                            : "#9CA3AF",
                        }}
                      >
                        /{plan.period}
                      </span>
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
                        <div key={f} style={{ display: "flex", gap: 10 }}>
                          <div
                            style={{
                              width: 18,
                              height: 18,
                              borderRadius: "50%",
                              background: plan.popular
                                ? "rgba(255,255,255,0.2)"
                                : "#EFF4FF",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                              marginTop: 1,
                            }}
                          >
                            <Check
                              size={10}
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
                          ? "rgba(255,255,255,0.15)"
                          : plan.name === "Elite"
                            ? "linear-gradient(135deg, #F59E0B, #D97706)"
                            : "linear-gradient(135deg, #0F62FE, #0043CE)",
                        color: "white",
                        fontSize: 14,
                        fontWeight: 700,
                        border: plan.popular
                          ? "1.5px solid rgba(255,255,255,0.4)"
                          : "none",
                        cursor: "pointer",
                        backdropFilter: "blur(10px)",
                      }}
                    >
                      Get Started
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {}
        {activeTab === "Coaches" && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 28,
              }}
            >
              <h2
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: "#111827",
                  margin: 0,
                }}
              >
                Our Coaches
              </h2>
              <span style={{ fontSize: 13, color: "#6B7280" }}>
                6 certified coaches
              </span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 20,
              }}
            >
              {(loading ? [] : coachesData).length === 0 ? (
                <div
                  style={{
                    gridColumn: "1 / -1",
                    background: "white",
                    borderRadius: 18,
                    padding: "24px",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                    color: "#6B7280",
                    textAlign: "center",
                  }}
                >
                  No coaches available yet.
                </div>
              ) : (
                (loading ? [] : coachesData).map((c) => (
                  <div
                    key={c.name}
                    style={{
                      background: "white",
                      borderRadius: 20,
                      padding: "24px",
                      boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                      transition: "all 0.3s",
                      textAlign: "center",
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
                      (e.currentTarget as HTMLDivElement).style.transform =
                        "none";
                    }}
                  >
                    <div
                      style={{
                        width: 76,
                        height: 76,
                        borderRadius: "50%",
                        background: c.gradient,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 22,
                        fontWeight: 800,
                        color: "white",
                        margin: "0 auto 14px",
                        boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
                      }}
                    >
                      {c.avatar}
                    </div>
                    <h3
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: "#111827",
                        margin: "0 0 3px",
                      }}
                    >
                      {c.name}
                    </h3>
                    <p
                      style={{
                        fontSize: 13,
                        color: "#0F62FE",
                        fontWeight: 600,
                        margin: "0 0 6px",
                      }}
                    >
                      {c.sport}
                    </p>
                    <p
                      style={{
                        fontSize: 12,
                        color: "#6B7280",
                        margin: "0 0 12px",
                      }}
                    >
                      {c.bio}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: 16,
                        marginBottom: 16,
                      }}
                    >
                      <div style={{ textAlign: "center" }}>
                        <p
                          style={{
                            fontSize: 15,
                            fontWeight: 800,
                            color: "#111827",
                            margin: 0,
                          }}
                        >
                          {c.exp}
                        </p>
                        <p
                          style={{ fontSize: 10, color: "#9CA3AF", margin: 0 }}
                        >
                          Experience
                        </p>
                      </div>
                      <div style={{ width: 1, background: "#E5E7EB" }} />
                      <div style={{ textAlign: "center" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 3,
                            justifyContent: "center",
                          }}
                        >
                          <Star size={12} fill="#F59E0B" color="#F59E0B" />
                          <span
                            style={{
                              fontSize: 15,
                              fontWeight: 800,
                              color: "#111827",
                            }}
                          >
                            {Number(c.rating).toFixed(1)}
                          </span>
                        </div>
                        <p
                          style={{ fontSize: 10, color: "#9CA3AF", margin: 0 }}
                        >
                          {c.reviews} reviews
                        </p>
                      </div>
                    </div>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "4px 12px",
                        borderRadius: 100,
                        background: "#EFF4FF",
                        color: "#0F62FE",
                        fontSize: 12,
                        fontWeight: 500,
                        marginBottom: 14,
                      }}
                    >
                      {c.specialty}
                    </span>
                    <button
                      style={{
                        width: "100%",
                        padding: "9px",
                        borderRadius: 10,
                        background: "linear-gradient(135deg, #0F62FE, #0043CE)",
                        color: "white",
                        fontSize: 13,
                        fontWeight: 600,
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Book Session
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {}
        {activeTab === "Gallery" && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <h2
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: "#111827",
                  margin: 0,
                }}
              >
                Photo Gallery
              </h2>
              <span style={{ fontSize: 13, color: "#6B7280" }}>
                {galleryImages.length} photos
              </span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                gap: 16,
              }}
            >
              {galleryImages.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setLightboxImg(img)}
                  style={{
                    position: "relative",
                    aspectRatio: "4/3",
                    borderRadius: 14,
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "all 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform =
                      "scale(1.02)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow =
                      "0 12px 36px rgba(0,0,0,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform =
                      "none";
                    (e.currentTarget as HTMLDivElement).style.boxShadow =
                      "none";
                  }}
                >
                  <img
                    src={img}
                    alt={`Gallery ${i + 1}`}
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
                      background: "rgba(0,0,0,0)",
                      transition: "background 0.3s",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "rgba(0,0,0,0.3)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "rgba(0,0,0,0)")
                    }
                  >
                    <Camera
                      size={24}
                      color="white"
                      style={{ opacity: 0, transition: "opacity 0.3s" }}
                    />
                  </div>
                </div>
              ))}
            </div>
            {lightboxImg && (
              <div
                style={{
                  position: "fixed",
                  inset: 0,
                  background: "rgba(0,0,0,0.9)",
                  zIndex: 100,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 20,
                }}
                onClick={() => setLightboxImg(null)}
              >
                <img
                  src={lightboxImg}
                  alt="Gallery"
                  style={{
                    maxWidth: "90vw",
                    maxHeight: "90vh",
                    borderRadius: 16,
                    objectFit: "contain",
                  }}
                />
                <button
                  onClick={() => setLightboxImg(null)}
                  style={{
                    position: "absolute",
                    top: 20,
                    right: 20,
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.1)",
                    border: "none",
                    color: "white",
                    cursor: "pointer",
                    fontSize: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  âœ•
                </button>
              </div>
            )}
          </div>
        )}

        {}
        {activeTab === "Reviews" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 360px",
              gap: 28,
            }}
            className="grid-cols-1 xl:grid-cols-3"
          >
            <div>
              <h2
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: "#111827",
                  margin: "0 0 24px",
                }}
              >
                Member Reviews
              </h2>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 20 }}
              >
                {reviews.map((r) => (
                  <div
                    key={r.name}
                    style={{
                      background: "white",
                      borderRadius: 18,
                      padding: "24px",
                      boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                      position: "relative",
                    }}
                  >
                    <Quote
                      size={24}
                      color="#EFF4FF"
                      fill="#EFF4FF"
                      style={{ position: "absolute", top: 16, right: 16 }}
                    />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: 12,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                        }}
                      >
                        <div
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: "50%",
                            background: r.gradient,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 14,
                            fontWeight: 700,
                            color: "white",
                          }}
                        >
                          {r.avatar}
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
                            {r.name}
                          </p>
                          <p
                            style={{
                              fontSize: 11,
                              color: "#9CA3AF",
                              margin: 0,
                            }}
                          >
                            {r.date}
                          </p>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 2 }}>
                        {[...Array(r.rating)].map((_, i) => (
                          <Star
                            key={i}
                            size={13}
                            fill="#F59E0B"
                            color="#F59E0B"
                          />
                        ))}
                      </div>
                    </div>
                    <p
                      style={{
                        fontSize: 14,
                        color: "#374151",
                        lineHeight: 1.75,
                        margin: 0,
                      }}
                    >
                      "{r.text}"
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {}
            <div>
              <div
                style={{
                  background: "white",
                  borderRadius: 18,
                  padding: "24px",
                  marginBottom: 20,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                }}
              >
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#111827",
                    margin: "0 0 20px",
                  }}
                >
                  Overall Rating
                </h3>
                <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
                  <div style={{ textAlign: "center" }}>
                    <p
                      style={{
                        fontSize: 52,
                        fontWeight: 900,
                        color: "#111827",
                        margin: 0,
                        lineHeight: 1,
                      }}
                    >
                      4.9
                    </p>
                    <div
                      style={{
                        display: "flex",
                        gap: 3,
                        justifyContent: "center",
                        margin: "6px 0 4px",
                      }}
                    >
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          fill="#F59E0B"
                          color="#F59E0B"
                        />
                      ))}
                    </div>
                    <p style={{ fontSize: 12, color: "#6B7280", margin: 0 }}>
                      648 reviews
                    </p>
                  </div>
                  <div style={{ flex: 1 }}>
                    {ratingBreakdown.map((r) => (
                      <div
                        key={r.rating}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          marginBottom: 6,
                        }}
                      >
                        <span
                          style={{ fontSize: 12, color: "#6B7280", width: 8 }}
                        >
                          {r.rating}
                        </span>
                        <Star size={11} fill="#F59E0B" color="#F59E0B" />
                        <div
                          style={{
                            flex: 1,
                            height: 6,
                            background: "#F3F4F6",
                            borderRadius: 100,
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              borderRadius: 100,
                              background: "#F59E0B",
                              width: `${r.pct}%`,
                            }}
                          />
                        </div>
                        <span
                          style={{ fontSize: 11, color: "#9CA3AF", width: 24 }}
                        >
                          {r.pct}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {}
              <div
                style={{
                  background: "white",
                  borderRadius: 18,
                  padding: "24px",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                }}
              >
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#111827",
                    margin: "0 0 16px",
                  }}
                >
                  Write a Review
                </h3>
                <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setReviewRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                      }}
                    >
                      <Star
                        size={28}
                        fill={
                          (hoverRating || reviewRating) >= star
                            ? "#F59E0B"
                            : "#E5E7EB"
                        }
                        color={
                          (hoverRating || reviewRating) >= star
                            ? "#F59E0B"
                            : "#E5E7EB"
                        }
                      />
                    </button>
                  ))}
                </div>
                <textarea
                  placeholder="Share your experience..."
                  style={{
                    width: "100%",
                    height: 100,
                    border: "1.5px solid #E5E7EB",
                    borderRadius: 12,
                    padding: "12px",
                    fontSize: 13,
                    color: "#374151",
                    outline: "none",
                    resize: "none",
                    boxSizing: "border-box",
                    fontFamily: "inherit",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#0F62FE")}
                  onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                />
                <button
                  style={{
                    width: "100%",
                    marginTop: 12,
                    padding: "11px",
                    borderRadius: 12,
                    background: "linear-gradient(135deg, #0F62FE, #0043CE)",
                    color: "white",
                    fontSize: 14,
                    fontWeight: 700,
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(15,98,254,0.3)",
                  }}
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        )}

        {}
        {activeTab === "Events" && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 16,
                margin: "0 0 24px",
                flexWrap: "wrap",
              }}
            >
              <h2
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: "#111827",
                  margin: 0,
                }}
              >
                Club Events
              </h2>
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
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: 20,
              }}
            >
              {(loading ? [] : eventsData).length === 0 ? (
                <div
                  style={{
                    gridColumn: "1 / -1",
                    background: "white",
                    borderRadius: 18,
                    padding: "24px",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                    color: "#6B7280",
                    textAlign: "center",
                  }}
                >
                  No events available yet.
                </div>
              ) : (
                (loading ? [] : eventsData).map((ev) => (
                  <div
                    key={ev.title}
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
                      (e.currentTarget as HTMLDivElement).style.transform =
                        "none";
                    }}
                  >
                    <div style={{ position: "relative", height: 160 }}>
                      <img
                        src={ev.banner}
                        alt={ev.title}
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
                            "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)",
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
                        {ev.sport}
                      </span>
                    </div>
                    <div style={{ padding: 18 }}>
                      <h3
                        style={{
                          fontSize: 15,
                          fontWeight: 700,
                          color: "#111827",
                          margin: "0 0 10px",
                        }}
                      >
                        {ev.title}
                      </h3>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                          }}
                        >
                          <Calendar size={13} color="#6B7280" />
                          <span style={{ fontSize: 13, color: "#6B7280" }}>
                            {ev.date}
                          </span>
                        </div>
                        <span
                          style={{
                            fontSize: 16,
                            fontWeight: 800,
                            color: "#0F62FE",
                          }}
                        >
                          ${ev.price}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 6,
                          marginBottom: 16,
                          marginTop: 12,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <MapPin size={13} color="#6B7280" />
                          <span style={{ fontSize: 13, color: "#6B7280" }}>
                            {ev.club || "SportifyHub Club"}
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <Users size={13} color="#6B7280" />
                          <span style={{ fontSize: 13, color: "#6B7280" }}>
                            {ev.currentCapacity} seats of {ev.maxSeats}
                          </span>
                        </div>
                      </div>
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
                            background: ev.seats < 10 ? "#EF4444" : "#22C55E",
                            width: `${ev.maxSeats > 0 ? (ev.currentCapacity / ev.maxSeats) * 100 : 0}%`,
                            transition: "width 0.5s",
                          }}
                        />
                      </div>
                      <button
                        onClick={() =>
                          void (joinedEventIds.includes(ev.id)
                            ? handleUnjoinEvent(ev)
                            : handleJoinEvent(ev))
                        }
                        disabled={
                          joiningEventId === ev.id || unjoiningEventId === ev.id
                        }
                        style={{
                          width: "100%",
                          marginTop: 14,
                          padding: "10px",
                          borderRadius: 10,
                          background:
                            joiningEventId === ev.id ||
                            joinedEventIds.includes(ev.id)
                              ? "#E5E7EB"
                              : "linear-gradient(135deg, #22C55E, #16A34A)",
                          color:
                            joiningEventId === ev.id ||
                            joinedEventIds.includes(ev.id)
                              ? "#4B5563"
                              : "white",
                          fontSize: 13,
                          fontWeight: 600,
                          border:
                            joiningEventId === ev.id ||
                            joinedEventIds.includes(ev.id)
                              ? "1px solid #D1D5DB"
                              : "none",
                          cursor:
                            joiningEventId === ev.id ||
                            unjoiningEventId === ev.id
                              ? "not-allowed"
                              : "pointer",
                          boxShadow:
                            joiningEventId === ev.id ||
                            joinedEventIds.includes(ev.id)
                              ? "none"
                              : "0 4px 12px rgba(34,197,94,0.3)",
                        }}
                      >
                        {joinedEventIds.includes(ev.id) ? (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 6,
                            }}
                          >
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: 16,
                                height: 16,
                                borderRadius: "50%",
                                background: "#16A34A",
                                color: "white",
                              }}
                            >
                              <Check size={10} />
                            </span>
                            Joined Event
                          </span>
                        ) : joiningEventId === ev.id ? (
                          "Joining..."
                        ) : (
                          "Join Event"
                        )}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <Footer navigate={navigate} />
    </div>
  );
}
