import { useEffect, useState } from "react";
import axios from "axios";
import {
  Plus,
  Star,
  Edit,
  Trash2,
  Phone,
  Mail,
  Check,
  X,
  Award,
  Clock,
} from "lucide-react";
import { DashboardLayout } from "./DashboardLayout";
import { Page } from "./Navbar";
import { useClubId } from "../utils/club";

interface Coach {
  id: number;
  name: string;
  avatar: string;
  gradient: string;
  sport: string;
  experience: string;
  rating: number;
  reviews: number;
  phone: string;
  email: string;
  bio: string;
  specialty: string;
  certifications: string[];
  schedule: string[];
  status: "active" | "inactive";
  sessionsThisMonth: number;
  totalEarnings: number;
}

const ALL_SPORTS = [
  "Football",
  "Swimming",
  "Tennis",
  "Yoga",
  "Gym",
  "Karate",
  "Basketball",
  "Volleyball",
  "Boxing",
];

export function CoachesPage({ navigate }: { navigate: (page: Page) => void }) {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [search, setSearch] = useState("");
  const [sportF, setSportF] = useState("All");
  const [detail, setDetail] = useState<Coach | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [editCoach, setEditCoach] = useState<Coach | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [flash, setFlash] = useState("");

  const [fName, setFName] = useState("");
  const [fSport, setFSport] = useState("Football");
  const [fExp, setFExp] = useState("");
  const [fEmail, setFEmail] = useState("");
  const [fPhone, setFPhone] = useState("");
  const [fBio, setFBio] = useState("");
  const [fSpecialty, setFSpecialty] = useState("");

  const clubId = useClubId();
  const API_BASE_URL =
    (import.meta as any)?.env?.VITE_API_URL || "http://localhost:4000";

  const gradients = [
    "linear-gradient(135deg,#EF4444,#F97316)",
    "linear-gradient(135deg,#06B6D4,#0F62FE)",
    "linear-gradient(135deg,#22C55E,#0F62FE)",
    "linear-gradient(135deg,#8B5CF6,#EC4899)",
    "linear-gradient(135deg,#F59E0B,#EF4444)",
    "linear-gradient(135deg,#374151,#0D1B2A)",
  ];

  const toast = (m: string) => {
    setFlash(m);
    setTimeout(() => setFlash(""), 2500);
  };

  const buildAvatar = (name: string) =>
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const parseExperience = (value: string) => {
    const match = value.match(/\d+/);
    return match ? Number(match[0]) : 0;
  };

  const mapCoachFromApi = (coach: any, index: number): Coach => ({
    id: coach.id,
    name: coach.fullName ?? coach.name ?? "",
    avatar: buildAvatar(coach.fullName ?? coach.name ?? "Coach"),
    gradient: gradients[index % gradients.length],
    sport: coach.sport ?? "",
    experience: String(coach.experience ?? ""),
    rating: coach.rating ?? 0,
    reviews: coach.reviews ?? 0,
    phone: coach.phone ?? "",
    email: coach.email ?? "",
    bio: coach.bio ?? "",
    specialty: coach.spechiality ?? coach.specialty ?? "",
    certifications: coach.certifications ?? [],
    schedule: coach.schedule ?? [],
    status: coach.status ?? "active",
    sessionsThisMonth: coach.sessionsThisMonth ?? 0,
    totalEarnings: coach.totalEarnings ?? 0,
  });

  const fetchCoaches = async () => {
    try {
      const res = await axios
        .get(`${API_BASE_URL}/club/${clubId}/coach`)
        .catch(() => null);
      const result = res?.data ?? null;

      if (!res || result?.success === false) {
        throw new Error(result?.message || "Failed to fetch coaches");
      }

      const coachesList = Array.isArray(result)
        ? result
        : Array.isArray(result?.data)
          ? result.data
          : [];
      setCoaches(
        coachesList.map((coach: any, index: number) =>
          mapCoachFromApi(coach, index),
        ),
      );
    } catch (error) {
      console.error("Failed to fetch coaches:", error);
      toast("Failed to load coaches.");
    }
  };

  useEffect(() => {
    fetchCoaches();
  }, [clubId]);

  const resetForm = () => {
    setFName("");
    setFSport("Football");
    setFExp("");
    setFEmail("");
    setFPhone("");
    setFBio("");
    setFSpecialty("");
  };

  const openAdd = () => {
    resetForm();
    setEditCoach(null);
    setShowAdd(true);
  };

  const openEdit = (c: Coach) => {
    setFName(c.name);
    setFSport(c.sport);
    setFExp(c.experience);
    setFEmail(c.email);
    setFPhone(c.phone);
    setFBio(c.bio);
    setFSpecialty(c.specialty);
    setEditCoach(c);
    setDetail(null);
    setShowAdd(true);
  };

  const saveCoach = async () => {
    if (!fName || !fEmail) return;

    const payload = {
      fullName: fName,
      sport: fSport,
      experience: parseExperience(fExp),
      email: fEmail,
      phone: fPhone,
      bio: fBio,
      spechiality: fSpecialty,
    };

    try {
      if (editCoach) {
        const res = await axios.put(
          `${API_BASE_URL}/club/${clubId}/coach/${editCoach.id}`,
          payload,
          { headers: { "Content-Type": "application/json" } },
        );
        const result = res.data;
        if (
          res.status < 200 ||
          res.status >= 300 ||
          result?.success === false
        ) {
          throw new Error(result?.message || "Failed to update coach");
        }
        toast("Coach updated.");
      } else {
        const res = await axios.post(
          `${API_BASE_URL}/club/${clubId}/coach`,
          payload,
          { headers: { "Content-Type": "application/json" } },
        );
        const result = res.data;
        if (
          res.status < 200 ||
          res.status >= 300 ||
          result?.success === false
        ) {
          throw new Error(result?.message || "Failed to add coach");
        }
        toast("Coach added.");
      }

      await fetchCoaches();
      setShowAdd(false);
      setEditCoach(null);
      resetForm();
    } catch (error) {
      console.error("Save coach failed:", error);
      toast("Something went wrong while saving coach.");
    }
  };

  const toggleStatus = async (id: number) => {
    const coach = coaches.find((c) => c.id === id);
    if (!coach) return;

    try {
      const res = await axios.put(
        `${API_BASE_URL}/club/${clubId}/coach/${id}`,
        { status: coach.status === "active" ? "inactive" : "active" },
        { headers: { "Content-Type": "application/json" } },
      );
      const result = res.data;
      if (res.status < 200 || res.status >= 300 || result?.success === false) {
        throw new Error(result?.message || "Failed to update status");
      }
      await fetchCoaches();
      toast("Status updated.");
    } catch (error) {
      console.error("Status update failed:", error);
      toast("Failed to update status.");
    }
  };

  const deleteCoach = async () => {
    if (!deleteId) return;

    try {
      const res = await axios.delete(
        `${API_BASE_URL}/club/${clubId}/coach/${deleteId}`,
      );
      const result = res.data;
      if (res.status < 200 || res.status >= 300 || result?.success === false) {
        throw new Error(result?.message || "Failed to delete coach");
      }
      await fetchCoaches();
      setDeleteId(null);
      setDetail(null);
      toast("Coach removed.");
    } catch (error) {
      console.error("Delete coach failed:", error);
      toast("Failed to remove coach.");
    }
  };

  const displayed = coaches.filter((c) => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()))
      return false;
    if (sportF !== "All" && c.sport !== sportF) return false;
    return true;
  });

  return (
    <DashboardLayout navigate={navigate} currentPage="coaches">
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
            Coaches
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "#6B7280",
              marginTop: 4,
            }}
          >
            {coaches.filter((c) => c.status === "active").length} active coaches
            across {new Set(coaches.map((c) => c.sport)).size} sports
          </p>
        </div>
        <button
          onClick={openAdd}
          style={{
            padding: "9px 20px",
            borderRadius: 10,
            background: "linear-gradient(135deg,#0F62FE,#0043CE)",
            color: "white",
            fontSize: 13,
            fontWeight: 700,
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 7,
            boxShadow: "0 4px 14px rgba(15,98,254,0.3)",
          }}
        >
          <Plus size={15} /> Add Coach
        </button>
      </div>

      <div
        style={{
          background: "white",
          borderRadius: 12,
          padding: "13px 16px",
          marginBottom: 20,
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <div style={{ position: "relative", flex: "1 1 200px" }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search coaches…"
            style={{
              paddingLeft: 12,
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

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {[
            "All",
            "Football",
            "Swimming",
            "Tennis",
            "Yoga",
            "Gym",
            "Karate",
          ].map((s) => (
            <button
              key={s}
              onClick={() => setSportF(s)}
              style={{
                padding: "5px 12px",
                borderRadius: 100,
                border: sportF === s ? "none" : "1.5px solid #E5E7EB",
                background: sportF === s ? "#0F62FE" : "white",
                color: sportF === s ? "white" : "#374151",
                fontSize: 12,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(270px,1fr))",
          gap: 18,
        }}
      >
        {displayed.map((coach) => (
          <div
            key={coach.id}
            onClick={() => setDetail(coach)}
            style={{
              background: "white",
              borderRadius: 18,
              padding: "22px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              cursor: "pointer",
              transition: "all 0.25s",
              opacity: coach.status === "inactive" ? 0.65 : 1,
              border: "2px solid transparent",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.boxShadow =
                "0 10px 32px rgba(15,98,254,0.12)";
              (e.currentTarget as HTMLDivElement).style.borderColor = "#EFF4FF";
              (e.currentTarget as HTMLDivElement).style.transform =
                "translateY(-3px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.boxShadow =
                "0 2px 12px rgba(0,0,0,0.06)";
              (e.currentTarget as HTMLDivElement).style.borderColor =
                "transparent";
              (e.currentTarget as HTMLDivElement).style.transform = "none";
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 14,
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
                    width: 52,
                    height: 52,
                    borderRadius: "50%",
                    background: coach.gradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                    fontWeight: 800,
                    color: "white",
                    flexShrink: 0,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  }}
                >
                  {coach.avatar}
                </div>
                <div>
                  <p
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: "#111827",
                      margin: 0,
                    }}
                  >
                    {coach.name}
                  </p>
                  <span
                    style={{
                      padding: "2px 9px",
                      borderRadius: 100,
                      background: "#EFF4FF",
                      color: "#0F62FE",
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                  >
                    {coach.sport}
                  </span>
                </div>
              </div>

              <span
                style={{
                  padding: "3px 9px",
                  borderRadius: 100,
                  background: coach.status === "active" ? "#F0FDF4" : "#F9FAFB",
                  color: coach.status === "active" ? "#16A34A" : "#6B7280",
                  fontSize: 10,
                  fontWeight: 700,
                }}
              >
                {coach.status === "active" ? "Active" : "Inactive"}
              </span>
            </div>

            <p
              style={{
                fontSize: 12,
                color: "#6B7280",
                lineHeight: 1.6,
                margin: "0 0 12px",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {coach.bio}
            </p>

            <div
              style={{
                display: "flex",
                gap: 8,
                marginBottom: 14,
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  color: "#374151",
                  background: "#F9FAFB",
                  borderRadius: 7,
                  padding: "3px 8px",
                }}
              >
                📅 {coach.experience || "—"}
              </span>
              <span
                style={{
                  fontSize: 11,
                  color: "#374151",
                  background: "#F9FAFB",
                  borderRadius: 7,
                  padding: "3px 8px",
                }}
              >
                🎯 {coach.specialty || "—"}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                {coach.rating > 0 ? (
                  <>
                    <Star size={13} fill="#F59E0B" color="#F59E0B" />
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#111827",
                      }}
                    >
                      {Number(coach.rating).toFixed(1)}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        color: "#9CA3AF",
                      }}
                    >
                      ({coach.reviews})
                    </span>
                  </>
                ) : (
                  <span style={{ fontSize: 12, color: "#9CA3AF" }}>
                    No reviews yet
                  </span>
                )}
              </div>

              <div>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#22C55E",
                  }}
                >
                  {coach.sessionsThisMonth} sessions/mo
                </span>
              </div>
            </div>

            <div
              style={{ display: "flex", gap: 7 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => openEdit(coach)}
                style={{
                  flex: 1,
                  padding: "8px",
                  borderRadius: 9,
                  background: "#EFF4FF",
                  color: "#0F62FE",
                  fontSize: 12,
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 5,
                }}
              >
                <Edit size={12} />
                Edit
              </button>

              <button
                onClick={() => toggleStatus(coach.id)}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 9,
                  border: "1px solid #E5E7EB",
                  background: "white",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                }}
              >
                {coach.status === "active" ? "⏸" : "▶"}
              </button>

              <button
                onClick={() => setDeleteId(coach.id)}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 9,
                  border: "1px solid #E5E7EB",
                  background: "white",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#EF4444",
                }}
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {detail && (
        <div style={{ position: "fixed", inset: 0, zIndex: 150 }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.4)",
            }}
            onClick={() => setDetail(null)}
          />

          <div
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              bottom: 0,
              width: 380,
              background: "white",
              overflowY: "auto",
              boxShadow: "-12px 0 40px rgba(0,0,0,0.12)",
              padding: 24,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <h3
                style={{
                  fontSize: 17,
                  fontWeight: 800,
                  color: "#111827",
                  margin: 0,
                }}
              >
                Coach Profile
              </h3>
              <button
                onClick={() => setDetail(null)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <X size={18} color="#6B7280" />
              </button>
            </div>

            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: detail.gradient,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  fontWeight: 800,
                  color: "white",
                  margin: "0 auto 10px",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                }}
              >
                {detail.avatar}
              </div>
              <p
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: "#111827",
                  margin: "0 0 4px",
                }}
              >
                {detail.name}
              </p>
              <span
                style={{
                  padding: "3px 12px",
                  borderRadius: 100,
                  background: "#EFF4FF",
                  color: "#0F62FE",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {detail.sport}
              </span>
            </div>

            <p
              style={{
                fontSize: 13,
                color: "#374151",
                lineHeight: 1.75,
                marginBottom: 20,
              }}
            >
              {detail.bio}
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
                marginBottom: 20,
              }}
            >
              {[
                { label: "Experience", val: detail.experience || "—" },
                { label: "Sessions/mo", val: detail.sessionsThisMonth },
                {
                  label: "Earnings/mo",
                  val:
                    detail.totalEarnings > 0
                      ? `$${detail.totalEarnings.toLocaleString()}`
                      : "—",
                },
                {
                  label: "Rating",
                  val:
                    detail.rating > 0
                      ? `⭐ ${detail.rating} (${detail.reviews})`
                      : "—",
                },
              ].map((r) => (
                <div
                  key={r.label}
                  style={{
                    background: "#F9FAFB",
                    borderRadius: 10,
                    padding: "10px 12px",
                  }}
                >
                  <p
                    style={{
                      fontSize: 10,
                      color: "#9CA3AF",
                      margin: 0,
                      textTransform: "uppercase",
                      letterSpacing: 0.4,
                    }}
                  >
                    {r.label}
                  </p>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#111827",
                      margin: 0,
                    }}
                  >
                    {r.val}
                  </p>
                </div>
              ))}
            </div>

            {detail.certifications.length > 0 && (
              <div style={{ marginBottom: 18 }}>
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#6B7280",
                    margin: "0 0 8px",
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  Certifications
                </p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  }}
                >
                  {detail.certifications.map((c) => (
                    <div
                      key={c}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <Award size={13} color="#0F62FE" />
                      <span style={{ fontSize: 13, color: "#374151" }}>
                        {c}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {detail.schedule.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#6B7280",
                    margin: "0 0 8px",
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  Schedule
                </p>
                {detail.schedule.map((s) => (
                  <div
                    key={s}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 5,
                    }}
                  >
                    <Clock size={13} color="#9CA3AF" />
                    <span style={{ fontSize: 13, color: "#374151" }}>{s}</span>
                  </div>
                ))}
              </div>
            )}

            {[
              { icon: Mail, val: detail.email },
              { icon: Phone, val: detail.phone },
            ].map((r) => (
              <div
                key={r.val}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 8,
                }}
              >
                <r.icon size={13} color="#9CA3AF" />
                <span style={{ fontSize: 13, color: "#374151" }}>{r.val}</span>
              </div>
            ))}

            <button
              onClick={() => openEdit(detail)}
              style={{
                width: "100%",
                marginTop: 18,
                padding: "11px",
                borderRadius: 12,
                background: "linear-gradient(135deg,#0F62FE,#0043CE)",
                color: "white",
                fontSize: 14,
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 7,
              }}
            >
              <Edit size={14} /> Edit Coach
            </button>
          </div>
        </div>
      )}

      {}
      {showAdd && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
          onClick={() => setShowAdd(false)}
        >
          <div
            style={{
              background: "white",
              borderRadius: 18,
              padding: 26,
              width: "100%",
              maxWidth: 460,
              maxHeight: "88vh",
              overflowY: "auto",
              boxShadow: "0 20px 50px rgba(0,0,0,0.18)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <h3
                style={{
                  fontSize: 17,
                  fontWeight: 800,
                  color: "#111827",
                  margin: 0,
                }}
              >
                {editCoach ? "Edit Coach" : "Add Coach"}
              </h3>
              <button
                onClick={() => setShowAdd(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <X size={16} color="#6B7280" />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
              {[
                ["Full Name *", fName, setFName, "text", "e.g. Mike Torres"],
                ["Email *", fEmail, setFEmail, "email", "coach@club.com"],
                ["Phone", fPhone, setFPhone, "tel", "+1 555 000 0000"],
                ["Experience", fExp, setFExp, "text", "e.g. 10 years"],
                [
                  "Specialty",
                  fSpecialty,
                  setFSpecialty,
                  "text",
                  "e.g. Tactical play",
                ],
              ].map(([label, val, setter, type, ph]) => (
                <div key={label as string}>
                  <label
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#374151",
                      display: "block",
                      marginBottom: 5,
                    }}
                  >
                    {label as string}
                  </label>
                  <input
                    type={type as string}
                    value={val as string}
                    onChange={(e) => (setter as any)(e.target.value)}
                    placeholder={ph as string}
                    style={{
                      width: "100%",
                      height: 38,
                      border: "1.5px solid #E5E7EB",
                      borderRadius: 9,
                      padding: "0 11px",
                      fontSize: 13,
                      outline: "none",
                      boxSizing: "border-box",
                      color: "#111827",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#0F62FE")}
                    onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                  />
                </div>
              ))}

              <div>
                <label
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#374151",
                    display: "block",
                    marginBottom: 5,
                  }}
                >
                  Sport
                </label>
                <select
                  value={fSport}
                  onChange={(e) => setFSport(e.target.value)}
                  style={{
                    width: "100%",
                    height: 38,
                    border: "1.5px solid #E5E7EB",
                    borderRadius: 9,
                    padding: "0 10px",
                    fontSize: 13,
                    outline: "none",
                    background: "white",
                    boxSizing: "border-box",
                    color: "#111827",
                  }}
                >
                  {ALL_SPORTS.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#374151",
                    display: "block",
                    marginBottom: 5,
                  }}
                >
                  Bio
                </label>
                <textarea
                  value={fBio}
                  onChange={(e) => setFBio(e.target.value)}
                  placeholder="Short biography…"
                  style={{
                    width: "100%",
                    height: 80,
                    border: "1.5px solid #E5E7EB",
                    borderRadius: 9,
                    padding: "9px 11px",
                    fontSize: 13,
                    outline: "none",
                    resize: "none",
                    boxSizing: "border-box",
                    fontFamily: "inherit",
                    color: "#111827",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#0F62FE")}
                  onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                />
              </div>

              <div style={{ display: "flex", gap: 9 }}>
                <button
                  onClick={() => setShowAdd(false)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: 10,
                    border: "1.5px solid #E5E7EB",
                    background: "white",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    color: "#374151",
                  }}
                >
                  Cancel
                </button>

                <button
                  onClick={saveCoach}
                  disabled={!fName || !fEmail}
                  style={{
                    flex: 2,
                    padding: "10px",
                    borderRadius: 10,
                    background:
                      fName && fEmail
                        ? "linear-gradient(135deg,#0F62FE,#0043CE)"
                        : "#E5E7EB",
                    color: fName && fEmail ? "white" : "#9CA3AF",
                    fontSize: 13,
                    fontWeight: 700,
                    border: "none",
                    cursor: fName && fEmail ? "pointer" : "not-allowed",
                  }}
                >
                  {editCoach ? "Save Changes" : "Add Coach"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {}
      {deleteId && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            zIndex: 300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
          onClick={() => setDeleteId(null)}
        >
          <div
            style={{
              background: "white",
              borderRadius: 18,
              padding: 28,
              maxWidth: 340,
              width: "100%",
              textAlign: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "#FFF1F2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 12px",
              }}
            >
              <Trash2 size={20} color="#EF4444" />
            </div>

            <h3
              style={{
                fontSize: 16,
                fontWeight: 800,
                color: "#111827",
                margin: "0 0 8px",
              }}
            >
              Remove Coach?
            </h3>

            <p
              style={{
                fontSize: 13,
                color: "#6B7280",
                margin: "0 0 20px",
              }}
            >
              This coach will be removed from the club roster.
            </p>

            <div style={{ display: "flex", gap: 9 }}>
              <button
                onClick={() => setDeleteId(null)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: 10,
                  border: "1.5px solid #E5E7EB",
                  background: "white",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  color: "#374151",
                }}
              >
                Cancel
              </button>

              <button
                onClick={deleteCoach}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: 10,
                  background: "linear-gradient(135deg,#EF4444,#DC2626)",
                  color: "white",
                  fontSize: 13,
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
