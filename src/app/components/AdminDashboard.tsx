import { useEffect, useState, useMemo, useRef } from "react";
import axios from "axios";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  TrendingUp,
  Users,
  Building2,
  Clock,
  Star,
  MapPin,
  Phone,
  Globe,
  Mail,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Shield,
  MoreHorizontal,
  Download,
  Upload,
  RefreshCw,
  X,
  Check,
  AlertTriangle,
  Dumbbell,
  Waves,
  Zap,
  Activity,
  Heart,
  Flame,
  Target,
  Trophy,
  HelpCircle,
} from "lucide-react";

const API_BASE_URL =
  (import.meta as any)?.env?.VITE_API_URL || "http://localhost:4000";

const normalizeWebsite = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
};

import { Navbar } from "./Navbar";
import { Page } from "./Navbar";

type ClubStatus = "active" | "pending" | "inactive" | "suspended";
type SubscriptionType = "monthly" | "yearly";

interface Club {
  id: number;
  name: string;
  logo: string;
  coverImage: string;
  description: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  sports: string[];
  facilities: string[];
  members: number;
  rating: number;
  reviews: number;
  status: ClubStatus;
  verified: boolean;
  subscriptionType: SubscriptionType;
  subscriptionPlan?: string;
  subscriptionStartDate?: string;
  subscriptionEndDate?: string;
  subscriptionStatus?: "active" | "expired" | "cancelled" | "paused";
  priceFrom: number;
  workingHours: string;
  capacity: number;
  joinedDate: string;
  monthlyRevenue: number;
}

const CLUB_IMAGES = [
  "https://images.unsplash.com/photo-1761971975769-97e598bf526b?w=400&q=80",
  "https://images.unsplash.com/photo-1775993703558-e7afab02b7bd?w=400&q=80",
  "https://images.unsplash.com/photo-1679391029864-d46f366a456b?w=400&q=80",
  "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&q=80",
  "https://images.unsplash.com/photo-1545151414-8a948e1ea54f?w=400&q=80",
  "https://images.unsplash.com/photo-1554245064-3ab88761ac5d?w=400&q=80",
  "https://images.unsplash.com/photo-1590227632180-80a3bf110871?w=400&q=80",
  "https://images.unsplash.com/photo-1765728617805-b9f22d64e5b3?w=400&q=80",
  "https://images.unsplash.com/photo-1676746424139-77f8bd8922a8?w=400&q=80",
  "https://images.unsplash.com/photo-1569337042150-c21c85b80a10?w=400&q=80",
  "https://images.unsplash.com/photo-1775993167571-cd1ff4cadada?w=400&q=80",
  "https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=400&q=80",
];

const INITIAL_CLUBS: Club[] = [];

const ALL_SPORTS: string[] = [];

const ALL_FACILITIES: string[] = [];

const ALL_CITIES = [
  "San Francisco",
  "Los Angeles",
  "New York",
  "Chicago",
  "Miami",
  "Houston",
  "Seattle",
  "Boston",
  "Phoenix",
  "Denver",
];

const statusConfig: Record<
  ClubStatus,
  { bg: string; text: string; label: string; dot: string }
> = {
  active: { bg: "#F0FDF4", text: "#16A34A", label: "Active", dot: "#22C55E" },
  pending: { bg: "#FFFBEB", text: "#D97706", label: "Pending", dot: "#F59E0B" },
  inactive: {
    bg: "#F9FAFB",
    text: "#6B7280",
    label: "Inactive",
    dot: "#9CA3AF",
  },
  suspended: {
    bg: "#FFF1F2",
    text: "#DC2626",
    label: "Suspended",
    dot: "#EF4444",
  },
};

const SPORT_ICONS: Record<string, React.FC<{ size: number; color: string }>> = {
  Football: Flame,
  Gym: Dumbbell,
  Swimming: Waves,
  Basketball: Target,
  Tennis: Activity,
  Yoga: Heart,
  CrossFit: Zap,
  default: Trophy,
};

const emptyForm = (): Omit<
  Club,
  | "id"
  | "logo"
  | "coverImage"
  | "rating"
  | "reviews"
  | "members"
  | "monthlyRevenue"
> => ({
  name: "",
  description: "",
  city: "",
  address: "",
  phone: "",
  email: "",
  website: "",
  sports: [],
  facilities: [],
  status: "pending",
  verified: false,
  subscriptionType: "monthly",
  subscriptionPlan: "Basic",
  subscriptionStartDate: "",
  subscriptionEndDate: "",
  subscriptionStatus: "active",
  priceFrom: 0,
  workingHours: "",
  capacity: 0,
  joinedDate: "",
});

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
  bg,
}: {
  icon: any;
  label: string;
  value: string;
  sub: string;
  color: string;
  bg: string;
}) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: 16,
        padding: "20px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        border: "1px solid #F3F4F6",
        display: "flex",
        gap: 16,
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 14,
          background: bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={22} color={color} />
      </div>
      <div>
        <p
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: "#111827",
            margin: 0,
            letterSpacing: "-0.5px",
          }}
        >
          {value}
        </p>
        <p
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: "#111827",
            margin: "1px 0 2px",
          }}
        >
          {label}
        </p>
        <p
          style={{ fontSize: 11, color: "#22C55E", margin: 0, fontWeight: 600 }}
        >
          {sub}
        </p>
      </div>
    </div>
  );
}

interface AdminDashboardProps {
  navigate: (page: Page) => void;
}

export function AdminDashboard({ navigate }: AdminDashboardProps) {
  const [clubs, setClubs] = useState<Club[]>(INITIAL_CLUBS);
  const [isLoadingClubs, setIsLoadingClubs] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | ClubStatus>("All");
  const [verifiedFilter, setVerifiedFilter] = useState<"All" | "yes" | "no">(
    "All",
  );
  const [sortField, setSortField] = useState<keyof Club>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [page, setPage] = useState(1);
  const PER_PAGE = 8;

  const [detailClub, setDetailClub] = useState<Club | null>(null);
  const [editClub, setEditClub] = useState<Club | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Club | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState(emptyForm());
  const [formTab, setFormTab] = useState(0);
  const [formSports, setFormSports] = useState<string[]>([]);
  const [newSportInput, setNewSportInput] = useState("");
  const [newFacilityInput, setNewFacilityInput] = useState("");
  const [showControlModal, setShowControlModal] = useState(false);
  const [controlSports, setControlSports] = useState<string[]>([]);
  const [controlFacilities, setControlFacilities] = useState<string[]>([]);
  const [newControlSport, setNewControlSport] = useState("");
  const [newControlFacility, setNewControlFacility] = useState("");
  const [formFacilities, setFormFacilities] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const flash = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const getAuthHeaders = (): Record<string, string> => {
    if (typeof window === "undefined") return { Accept: "application/json" };
    const token = window.localStorage.getItem("token");
    const headers: Record<string, string> = { Accept: "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
  };

  const loadClubs = async () => {
    setIsLoadingClubs(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/admin`, {
        headers: getAuthHeaders(),
      });
      const data = response.data;
      if (data?.success !== true) {
        throw new Error(data?.message || "Failed to load clubs.");
      }
      setClubs(data.data ?? []);
    } catch (error) {
      console.error("Load clubs failed:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Unable to load clubs. Please refresh.",
      );
    } finally {
      setIsLoadingClubs(false);
    }
  };

  useEffect(() => {
    loadClubs();
  }, []);

  const addControlItem = async (
    type: "sport" | "facility",
    value: string,
  ): Promise<boolean> => {
    const trimmed = value.trim();
    if (!trimmed) return false;

    const isSport = type === "sport";
    if (
      isSport
        ? controlSports.includes(trimmed)
        : controlFacilities.includes(trimmed)
    ) {
      flash(`${trimmed} already exists.`);
      return false;
    }

    const url = `${API_BASE_URL}/club/${isSport ? "sports" : "facility"}`;

    try {
      const payload = isSport ? { sport: trimmed } : { facility: trimmed };
      const response = await axios.post(url, payload, {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
      });
      const data = response.data;
      if (data?.success === false || data?.status === false) {
        throw new Error(data?.message || "Failed to save item");
      }

      if (isSport) {
        setControlSports((s) => [...s, trimmed]);
      } else {
        setControlFacilities((f) => [...f, trimmed]);
      }

      flash(`${trimmed} added successfully.`);
      return true;
    } catch (error) {
      console.error("Add control item failed:", error);
      alert(`Failed to add ${type}.`);
      return false;
    }
  };

  const handleAddControlSport = async () => {
    if (!newControlSport.trim()) return;
    const added = await addControlItem("sport", newControlSport);
    if (added) setNewControlSport("");
  };

  const handleAddControlFacility = async () => {
    if (!newControlFacility.trim()) return;
    const added = await addControlItem("facility", newControlFacility);
    if (added) setNewControlFacility("");
  };

  const loadControlLists = async () => {
    try {
      const [sRes, fRes] = await Promise.all([
        axios
          .get(`${API_BASE_URL}/club/sports`, {
            headers: getAuthHeaders(),
          })
          .catch(() => null),
        axios
          .get(`${API_BASE_URL}/club/facility`, {
            headers: getAuthHeaders(),
          })
          .catch(() => null),
      ]);
      const sJson = sRes?.data ?? null;
      const fJson = fRes?.data ?? null;

      const rawSports = sRes ? (sJson?.data ?? sJson ?? []) : ALL_SPORTS;
      const rawFacilities = fRes
        ? (fJson?.data ?? fJson ?? [])
        : ALL_FACILITIES;

      const normalize = (item: any) => {
        if (typeof item === "string") return item;
        if (item == null) return "";
        if (typeof item.sport === "string") return item.sport;
        if (typeof item.facility === "string") return item.facility;
        if (typeof item.name === "string") return item.name;
        if (typeof item.value === "string") return item.value;
        return String(item.id ?? JSON.stringify(item));
      };

      const sports = Array.isArray(rawSports) ? rawSports.map(normalize) : [];
      const facilities = Array.isArray(rawFacilities)
        ? rawFacilities.map(normalize)
        : [];

      setControlSports(sports);
      setControlFacilities(facilities);
    } catch (error) {
      console.error("Failed to load control lists", error);
      setControlSports([...ALL_SPORTS]);
      setControlFacilities([...ALL_FACILITIES]);
    }
  };

  useEffect(() => {
    if (showAddModal || showControlModal) loadControlLists();
  }, [showAddModal, showControlModal]);

  const filtered = useMemo(() => {
    let list = clubs.filter((c) => {
      if (
        searchQ &&
        !c.name.toLowerCase().includes(searchQ.toLowerCase()) &&
        !c.city.toLowerCase().includes(searchQ.toLowerCase()) &&
        !c.email.toLowerCase().includes(searchQ.toLowerCase())
      )
        return false;
      if (statusFilter !== "All" && c.status !== statusFilter) return false;
      if (verifiedFilter === "yes" && !c.verified) return false;
      if (verifiedFilter === "no" && c.verified) return false;
      return true;
    });
    list = [...list].sort((a, b) => {
      const va = a[sortField];
      const vb = b[sortField];
      const cmp =
        typeof va === "number"
          ? (va as number) - (vb as number)
          : String(va).localeCompare(String(vb));
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [clubs, searchQ, statusFilter, verifiedFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const toggleSort = (field: keyof Club) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const SortIcon = ({ field }: { field: keyof Club }) => (
    <span style={{ marginLeft: 4, opacity: sortField === field ? 1 : 0.3 }}>
      {sortField === field && sortDir === "desc" ? (
        <ChevronDown size={12} />
      ) : (
        <ChevronUp size={12} />
      )}
    </span>
  );

  const toggleSelect = (id: number) =>
    setSelected((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  const toggleAll = () =>
    setSelected((s) =>
      s.size === paginated.length
        ? new Set()
        : new Set(paginated.map((c) => c.id)),
    );

  const openAdd = () => {
    prevSearchRef.current = searchQ;
    setSearchQ("");
    setFormData(emptyForm());
    setFormSports([]);
    setFormFacilities([]);
    setFormTab(0);
    void loadControlLists();
    setShowAddModal(true);
  };

  const openEdit = (club: Club) => {
    prevSearchRef.current = searchQ;
    setSearchQ("");
    void loadControlLists();
    setFormData({
      name: club.name,
      description: club.description,
      city: club.city,
      address: club.address,
      phone: club.phone,
      email: club.email,
      website: club.website,
      sports: club.sports,
      facilities: club.facilities,
      status: club.status,
      verified: club.verified,
      subscriptionType: club.subscriptionType,
      subscriptionPlan: club.subscriptionPlan ?? "Basic",
      subscriptionStartDate: club.subscriptionStartDate ?? "",
      subscriptionEndDate: club.subscriptionEndDate ?? "",
      subscriptionStatus: club.subscriptionStatus ?? "active",
      priceFrom: club.priceFrom,
      workingHours: club.workingHours,
      capacity: club.capacity,
      joinedDate: club.joinedDate,
    });
    setFormSports([...club.sports]);
    setFormFacilities([...club.facilities]);
    setEditClub(club);
    setFormTab(0);
    setDetailClub(null);
  };

  const prevSearchRef = useRef<string>("");

  const closeModal = () => {
    setShowAddModal(false);
    setEditClub(null);
    setFormTab(0);
    setFormData(emptyForm());
    setFormSports([]);
    setFormFacilities([]);
    setTimeout(() => setSearchQ(prevSearchRef.current ?? ""), 0);
  };

  const saveClub = async () => {
    const payload = {
      clubName: formData.name,
      decription: formData.description,
      city: formData.city,
      maxMembers: formData.capacity,
      address: formData.address,
      workingHoures: formData.workingHours,
      phoneNumber: formData.phone,
      email: formData.email,
      website: normalizeWebsite(formData.website),
      dateJoined: formData.joinedDate || undefined,
      billingType:
        formData.subscriptionType === "yearly" ? "YEARLY" : "MONTHLY",
      price: formData.priceFrom,
      startDate: formData.subscriptionStartDate || undefined,
      endDate: formData.subscriptionEndDate || undefined,
      status: formData.status.toUpperCase(),
      sports: formSports,
      facilities: formFacilities,
    };

    if (editClub) {
      try {
        const response = await axios.put(
          `${API_BASE_URL}/admin/${editClub.id}`,
          payload,
          {
            headers: {
              ...getAuthHeaders(),
              "Content-Type": "application/json",
            },
          },
        );
        const data = response.data;
        if (data?.success !== true) {
          throw new Error(data?.message || "Failed to update club.");
        }

        setClubs((cs) =>
          cs.map((c) =>
            c.id === editClub.id
              ? {
                  ...c,
                  ...formData,
                  sports: formSports,
                  facilities: formFacilities,
                }
              : c,
          ),
        );
        closeModal();
        flash("Club updated successfully.");
      } catch (error) {
        console.error("Failed to update club:", error);
        const errMessage =
          error instanceof Error
            ? error.message
            : "Unable to update club. Please try again.";
        alert(errMessage);
      }
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/admin`, payload, {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
      });
      const data = response.data;
      if (data?.success !== true) {
        throw new Error(data?.message || "Failed to save club.");
      }

      const newId =
        data?.data?.id ?? Math.max(0, ...clubs.map((c) => c.id)) + 1;
      const initials = formData.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

      setClubs((cs) => [
        ...cs,
        {
          id: newId,
          logo: initials,
          coverImage: CLUB_IMAGES[newId % CLUB_IMAGES.length],
          rating: 0,
          reviews: 0,
          members: 0,
          monthlyRevenue: 0,
          ...formData,
          sports: formSports,
          facilities: formFacilities,
        } as Club,
      ]);
      closeModal();
      flash("Club added successfully.");
    } catch (error) {
      console.error("Failed to save club:", error);
      const errMessage =
        error instanceof Error
          ? error.message
          : "Unable to save club. Please try again.";
      alert(errMessage);
    }
  };

  const deleteClub = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await axios
        .delete(`${API_BASE_URL}/admin/${deleteTarget.id}`, {
          headers: getAuthHeaders(),
        })
        .catch(() => null);
      const data = res?.data ?? null;
      console.debug("AdminDashboard.deleteClub res:", res);
      console.debug("AdminDashboard.deleteClub data:", data);
      if (
        !res ||
        res.status < 200 ||
        res.status >= 300 ||
        data?.success === false
      ) {
        throw new Error(data?.message || "Failed to delete club");
      }

      setClubs((cs) => cs.filter((c) => c.id !== deleteTarget.id));
      setDeleteTarget(null);
      setSelected((s) => {
        const n = new Set(s);
        n.delete(deleteTarget.id);
        return n;
      });
      flash("Club deleted.");
    } catch (error) {
      console.error("Failed to delete club:", error);
      const errMessage =
        error instanceof Error ? error.message : "Unable to delete club.";
      alert(errMessage);
    } finally {
      setDeleting(false);
    }
  };

  const quickStatus = (id: number, status: ClubStatus) => {
    setClubs((cs) => cs.map((c) => (c.id === id ? { ...c, status } : c)));
    flash(`Club ${status === "active" ? "approved" : "suspended"}.`);
  };

  const bulkApply = () => {
    if (!bulkAction || selected.size === 0) return;
    const ids = Array.from(selected);
    if (bulkAction === "delete") {
      setClubs((cs) => cs.filter((c) => !ids.includes(c.id)));
      setSelected(new Set());
      flash(`${ids.length} clubs deleted.`);
    } else
      setClubs((cs) =>
        cs.map((c) =>
          ids.includes(c.id) ? { ...c, status: bulkAction as ClubStatus } : c,
        ),
      );
    setBulkAction("");
    setSelected(new Set());
    flash(`Bulk action applied to ${ids.length} clubs.`);
  };

  const stats = {
    total: clubs.length,
    active: clubs.filter((c) => c.status === "active").length,
    pending: clubs.filter((c) => c.status === "pending").length,
    members: clubs.reduce((a, c) => a + c.members, 0),

    revenue: clubs.reduce((a, c) => a + (Number(c.priceFrom) || 0), 0),
  };

  const toggleFormSport = (s: string) =>
    setFormSports((ss) =>
      ss.includes(s) ? ss.filter((x) => x !== s) : [...ss, s],
    );
  const toggleFormFacility = (f: string) =>
    setFormFacilities((ff) =>
      ff.includes(f) ? ff.filter((x) => x !== f) : [...ff, f],
    );
  const fd = (key: string, val: any) =>
    setFormData((d) => ({ ...d, [key]: val }));

  const FORM_TABS = [
    "Basic Info",
    "Sports & Facilities",
    "Contact & Web",
    "Subscription",
  ];
  const modalTitle = editClub ? `Edit: ${editClub.name}` : "Add New Club";
  const isModalOpen = showAddModal || !!editClub;

  return (
    <div style={{ background: "#F8FAFC", minHeight: "100vh" }}>
      <Navbar navigate={navigate} currentPage="admin" />

      {}
      {successMsg && (
        <div
          style={{
            position: "fixed",
            top: 84,
            right: 24,
            background: "#0D1B2A",
            color: "white",
            borderRadius: 12,
            padding: "12px 20px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          <Check size={16} color="#22C55E" /> {successMsg}
        </div>
      )}

      <div style={{ maxWidth: 1380, margin: "0 auto", padding: "32px 24px" }}>
        {}
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
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 6,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "linear-gradient(135deg, #0F62FE, #0043CE)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Shield size={18} color="white" />
              </div>
              <h1
                style={{
                  fontSize: 24,
                  fontWeight: 900,
                  color: "#111827",
                  margin: 0,
                }}
              >
                Admin Dashboard
              </h1>
            </div>
            <p style={{ fontSize: 14, color: "#6B7280", margin: 0 }}>
              Manage all clubs, review applications, and oversee platform data.
            </p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => setShowControlModal(true)}
              style={{
                padding: "9px 16px",
                borderRadius: 10,
                border: "1.5px solid #22C55E",
                background: "white",
                color: "#16A34A",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Filter size={14} /> Control Sports & Facilities
            </button>
            <button
              onClick={openAdd}
              style={{
                padding: "9px 20px",
                borderRadius: 10,
                background: "linear-gradient(135deg, #0F62FE, #0043CE)",
                color: "white",
                fontSize: 13,
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 7,
                boxShadow: "0 4px 14px rgba(15,98,254,0.35)",
              }}
            >
              <Plus size={15} /> Add Club
            </button>
          </div>
        </div>

        {}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 16,
            marginBottom: 28,
          }}
        >
          <StatCard
            icon={Building2}
            label="Total Clubs"
            value={stats.total.toLocaleString()}
            sub="+3 this month"
            color="#0F62FE"
            bg="#EFF4FF"
          />
          <StatCard
            icon={CheckCircle}
            label="Active Clubs"
            value={stats.active.toLocaleString()}
            sub={`${Math.round((stats.active / stats.total) * 100)}% of total`}
            color="#22C55E"
            bg="#F0FDF4"
          />
          <StatCard
            icon={Clock}
            label="Pending Review"
            value={stats.pending.toLocaleString()}
            sub="Requires action"
            color="#F59E0B"
            bg="#FFFBEB"
          />
          <StatCard
            icon={Users}
            label="Total Members"
            value={stats.members.toLocaleString()}
            sub="+642 this month"
            color="#8B5CF6"
            bg="#F5F3FF"
          />
          <StatCard
            icon={TrendingUp}
            label="Total Revenue"
            value={"$" + stats.revenue.toLocaleString()}
            sub="Aggregate of subscription prices"
            color="#0F62FE"
            bg="#EFF4FF"
          />
        </div>

        {}
        <div
          style={{
            background: "white",
            borderRadius: 14,
            padding: "16px 20px",
            marginBottom: 16,
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {}
          <div style={{ position: "relative", flex: "1 1 220px" }}>
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
              value={searchQ}
              onChange={(e) => {
                setSearchQ(e.target.value);
                setPage(1);
              }}
              placeholder="Search clubs, cities, emailsâ€¦"
              style={{
                paddingLeft: 36,
                paddingRight: 12,
                height: 38,
                border: "1.5px solid #E5E7EB",
                borderRadius: 10,
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
          {}
          <div style={{ display: "flex", gap: 6 }}>
            {(
              ["All", "active", "pending", "inactive", "suspended"] as const
            ).map((s) => (
              <button
                key={s}
                onClick={() => {
                  setStatusFilter(s);
                  setPage(1);
                }}
                style={{
                  padding: "5px 12px",
                  borderRadius: 100,
                  border: statusFilter === s ? "none" : "1.5px solid #E5E7EB",
                  background:
                    statusFilter === s
                      ? s === "All"
                        ? "#0F62FE"
                        : (statusConfig[s as ClubStatus]?.bg ?? "#0F62FE")
                      : "white",
                  color:
                    statusFilter === s
                      ? s === "All"
                        ? "white"
                        : (statusConfig[s as ClubStatus]?.text ?? "white")
                      : "#374151",
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  textTransform: "capitalize",
                }}
              >
                {s}
              </button>
            ))}
          </div>
          {}
          <select
            value={verifiedFilter}
            onChange={(e) => setVerifiedFilter(e.target.value as any)}
            style={{
              height: 38,
              border: "1.5px solid #E5E7EB",
              borderRadius: 10,
              fontSize: 13,
              color: "#374151",
              padding: "0 12px",
              outline: "none",
              background: "white",
            }}
          >
            <option value="All">All Verified</option>
            <option value="yes">Verified Only</option>
            <option value="no">Unverified</option>
          </select>
        </div>

        {}
        {selected.size > 0 && (
          <div
            style={{
              background: "#0D1B2A",
              borderRadius: 12,
              padding: "12px 20px",
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              gap: 14,
              flexWrap: "wrap",
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 600, color: "white" }}>
              {selected.size} club{selected.size > 1 ? "s" : ""} selected
            </span>
            <select
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value)}
              style={{
                height: 34,
                border: "none",
                borderRadius: 8,
                fontSize: 13,
                color: "#111827",
                padding: "0 12px",
                outline: "none",
                background: "white",
              }}
            >
              <option value="">Choose actionâ€¦</option>
              <option value="active">Set Active</option>
              <option value="inactive">Set Inactive</option>
              <option value="suspended">Suspend</option>
              <option value="delete">Delete Selected</option>
            </select>
            <button
              onClick={bulkApply}
              disabled={!bulkAction}
              style={{
                padding: "7px 16px",
                borderRadius: 8,
                background: bulkAction === "delete" ? "#EF4444" : "#0F62FE",
                color: "white",
                fontSize: 13,
                fontWeight: 600,
                border: "none",
                cursor: bulkAction ? "pointer" : "not-allowed",
                opacity: bulkAction ? 1 : 0.5,
              }}
            >
              Apply
            </button>
            <button
              onClick={() => setSelected(new Set())}
              style={{
                marginLeft: "auto",
                background: "none",
                border: "none",
                color: "#94A3B8",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontSize: 13,
              }}
            >
              <X size={14} /> Deselect
            </button>
          </div>
        )}

        {}
        <div
          style={{
            background: "white",
            borderRadius: 16,
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            overflow: "hidden",
            marginBottom: 20,
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: 900,
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "#F9FAFB",
                    borderBottom: "1px solid #E5E7EB",
                  }}
                >
                  {}
                  <th style={{ padding: "12px 16px", width: 44 }}>
                    <input
                      type="checkbox"
                      checked={
                        selected.size === paginated.length &&
                        paginated.length > 0
                      }
                      onChange={toggleAll}
                      style={{
                        width: 15,
                        height: 15,
                        cursor: "pointer",
                        accentColor: "#0F62FE",
                      }}
                    />
                  </th>
                  {[
                    ["Club", "name"],
                    ["Location", "city"],
                    ["Sports", null],
                    ["Members", "members"],
                    ["Rating", "rating"],
                    ["Subscription", "priceFrom"],
                    ["Status", "status"],
                    ["Verified", "verified"],
                    ["Sub. Status", null],
                    ["Actions", null],
                  ].map(([label, field]) => (
                    <th
                      key={label as string}
                      onClick={() => field && toggleSort(field as keyof Club)}
                      style={{
                        padding: "12px 14px",
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#6B7280",
                        textAlign: "left",
                        whiteSpace: "nowrap",
                        cursor: field ? "pointer" : "default",
                        userSelect: "none",
                      }}
                    >
                      <span
                        style={{ display: "inline-flex", alignItems: "center" }}
                      >
                        {label as string}
                        {field && <SortIcon field={field as keyof Club} />}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td
                      colSpan={10}
                      style={{
                        padding: "48px",
                        textAlign: "center",
                        color: "#9CA3AF",
                        fontSize: 14,
                      }}
                    >
                      <Building2
                        size={40}
                        color="#E5E7EB"
                        style={{ display: "block", margin: "0 auto 12px" }}
                      />
                      No clubs match your filters.
                    </td>
                  </tr>
                ) : (
                  paginated.map((club, i) => (
                    <tr
                      key={club.id}
                      style={{
                        borderBottom:
                          i < paginated.length - 1
                            ? "1px solid #F3F4F6"
                            : "none",
                        background: selected.has(club.id) ? "#F0F7FF" : "white",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        if (!selected.has(club.id))
                          (
                            e.currentTarget as HTMLTableRowElement
                          ).style.background = "#FAFBFF";
                      }}
                      onMouseLeave={(e) => {
                        (
                          e.currentTarget as HTMLTableRowElement
                        ).style.background = selected.has(club.id)
                          ? "#F0F7FF"
                          : "white";
                      }}
                    >
                      {}
                      <td style={{ padding: "14px 16px" }}>
                        <input
                          type="checkbox"
                          checked={selected.has(club.id)}
                          onChange={() => toggleSelect(club.id)}
                          style={{
                            width: 15,
                            height: 15,
                            cursor: "pointer",
                            accentColor: "#0F62FE",
                          }}
                        />
                      </td>
                      {}
                      <td style={{ padding: "14px 14px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                          }}
                        >
                          <div
                            style={{
                              width: 42,
                              height: 42,
                              borderRadius: 12,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                              background: "#0F62FE",
                              color: "white",
                              fontWeight: 700,
                              fontSize: 14,
                              textTransform: "uppercase",
                              boxShadow: "0 6px 18px rgba(15,98,254,0.18)",
                            }}
                          >
                            {club.name
                              .split(" ")
                              .filter(Boolean)
                              .slice(0, 2)
                              .map((word) => word[0])
                              .join("")
                              .slice(0, 2)}
                          </div>
                          <div>
                            <p
                              style={{
                                fontSize: 13,
                                fontWeight: 700,
                                color: "#111827",
                                margin: 0,
                              }}
                            >
                              {club.name}
                            </p>
                            <p
                              style={{
                                fontSize: 11,
                                color: "#9CA3AF",
                                margin: 0,
                              }}
                            >
                              {club.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      {}
                      <td style={{ padding: "14px 14px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                          }}
                        >
                          <MapPin size={12} color="#9CA3AF" />
                          <span style={{ fontSize: 13, color: "#374151" }}>
                            {club.city}
                          </span>
                        </div>
                      </td>
                      {}
                      <td style={{ padding: "14px 14px" }}>
                        <div
                          style={{
                            display: "flex",
                            gap: 4,
                            flexWrap: "wrap",
                            maxWidth: 180,
                          }}
                        >
                          {club.sports.slice(0, 2).map((s) => (
                            <span
                              key={s}
                              style={{
                                padding: "2px 8px",
                                borderRadius: 100,
                                background: "#EFF4FF",
                                color: "#0F62FE",
                                fontSize: 10,
                                fontWeight: 600,
                              }}
                            >
                              {s}
                            </span>
                          ))}
                          {club.sports.length > 2 && (
                            <span
                              style={{
                                padding: "2px 8px",
                                borderRadius: 100,
                                background: "#F3F4F6",
                                color: "#6B7280",
                                fontSize: 10,
                                fontWeight: 600,
                              }}
                            >
                              +{club.sports.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      {}
                      <td
                        style={{
                          padding: "14px 14px",
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#111827",
                        }}
                      >
                        {club.members.toLocaleString()}
                      </td>
                      {}
                      <td style={{ padding: "14px 14px" }}>
                        {club.rating > 0 ? (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 5,
                            }}
                          >
                            <Star size={12} fill="#F59E0B" color="#F59E0B" />
                            <span
                              style={{
                                fontSize: 13,
                                fontWeight: 700,
                                color: "#111827",
                              }}
                            >
                              {club.rating}
                            </span>
                            <span style={{ fontSize: 11, color: "#9CA3AF" }}>
                              ({club.reviews})
                            </span>
                          </div>
                        ) : (
                          <span style={{ fontSize: 12, color: "#9CA3AF" }}>
                            No reviews
                          </span>
                        )}
                      </td>
                      {}
                      <td style={{ padding: "14px 14px" }}>
                        <p
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: "#111827",
                            margin: 0,
                          }}
                        >
                          {"$" + club.priceFrom.toLocaleString()}
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 400,
                              color: "#9CA3AF",
                            }}
                          >
                            /{club.subscriptionType === "yearly" ? "yr" : "mo"}
                          </span>
                        </p>
                        <span
                          style={{
                            padding: "2px 8px",
                            borderRadius: 100,
                            background:
                              club.subscriptionType === "yearly"
                                ? "#F5F3FF"
                                : "#EFF4FF",
                            color:
                              club.subscriptionType === "yearly"
                                ? "#7C3AED"
                                : "#0F62FE",
                            fontSize: 10,
                            fontWeight: 600,
                          }}
                        >
                          {club.subscriptionType === "yearly"
                            ? "Yearly"
                            : "Monthly"}
                        </span>
                      </td>
                      {}
                      <td style={{ padding: "14px 14px" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            padding: "4px 10px",
                            borderRadius: 100,
                            background: statusConfig[club.status].bg,
                            color: statusConfig[club.status].text,
                            fontSize: 11,
                            fontWeight: 700,
                          }}
                        >
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background: statusConfig[club.status].dot,
                            }}
                          />
                          {statusConfig[club.status].label}
                        </span>
                      </td>
                      {}
                      <td style={{ padding: "14px 14px" }}>
                        {club.verified ? (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4,
                              color: "#22C55E",
                              fontSize: 12,
                              fontWeight: 600,
                            }}
                          >
                            <CheckCircle
                              size={14}
                              fill="#22C55E"
                              color="white"
                            />{" "}
                            Verified
                          </span>
                        ) : (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4,
                              color: "#9CA3AF",
                              fontSize: 12,
                            }}
                          >
                            <XCircle size={14} color="#D1D5DB" /> Unverified
                          </span>
                        )}
                      </td>
                      {}
                      <td style={{ padding: "14px 14px" }}>
                        {(() => {
                          const s = club.subscriptionStatus ?? "active";
                          const cfg: Record<
                            string,
                            {
                              bg: string;
                              text: string;
                              dot: string;
                              label: string;
                            }
                          > = {
                            active: {
                              bg: "#F0FDF4",
                              text: "#16A34A",
                              dot: "#22C55E",
                              label: "Active",
                            },
                            paused: {
                              bg: "#FFFBEB",
                              text: "#D97706",
                              dot: "#F59E0B",
                              label: "Paused",
                            },
                            expired: {
                              bg: "#F9FAFB",
                              text: "#6B7280",
                              dot: "#9CA3AF",
                              label: "Expired",
                            },
                            cancelled: {
                              bg: "#FFF1F2",
                              text: "#DC2626",
                              dot: "#EF4444",
                              label: "Cancelled",
                            },
                          };
                          const c = cfg[s] ?? cfg.active;
                          return (
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 5,
                                padding: "4px 10px",
                                borderRadius: 100,
                                background: c.bg,
                                color: c.text,
                                fontSize: 11,
                                fontWeight: 700,
                              }}
                            >
                              <span
                                style={{
                                  width: 6,
                                  height: 6,
                                  borderRadius: "50%",
                                  background: c.dot,
                                }}
                              />
                              {c.label}
                            </span>
                          );
                        })()}
                      </td>
                      {}
                      <td style={{ padding: "14px 14px" }}>
                        <div
                          style={{
                            display: "flex",
                            gap: 5,
                            alignItems: "center",
                          }}
                        >
                          <button
                            onClick={() => setDetailClub(club)}
                            title="View Details"
                            style={{
                              width: 30,
                              height: 30,
                              borderRadius: 8,
                              border: "1px solid #E5E7EB",
                              background: "white",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#374151",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.background = "#F9FAFB")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.background = "white")
                            }
                          >
                            <Eye size={13} />
                          </button>
                          <button
                            onClick={() => openEdit(club)}
                            title="Edit"
                            style={{
                              width: 30,
                              height: 30,
                              borderRadius: 8,
                              border: "1px solid #E5E7EB",
                              background: "white",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#0F62FE",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.background = "#EFF4FF")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.background = "white")
                            }
                          >
                            <Edit size={13} />
                          </button>
                          {club.status !== "active" && (
                            <button
                              onClick={() => quickStatus(club.id, "active")}
                              title="Approve"
                              style={{
                                width: 30,
                                height: 30,
                                borderRadius: 8,
                                border: "1px solid #E5E7EB",
                                background: "white",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#22C55E",
                              }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.background = "#F0FDF4")
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.background = "white")
                              }
                            >
                              <CheckCircle size={13} />
                            </button>
                          )}
                          {club.status !== "suspended" && (
                            <button
                              onClick={() => quickStatus(club.id, "suspended")}
                              title="Suspend"
                              style={{
                                width: 30,
                                height: 30,
                                borderRadius: 8,
                                border: "1px solid #E5E7EB",
                                background: "white",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#F59E0B",
                              }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.background = "#FFFBEB")
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.background = "white")
                              }
                            >
                              <AlertTriangle size={13} />
                            </button>
                          )}
                          <button
                            onClick={() => setDeleteTarget(club)}
                            title="Delete"
                            style={{
                              width: 30,
                              height: 30,
                              borderRadius: 8,
                              border: "1px solid #E5E7EB",
                              background: "white",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#EF4444",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.background = "#FFF1F2")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.background = "white")
                            }
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {}
          <div
            style={{
              padding: "14px 20px",
              borderTop: "1px solid #F3F4F6",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <span style={{ fontSize: 13, color: "#6B7280" }}>
              Showing {Math.min((page - 1) * PER_PAGE + 1, filtered.length)}â€“
              {Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}{" "}
              clubs
            </span>
            <div style={{ display: "flex", gap: 6 }}>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  border: "1.5px solid #E5E7EB",
                  background: "white",
                  cursor: page === 1 ? "not-allowed" : "pointer",
                  opacity: page === 1 ? 0.4 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ChevronLeft size={14} color="#374151" />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    border: "1.5px solid",
                    borderColor: page === i + 1 ? "#0F62FE" : "#E5E7EB",
                    background: page === i + 1 ? "#0F62FE" : "white",
                    color: page === i + 1 ? "white" : "#374151",
                    fontSize: 13,
                    fontWeight: page === i + 1 ? 700 : 400,
                    cursor: "pointer",
                  }}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  border: "1.5px solid #E5E7EB",
                  background: "white",
                  cursor: page === totalPages ? "not-allowed" : "pointer",
                  opacity: page === totalPages ? 0.4 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ChevronRight size={14} color="#374151" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {}
      {detailClub && (
        <div style={{ position: "fixed", inset: 0, zIndex: 150 }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.45)",
            }}
            onClick={() => setDetailClub(null)}
          />
          <div
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              bottom: 0,
              width: "100%",
              maxWidth: 480,
              background: "white",
              boxShadow: "-20px 0 60px rgba(0,0,0,0.15)",
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
            }}
          >
            {}
            <div style={{ position: "relative", height: 200, flexShrink: 0 }}>
              <img
                src={detailClub.coverImage}
                alt={detailClub.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.1) 60%)",
                }}
              />
              <button
                onClick={() => setDetailClub(null)}
                style={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  background: "rgba(0,0,0,0.4)",
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backdropFilter: "blur(8px)",
                }}
              >
                <X size={16} />
              </button>
              <div style={{ position: "absolute", bottom: 16, left: 20 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 4,
                  }}
                >
                  <p
                    style={{
                      fontSize: 18,
                      fontWeight: 800,
                      color: "white",
                      margin: 0,
                    }}
                  >
                    {detailClub.name}
                  </p>
                  {detailClub.verified && (
                    <CheckCircle size={16} color="#22C55E" fill="#22C55E" />
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      padding: "3px 10px",
                      borderRadius: 100,
                      background: statusConfig[detailClub.status].bg,
                      color: statusConfig[detailClub.status].text,
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    {statusConfig[detailClub.status].label}
                  </span>
                  {detailClub.rating > 0 && (
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        background: "rgba(255,255,255,0.15)",
                        backdropFilter: "blur(8px)",
                        borderRadius: 100,
                        padding: "3px 10px",
                        color: "white",
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      <Star size={11} fill="#F59E0B" color="#F59E0B" />
                      {detailClub.rating}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {}
            <div style={{ padding: "24px", flex: 1 }}>
              {}
              <p
                style={{
                  fontSize: 14,
                  color: "#374151",
                  lineHeight: 1.75,
                  marginBottom: 20,
                }}
              >
                {detailClub.description}
              </p>

              {}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                  marginBottom: 20,
                }}
              >
                {[
                  { icon: MapPin, label: "City", value: detailClub.city },
                  {
                    icon: Users,
                    label: "Members",
                    value: detailClub.members.toLocaleString(),
                  },
                  {
                    icon: Clock,
                    label: "Hours",
                    value: detailClub.workingHours,
                  },
                  {
                    icon: TrendingUp,
                    label: "Subscription",
                    value:
                      "$" +
                      detailClub.priceFrom.toLocaleString() +
                      " / " +
                      (detailClub.subscriptionType === "yearly"
                        ? "year"
                        : "month"),
                  },
                  {
                    icon: Star,
                    label: "Rating",
                    value:
                      detailClub.rating > 0
                        ? `${detailClub.rating} (${detailClub.reviews})`
                        : "No reviews",
                  },
                  {
                    icon: Building2,
                    label: "Capacity",
                    value: `${detailClub.capacity} pax`,
                  },
                  {
                    icon: CheckCircle,
                    label: "Verified",
                    value: detailClub.verified
                      ? "âœ… Verified"
                      : "âŒ Unverified",
                  },
                  {
                    icon: Shield,
                    label: "Sub. Status",
                    value:
                      (detailClub.subscriptionStatus ?? "active")
                        .charAt(0)
                        .toUpperCase() +
                      (detailClub.subscriptionStatus ?? "active").slice(1),
                  },
                ].map((r) => (
                  <div
                    key={r.label}
                    style={{
                      background: "#F9FAFB",
                      borderRadius: 10,
                      padding: "12px 14px",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <r.icon size={14} color="#0F62FE" />
                    <div>
                      <p
                        style={{
                          fontSize: 10,
                          color: "#9CA3AF",
                          margin: 0,
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                        }}
                      >
                        {r.label}
                      </p>
                      <p
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#111827",
                          margin: 0,
                        }}
                      >
                        {r.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {}
              <div style={{ marginBottom: 20 }}>
                <h4
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#6B7280",
                    margin: "0 0 10px",
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  Contact & Location
                </h4>
                {[
                  { icon: MapPin, val: detailClub.address },
                  { icon: Phone, val: detailClub.phone },
                  { icon: Mail, val: detailClub.email },
                  { icon: Globe, val: detailClub.website },
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
                    <r.icon size={14} color="#9CA3AF" />
                    <span style={{ fontSize: 13, color: "#374151" }}>
                      {r.val}
                    </span>
                  </div>
                ))}
              </div>

              {}
              <div style={{ marginBottom: 20 }}>
                <h4
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#6B7280",
                    margin: "0 0 10px",
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  Sports Offered
                </h4>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {detailClub.sports.map((s) => (
                    <span
                      key={s}
                      style={{
                        padding: "4px 12px",
                        borderRadius: 100,
                        background: "#EFF4FF",
                        color: "#0F62FE",
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {}
              <div style={{ marginBottom: 24 }}>
                <h4
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#6B7280",
                    margin: "0 0 10px",
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  Facilities
                </h4>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {detailClub.facilities.map((f) => (
                    <span
                      key={f}
                      style={{
                        padding: "4px 12px",
                        borderRadius: 100,
                        background: "#F0FDF4",
                        color: "#22C55E",
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              {}
              <p style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 20 }}>
                Joined platform:{" "}
                <strong style={{ color: "#374151" }}>
                  {detailClub.joinedDate}
                </strong>
              </p>

              {}
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => openEdit(detailClub)}
                  style={{
                    flex: 1,
                    padding: "11px",
                    borderRadius: 12,
                    background: "linear-gradient(135deg, #0F62FE, #0043CE)",
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
                  <Edit size={14} /> Edit Club
                </button>
                <button
                  onClick={() => {
                    setDeleteTarget(detailClub);
                    setDetailClub(null);
                  }}
                  style={{
                    padding: "11px 18px",
                    borderRadius: 12,
                    background: "#FFF1F2",
                    color: "#EF4444",
                    fontSize: 14,
                    fontWeight: 700,
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                  }}
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
          onClick={() => closeModal()}
        >
          <div
            style={{
              background: "white",
              borderRadius: 20,
              width: "100%",
              maxWidth: 580,
              boxShadow: "0 24px 60px rgba(0,0,0,0.2)",
              display: "flex",
              flexDirection: "column",
              maxHeight: "90vh",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {}
            <div
              style={{
                padding: "20px 24px 0",
                borderBottom: "1px solid #F3F4F6",
                flexShrink: 0,
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
                    fontSize: 18,
                    fontWeight: 800,
                    color: "#111827",
                    margin: 0,
                  }}
                >
                  {modalTitle}
                </h3>
                <button
                  onClick={() => closeModal()}
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
                  <X size={15} color="#6B7280" />
                </button>
              </div>
              {}
              <div style={{ display: "flex", gap: 0 }}>
                {FORM_TABS.map((t, i) => (
                  <button
                    key={t}
                    onClick={() => setFormTab(i)}
                    style={{
                      padding: "10px 16px",
                      fontSize: 13,
                      fontWeight: formTab === i ? 700 : 500,
                      color: formTab === i ? "#0F62FE" : "#6B7280",
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                      borderBottom:
                        formTab === i
                          ? "2.5px solid #0F62FE"
                          : "2.5px solid transparent",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {i + 1}. {t}
                  </button>
                ))}
              </div>
            </div>

            {}
            <div style={{ padding: "24px", overflowY: "auto", flex: 1 }}>
              {}
              {formTab === 0 && (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 16 }}
                >
                  {}
                  <Field
                    label="Club Name *"
                    type="text"
                    value={formData.name}
                    onChange={(v) => fd("name", v)}
                    placeholder="e.g. Arena Sports Club"
                  />

                  {}
                  <div>
                    <label
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#374151",
                        display: "block",
                        marginBottom: 6,
                      }}
                    >
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => fd("description", e.target.value)}
                      placeholder="Brief description of the clubâ€¦"
                      style={{
                        width: "100%",
                        height: 88,
                        border: "1.5px solid #E5E7EB",
                        borderRadius: 10,
                        padding: "10px 12px",
                        fontSize: 13,
                        color: "#111827",
                        outline: "none",
                        resize: "none",
                        boxSizing: "border-box",
                        fontFamily: "inherit",
                        lineHeight: 1.6,
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#0F62FE")}
                      onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                    />
                  </div>

                  {}
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
                          marginBottom: 6,
                        }}
                      >
                        City *
                      </label>
                      <select
                        value={formData.city}
                        onChange={(e) => fd("city", e.target.value)}
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
                        <option value="">Select city</option>
                        {ALL_CITIES.map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <Field
                      label="Max Capacity"
                      type="number"
                      value={String(formData.capacity)}
                      onChange={(v) => fd("capacity", Number(v))}
                      placeholder="e.g. 200"
                    />
                  </div>

                  <Field
                    label="Address"
                    type="text"
                    value={formData.address}
                    onChange={(v) => fd("address", v)}
                    placeholder="123 Sports Ave, City, State ZIP"
                  />

                  <Field
                    label="Working Hours"
                    type="text"
                    value={formData.workingHours}
                    onChange={(v) => fd("workingHours", v)}
                    placeholder="e.g. 6AM â€“ 11PM"
                  />
                </div>
              )}

              {}
              {formTab === 1 && (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 22 }}
                >
                  {}
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 10,
                      }}
                    >
                      <label
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: "#374151",
                        }}
                      >
                        Sports Offered{" "}
                        <span style={{ fontWeight: 400, color: "#9CA3AF" }}>
                          ({formSports.length} selected)
                        </span>
                      </label>
                      <button
                        onClick={() => setShowControlModal(true)}
                        style={{
                          fontSize: 11,
                          color: "#22C55E",
                          fontWeight: 600,
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <Filter size={11} /> Manage list
                      </button>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {controlSports.map((s) => {
                        const active = formSports.includes(s);
                        return (
                          <button
                            key={s}
                            onClick={() => toggleFormSport(s)}
                            style={{
                              padding: "6px 14px",
                              borderRadius: 100,
                              border: active ? "none" : "1.5px solid #E5E7EB",
                              background: active ? "#0F62FE" : "white",
                              color: active ? "white" : "#374151",
                              fontSize: 12,
                              fontWeight: 500,
                              cursor: "pointer",
                              transition: "all 0.15s",
                            }}
                          >
                            {s}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {}
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 10,
                      }}
                    >
                      <label
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: "#374151",
                        }}
                      >
                        Facilities{" "}
                        <span style={{ fontWeight: 400, color: "#9CA3AF" }}>
                          ({formFacilities.length} selected)
                        </span>
                      </label>
                      <button
                        onClick={() => setShowControlModal(true)}
                        style={{
                          fontSize: 11,
                          color: "#22C55E",
                          fontWeight: 600,
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <Filter size={11} /> Manage list
                      </button>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {controlFacilities.map((f) => {
                        const active = formFacilities.includes(f);
                        return (
                          <button
                            key={f}
                            onClick={() => toggleFormFacility(f)}
                            style={{
                              padding: "6px 14px",
                              borderRadius: 100,
                              border: active ? "none" : "1.5px solid #E5E7EB",
                              background: active ? "#22C55E" : "white",
                              color: active ? "white" : "#374151",
                              fontSize: 12,
                              fontWeight: 500,
                              cursor: "pointer",
                              transition: "all 0.15s",
                            }}
                          >
                            {f}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {}
              {formTab === 2 && (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 14 }}
                >
                  <Field
                    label="Phone Number"
                    type="tel"
                    value={formData.phone}
                    onChange={(v) => fd("phone", v)}
                    placeholder="+1 (555) 000-0000"
                  />
                  <Field
                    label="Email Address *"
                    type="email"
                    value={formData.email}
                    onChange={(v) => fd("email", v)}
                    placeholder="info@yourclub.com"
                  />
                  <Field
                    label="Website"
                    type="text"
                    value={formData.website}
                    onChange={(v) => fd("website", v)}
                    placeholder="yourclub.com"
                  />
                  <Field
                    label="Date Joined Platform"
                    type="date"
                    value={formData.joinedDate}
                    onChange={(v) => fd("joinedDate", v)}
                    placeholder=""
                  />
                </div>
              )}

              {formTab === 3 && (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 18 }}
                >
                  {}
                  <div>
                    <label
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#374151",
                        display: "block",
                        marginBottom: 8,
                      }}
                    >
                      Billing Cycle
                    </label>
                    <div style={{ display: "flex", gap: 10 }}>
                      {[
                        {
                          val: "monthly",
                          label: "Monthly",
                          hint: "Charged every month",
                        },
                        {
                          val: "yearly",
                          label: "Yearly",
                          hint: "Save ~17% vs monthly",
                        },
                      ].map((opt) => {
                        const active = formData.subscriptionType === opt.val;
                        return (
                          <button
                            key={opt.val}
                            type="button"
                            onClick={() => fd("subscriptionType", opt.val)}
                            style={{
                              flex: 1,
                              padding: "12px 14px",
                              borderRadius: 12,
                              border: `2px solid ${active ? "#0F62FE" : "#E5E7EB"}`,
                              background: active ? "#EFF4FF" : "white",
                              cursor: "pointer",
                              transition: "all 0.2s",
                              textAlign: "left",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <div>
                              <p
                                style={{
                                  fontSize: 13,
                                  fontWeight: 700,
                                  color: active ? "#0F62FE" : "#374151",
                                  margin: 0,
                                }}
                              >
                                {opt.label}
                              </p>
                              <p
                                style={{
                                  fontSize: 11,
                                  color: "#9CA3AF",
                                  margin: "2px 0 0",
                                }}
                              >
                                {opt.hint}
                              </p>
                            </div>
                            <div
                              style={{
                                width: 18,
                                height: 18,
                                borderRadius: "50%",
                                border: `2px solid ${active ? "#0F62FE" : "#D1D5DB"}`,
                                background: active ? "#0F62FE" : "white",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                              }}
                            >
                              {active && (
                                <div
                                  style={{
                                    width: 7,
                                    height: 7,
                                    borderRadius: "50%",
                                    background: "white",
                                  }}
                                />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {}
                  <div>
                    <label
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#374151",
                        display: "block",
                        marginBottom: 6,
                      }}
                    >
                      Price{" "}
                      <span style={{ fontWeight: 400, color: "#9CA3AF" }}>
                        (
                        {formData.subscriptionType === "yearly"
                          ? "per year"
                          : "per month"}
                        )
                      </span>
                    </label>
                    <div style={{ position: "relative" }}>
                      <span
                        style={{
                          position: "absolute",
                          left: 13,
                          top: "50%",
                          transform: "translateY(-50%)",
                          fontSize: 16,
                          fontWeight: 700,
                          color: "#9CA3AF",
                          pointerEvents: "none",
                        }}
                      >
                        $
                      </span>
                      <input
                        type="number"
                        value={formData.priceFrom || ""}
                        onChange={(e) =>
                          fd("priceFrom", Number(e.target.value))
                        }
                        placeholder={
                          formData.subscriptionType === "yearly" ? "480" : "45"
                        }
                        style={{
                          width: "100%",
                          height: 44,
                          border: "1.5px solid #E5E7EB",
                          borderRadius: 10,
                          paddingLeft: 30,
                          paddingRight: 14,
                          fontSize: 15,
                          fontWeight: 600,
                          color: "#111827",
                          outline: "none",
                          boxSizing: "border-box",
                        }}
                        onFocus={(e) =>
                          (e.target.style.borderColor = "#0F62FE")
                        }
                        onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                      />
                    </div>
                    {formData.priceFrom > 0 && (
                      <p
                        style={{
                          fontSize: 11,
                          color: "#22C55E",
                          margin: "5px 0 0",
                          fontWeight: 600,
                        }}
                      >
                        {formData.subscriptionType === "yearly"
                          ? "â‰ˆ $" +
                            Math.round(formData.priceFrom / 12) +
                            "/mo Â· saves " +
                            Math.round(
                              100 -
                                (formData.priceFrom /
                                  (Math.round(formData.priceFrom / 12) * 12)) *
                                  100,
                            ) +
                            "% vs monthly"
                          : "$" +
                            formData.priceFrom * 12 +
                            "/yr if billed annually"}
                      </p>
                    )}
                  </div>

                  {}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 14,
                    }}
                  >
                    <div>
                      <label
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#374151",
                          display: "block",
                          marginBottom: 6,
                        }}
                      >
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={formData.subscriptionStartDate || ""}
                        onChange={(e) =>
                          fd("subscriptionStartDate", e.target.value)
                        }
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
                        onFocus={(e) =>
                          (e.target.style.borderColor = "#0F62FE")
                        }
                        onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#374151",
                          display: "block",
                          marginBottom: 6,
                        }}
                      >
                        End Date
                      </label>
                      <input
                        type="date"
                        value={formData.subscriptionEndDate || ""}
                        onChange={(e) =>
                          fd("subscriptionEndDate", e.target.value)
                        }
                        min={formData.subscriptionStartDate || undefined}
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
                        onFocus={(e) =>
                          (e.target.style.borderColor = "#0F62FE")
                        }
                        onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                      />
                    </div>
                  </div>

                  {}

                  {}
                  <div>
                    <label
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#374151",
                        display: "block",
                        marginBottom: 6,
                      }}
                    >
                      Club Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => fd("status", e.target.value)}
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
                      {(
                        [
                          "active",
                          "pending",
                          "inactive",
                          "suspended",
                        ] as ClubStatus[]
                      ).map((s) => (
                        <option key={s} value={s}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-end",
                      paddingBottom: 2,
                    }}
                  >
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={formData.verified}
                        onChange={(e) => fd("verified", e.target.checked)}
                        style={{
                          width: 16,
                          height: 16,
                          accentColor: "#22C55E",
                          cursor: "pointer",
                        }}
                      />
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#374151",
                        }}
                      >
                        Mark as Verified
                      </span>
                    </label>
                  </div>

                  {}
                  <div
                    style={{
                      background: "linear-gradient(135deg, #EFF4FF, #F5F3FF)",
                      border: "1.5px solid #BFDBFE",
                      borderRadius: 14,
                      padding: "16px 18px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 10,
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontSize: 11,
                          color: "#6B7280",
                          margin: 0,
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                          fontWeight: 600,
                        }}
                      >
                        Subscription Summary
                      </p>
                      <p
                        style={{
                          fontSize: 15,
                          fontWeight: 800,
                          color: "#0F62FE",
                          margin: "4px 0 0",
                        }}
                      >
                        {formData.subscriptionType === "yearly"
                          ? "Yearly"
                          : "Monthly"}{" "}
                        Subscription
                      </p>
                      {formData.priceFrom > 0 ? (
                        <>
                          {formData.subscriptionStatus && (
                            <span
                              style={{
                                display: "inline-block",
                                marginTop: 6,
                                padding: "2px 10px",
                                borderRadius: 100,
                                fontSize: 11,
                                fontWeight: 700,
                                background:
                                  formData.subscriptionStatus === "active"
                                    ? "#F0FDF4"
                                    : formData.subscriptionStatus === "paused"
                                      ? "#FFFBEB"
                                      : formData.subscriptionStatus ===
                                          "cancelled"
                                        ? "#FFF1F2"
                                        : "#F9FAFB",
                                color:
                                  formData.subscriptionStatus === "active"
                                    ? "#16A34A"
                                    : formData.subscriptionStatus === "paused"
                                      ? "#D97706"
                                      : formData.subscriptionStatus ===
                                          "cancelled"
                                        ? "#DC2626"
                                        : "#6B7280",
                              }}
                            >
                              {formData.subscriptionStatus
                                .charAt(0)
                                .toUpperCase() +
                                formData.subscriptionStatus.slice(1)}
                            </span>
                          )}
                          {formData.subscriptionStartDate &&
                            formData.subscriptionEndDate && (
                              <p
                                style={{
                                  fontSize: 12,
                                  color: "#6B7280",
                                  margin: "3px 0 0",
                                }}
                              >
                                {formData.subscriptionStartDate} â†’{" "}
                                {formData.subscriptionEndDate}
                              </p>
                            )}
                        </>
                      ) : (
                        <p
                          style={{
                            fontSize: 12,
                            color: "#6B7280",
                            margin: "8px 0 0",
                          }}
                        >
                          Enter a price to preview the subscription summary.
                        </p>
                      )}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
                      <p
                        style={{
                          fontSize: 24,
                          fontWeight: 900,
                          color: "#0F62FE",
                          margin: 0,
                        }}
                      >
                        {formData.priceFrom > 0
                          ? "$" + formData.priceFrom
                          : "$0"}
                      </p>
                      <button
                        type="button"
                        onClick={saveClub}
                        disabled={
                          !formData.name || !formData.city || !formData.email
                        }
                        style={{
                          padding: "12px 18px",
                          borderRadius: 10,
                          background:
                            !formData.name || !formData.city || !formData.email
                              ? "#E5E7EB"
                              : "#0F62FE",
                          color:
                            !formData.name || !formData.city || !formData.email
                              ? "#9CA3AF"
                              : "white",
                          fontWeight: 700,
                          border: "none",
                          cursor:
                            !formData.name || !formData.city || !formData.email
                              ? "not-allowed"
                              : "pointer",
                          boxShadow:
                            !formData.name || !formData.city || !formData.email
                              ? "none"
                              : "0 4px 12px rgba(15,98,254,0.3)",
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <Check size={14} /> Save Club
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {}
      {deleteTarget && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
          onClick={() => setDeleteTarget(null)}
        >
          <div
            style={{
              background: "white",
              borderRadius: 20,
              padding: "28px",
              maxWidth: 400,
              width: "100%",
              boxShadow: "0 24px 60px rgba(0,0,0,0.2)",
              textAlign: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "#FFF1F2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <AlertTriangle size={26} color="#EF4444" />
            </div>
            <h3
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: "#111827",
                margin: "0 0 8px",
              }}
            >
              Delete Club?
            </h3>
            <p
              style={{
                fontSize: 14,
                color: "#6B7280",
                margin: "0 0 6px",
                lineHeight: 1.6,
              }}
            >
              You're about to permanently delete{" "}
              <strong style={{ color: "#111827" }}>{deleteTarget.name}</strong>.
            </p>
            <p style={{ fontSize: 13, color: "#9CA3AF", margin: "0 0 24px" }}>
              This action cannot be undone. All club data, members, and bookings
              will be removed.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setDeleteTarget(null)}
                style={{
                  flex: 1,
                  padding: "11px",
                  borderRadius: 12,
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
                onClick={deleteClub}
                disabled={deleting}
                style={{
                  flex: 1,
                  padding: "11px",
                  borderRadius: 12,
                  background: "linear-gradient(135deg, #EF4444, #DC2626)",
                  color: "white",
                  fontSize: 14,
                  fontWeight: 700,
                  border: "none",
                  cursor: deleting ? "not-allowed" : "pointer",
                  boxShadow: "0 4px 12px rgba(239,68,68,0.35)",
                }}
              >
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {}
      {showControlModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
          onClick={() => setShowControlModal(false)}
        >
          <div
            style={{
              background: "white",
              borderRadius: 20,
              width: "100%",
              maxWidth: 560,
              maxHeight: "88vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 24px 60px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {}
            <div
              style={{
                padding: "20px 24px",
                borderBottom: "1px solid #F3F4F6",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              <div>
                <h3
                  style={{
                    fontSize: 17,
                    fontWeight: 800,
                    color: "#111827",
                    margin: 0,
                  }}
                >
                  Control Sports & Facilities
                </h3>
                <p
                  style={{ fontSize: 12, color: "#6B7280", margin: "3px 0 0" }}
                >
                  Add or remove items from the global list used in all club
                  forms
                </p>
              </div>
              <button
                onClick={() => setShowControlModal(false)}
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
                <X size={15} color="#6B7280" />
              </button>
            </div>

            {}
            <div
              style={{
                overflowY: "auto",
                flex: 1,
                padding: "20px 24px",
                display: "flex",
                flexDirection: "column",
                gap: 24,
              }}
            >
              {}
              <div>
                <label
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#374151",
                    display: "block",
                    marginBottom: 10,
                  }}
                >
                  Sports{" "}
                  <span style={{ fontWeight: 400, color: "#9CA3AF" }}>
                    ({controlSports.length} items)
                  </span>
                </label>
                {}
                <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                  <input
                    value={newControlSport}
                    onChange={(e) => setNewControlSport(e.target.value)}
                    onKeyDown={async (e) => {
                      if (e.key !== "Enter") return;
                      e.preventDefault();
                      await handleAddControlSport();
                    }}
                    placeholder="Type a new sport and press Enterâ€¦"
                    style={{
                      flex: 1,
                      height: 38,
                      border: "1.5px solid #E5E7EB",
                      borderRadius: 9,
                      padding: "0 12px",
                      fontSize: 13,
                      color: "#111827",
                      outline: "none",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#0F62FE")}
                    onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                  />
                  <button
                    onClick={handleAddControlSport}
                    style={{
                      padding: "0 16px",
                      height: 38,
                      borderRadius: 9,
                      background: "#0F62FE",
                      color: "white",
                      fontSize: 13,
                      fontWeight: 600,
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    + Add
                  </button>
                </div>
                {}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {controlSports.map((s) => (
                    <div
                      key={s}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        padding: "5px 10px 5px 14px",
                        borderRadius: 100,
                        background: "#EFF4FF",
                        border: "1px solid #BFDBFE",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 500,
                          color: "#0F62FE",
                        }}
                      >
                        {s}
                      </span>
                      <button
                        onClick={async () => {
                          try {
                            const name = s;
                            const res = await axios.delete(
                              `${API_BASE_URL}/club/sports`,
                              {
                                params: { name },
                                headers: getAuthHeaders(),
                              },
                            );
                            const json = res.data;
                            if (json?.success === false) {
                              throw new Error(json?.message || "Delete failed");
                            }
                            setControlSports((ss) => ss.filter((x) => x !== s));
                            setFormSports((fs) => fs.filter((x) => x !== s));
                          } catch (err) {
                            console.error("Delete sport failed", err);
                            alert(
                              err instanceof Error
                                ? err.message
                                : "Failed to delete sport",
                            );
                          }
                        }}
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: "50%",
                          border: "none",
                          background: "#0F62FE",
                          color: "white",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 10,
                          lineHeight: 1,
                          flexShrink: 0,
                        }}
                      >
                        âœ•
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {}
              <div>
                <label
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#374151",
                    display: "block",
                    marginBottom: 10,
                  }}
                >
                  Facilities{" "}
                  <span style={{ fontWeight: 400, color: "#9CA3AF" }}>
                    ({controlFacilities.length} items)
                  </span>
                </label>
                {}
                <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                  <input
                    value={newControlFacility}
                    onChange={(e) => setNewControlFacility(e.target.value)}
                    onKeyDown={async (e) => {
                      if (e.key !== "Enter") return;
                      e.preventDefault();
                      await handleAddControlFacility();
                    }}
                    placeholder="Type a new facility and press Enterâ€¦"
                    style={{
                      flex: 1,
                      height: 38,
                      border: "1.5px solid #E5E7EB",
                      borderRadius: 9,
                      padding: "0 12px",
                      fontSize: 13,
                      color: "#111827",
                      outline: "none",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#22C55E")}
                    onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                  />
                  <button
                    onClick={handleAddControlFacility}
                    style={{
                      padding: "0 16px",
                      height: 38,
                      borderRadius: 9,
                      background: "#22C55E",
                      color: "white",
                      fontSize: 13,
                      fontWeight: 600,
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    + Add
                  </button>
                </div>
                {}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {controlFacilities.map((f) => (
                    <div
                      key={f}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        padding: "5px 10px 5px 14px",
                        borderRadius: 100,
                        background: "#F0FDF4",
                        border: "1px solid #BBF7D0",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 500,
                          color: "#16A34A",
                        }}
                      >
                        {f}
                      </span>
                      <button
                        onClick={async () => {
                          try {
                            const name = f;
                            const res = await axios.delete(
                              `${API_BASE_URL}/club/facility`,
                              {
                                params: { name },
                                headers: getAuthHeaders(),
                              },
                            );
                            const json = res.data;
                            if (json?.success === false) {
                              throw new Error(json?.message || "Delete failed");
                            }
                            setControlFacilities((fs) =>
                              fs.filter((x) => x !== f),
                            );
                            setFormFacilities((ff) =>
                              ff.filter((x) => x !== f),
                            );
                          } catch (err) {
                            console.error("Delete facility failed", err);
                            alert(
                              err instanceof Error
                                ? err.message
                                : "Failed to delete facility",
                            );
                          }
                        }}
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: "50%",
                          border: "none",
                          background: "#22C55E",
                          color: "white",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 10,
                          lineHeight: 1,
                          flexShrink: 0,
                        }}
                      >
                        âœ•
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {}
            <div
              style={{
                padding: "16px 24px",
                borderTop: "1px solid #F3F4F6",
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
                flexShrink: 0,
              }}
            >
              <button
                onClick={() => {
                  setControlSports([...ALL_SPORTS]);
                  setControlFacilities([...ALL_FACILITIES]);
                }}
                style={{
                  padding: "9px 16px",
                  borderRadius: 10,
                  border: "1.5px solid #E5E7EB",
                  background: "white",
                  color: "#374151",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Reset to Default
              </button>
              <button
                onClick={() => setShowControlModal(false)}
                style={{
                  padding: "9px 22px",
                  borderRadius: 10,
                  background: "linear-gradient(135deg, #0F62FE, #0043CE)",
                  color: "white",
                  fontSize: 13,
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(15,98,254,0.3)",
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  type,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: "#374151",
          display: "block",
          marginBottom: 6,
        }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
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
  );
}
