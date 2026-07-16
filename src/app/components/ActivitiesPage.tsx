import { useEffect, useState } from "react";
import axios from "axios";
import {
  Plus,
  Upload,
  Download,
  Filter,
  Search,
  Grid,
  List,
  Calendar,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Copy,
  Users,
  Clock,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { DashboardLayout } from "./DashboardLayout";
import { Page } from "./Navbar";
import { useClubId } from "../utils/club";

const IMGS = {
  football:
    "https://images.unsplash.com/photo-1679391029864-d46f366a456b?w=400&q=80",
  basketball:
    "https://images.unsplash.com/photo-1590227632180-80a3bf110871?w=400&q=80",
  swimming:
    "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&q=80",
  gym: "https://images.unsplash.com/photo-1775993703558-e7afab02b7bd?w=400&q=80",
  tennis:
    "https://images.unsplash.com/photo-1545151414-8a948e1ea54f?w=400&q=80",
  yoga: "https://images.unsplash.com/photo-1554245064-3ab88761ac5d?w=400&q=80",
  footballField:
    "https://images.unsplash.com/photo-1676746424139-77f8bd8922a8?w=400&q=80",
  gym2: "https://images.unsplash.com/photo-1761971975769-97e598bf526b?w=400&q=80",
};

const API_BASE_URL =
  ((import.meta as any).env?.VITE_API_URL as string) || "http://localhost:4000";

const initialActivities = [];

const calendarDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const calendarSlots = [];

interface ActivitiesPageProps {
  navigate: (page: Page) => void;
}

type Activity = (typeof initialActivities)[number] & {
  slotDetails?: SlotOption[];
};

interface ActivityFormData {
  name: string;
  coach: string;
  price: string;
  category: string;
}

const emptyForm: ActivityFormData = {
  name: "",
  coach: "",
  price: "",
  category: "Football",
};

const buildActivityPayload = (formData: ActivityFormData) => ({
  name: formData.name,
  coach_name: formData.coach,
  price: Number(formData.price) || 0,
  category: formData.category,
});

const mapActivityToUi = (activity: any): Activity => ({
  id: activity.id,
  name: activity.name ?? "Untitled Activity",
  image: activity.image || IMGS.gym,
  coach: activity.coach_name || activity.coach || "TBD",
  capacity: activity.capacity ?? 10,
  slots: Array.isArray(activity.slots)
    ? activity.slots.length
    : Number(activity.slots ?? 10),
  slotDetails: Array.isArray(activity.slots) ? activity.slots : [],
  price: Number(activity.price ?? 0),
  schedule: activity.schedule || "TBD",
  status: activity.status || "active",
  category: activity.category || "Football",
  duration: activity.duration || "60 min",
  rating: activity.rating || 5,
});

interface SlotOption {
  id: number;
  start_time: string;
  end_time: string;
  is_booked: boolean;
  isNew?: boolean;
  [key: string]: any;
}

const getAuthHeaders = (): Record<string, string> => {
  if (typeof window === "undefined") return { Accept: "application/json" };
  const token = window.localStorage.getItem("token");
  const headers: Record<string, string> = { Accept: "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
};

export function ActivitiesPage({ navigate }: ActivitiesPageProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [viewMode, setViewMode] = useState<"card" | "table" | "calendar">(
    "card",
  );
  const [searchQ, setSearchQ] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [formData, setFormData] = useState<ActivityFormData>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null,
  );
  const [activitySlots, setActivitySlots] = useState<SlotOption[]>([]);
  const [modalSlots, setModalSlots] = useState<SlotOption[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [bookingMessage, setBookingMessage] = useState("");
  const [bookingInProgressId, setBookingInProgressId] = useState<number | null>(
    null,
  );
  const [newSlotStart, setNewSlotStart] = useState("");
  const [newSlotEnd, setNewSlotEnd] = useState("");
  const [slotActionMessage, setSlotActionMessage] = useState("");
  const [slotCreating, setSlotCreating] = useState(false);
  const clubId = useClubId();

  const categories = [
    "All",
    "Football",
    "Basketball",
    "Swimming",
    "Gym",
    "Tennis",
    "Yoga",
    "Karate",
    "Padel",
  ];

  const loadActivities = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/club/${clubId}/activity`,
      );
      const list = Array.isArray(response?.data?.data)
        ? response.data.data
        : [];
      setActivities(list.map(mapActivityToUi));
      setErrorMessage("");
    } catch (error) {
      console.error("Failed to load activities", error);
      setErrorMessage("Failed to load activities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadActivities();
  }, [clubId]);

  const filtered = activities.filter((a) => {
    const matchSearch =
      a.name.toLowerCase().includes(searchQ.toLowerCase()) ||
      a.coach.toLowerCase().includes(searchQ.toLowerCase());
    const matchCat = filterCat === "All" || a.category === filterCat;
    const matchStatus = filterStatus === "All" || a.status === filterStatus;
    return matchSearch && matchCat && matchStatus;
  });

  const openEditModal = (act: Activity) => {
    setEditingActivity(act);
    setFormData({
      name: act.name,
      coach: act.coach,
      price: String(act.price),
      category: act.category,
    });
    setModalSlots(Array.isArray(act.slotDetails) ? act.slotDetails : []);
    setNewSlotStart("");
    setNewSlotEnd("");
    setSlotActionMessage("");
    setShowAddModal(true);
  };

  const openAddModal = () => {
    setEditingActivity(null);
    setFormData(emptyForm);
    setModalSlots([]);
    setNewSlotStart("");
    setNewSlotEnd("");
    setSlotActionMessage("");
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingActivity(null);
    setFormData(emptyForm);
    setModalSlots([]);
    setNewSlotStart("");
    setNewSlotEnd("");
    setSlotActionMessage("");
  };

  const openSlotModal = async (activity: Activity) => {
    setSelectedActivity(activity);
    setBookingMessage("");
    setSlotsLoading(true);

    try {
      const response = await axios.get(
        `${API_BASE_URL}/club/${clubId}/activity/${activity.id}/slots`,
        { headers: getAuthHeaders() },
      );
      const list = Array.isArray(response?.data?.data)
        ? response.data.data
        : [];
      setActivitySlots(list);
    } catch (error) {
      console.error("Failed to load slots", error);
      setActivitySlots([]);
      setBookingMessage("Failed to load slots for this activity.");
    } finally {
      setSlotsLoading(false);
    }
  };

  const handleBookSlot = async (slot: SlotOption) => {
    if (!selectedActivity) return;

    const token = window.localStorage.getItem("token");
    if (!token) {
      setBookingMessage("Please sign in before booking a slot.");
      return;
    }

    try {
      setBookingInProgressId(slot.id);
      const response = await axios.post(
        `${API_BASE_URL}/club/${clubId}/activity/${selectedActivity.id}/slot/${slot.id}/book`,
        { headers: getAuthHeaders() },
      );

      if (response?.data?.success) {
        setBookingMessage(response.data.message || "Slot booked successfully.");
        await openSlotModal(selectedActivity);
      } else {
        setBookingMessage(response?.data?.message || "Booking failed.");
      }
    } catch (error: any) {
      console.error("Failed to book slot", error);
      setBookingMessage(
        error?.response?.data?.message || "Failed to book slot.",
      );
    } finally {
      setBookingInProgressId(null);
    }
  };

  const handleDeleteActivity = async (activityId: number) => {
    try {
      await axios.delete(
        `${API_BASE_URL}/club/${clubId}/activity/${activityId}`,
        { headers: getAuthHeaders() },
      );
      await loadActivities();
    } catch (error) {
      console.error("Failed to delete activity", error);
      alert("Failed to delete activity");
    }
  };

  const createActivity = async () => {
    try {
      const payload = buildActivityPayload(formData);
      const response = await axios.post(
        `${API_BASE_URL}/club/${clubId}/activity`,
        payload,
      );
      const saved = mapActivityToUi(response?.data?.data);
      await loadActivities();
      return saved;
    } catch (error) {
      console.error("Failed to create activity", error);
      setSlotActionMessage("Failed to create activity before adding slot.");
      return null;
    }
  };

  const updateActivity = async () => {
    if (!editingActivity) return null;

    try {
      const payload = buildActivityPayload(formData);
      const response = await axios.put(
        `${API_BASE_URL}/club/${clubId}/activity/${editingActivity.id}`,
        payload,
      );
      const updated = mapActivityToUi(response?.data?.data);
      await loadActivities();
      return updated;
    } catch (error) {
      console.error("Failed to update activity", error);
      setSlotActionMessage("Failed to update activity before adding slot.");
      return null;
    }
  };

  const savePendingSlots = async (activityId: number) => {
    const pendingSlots = modalSlots.filter((slot) => slot.isNew);
    if (pendingSlots.length === 0) return;

    for (const slot of pendingSlots) {
      try {
        await axios.post(
          `${API_BASE_URL}/club/${clubId}/activity/${activityId}/slot`,
          {
            start_time: slot.start_time,
            end_time: slot.end_time,
          },
          { headers: getAuthHeaders() },
        );
      } catch (error) {
        console.error("Failed to save pending slot", error);
      }
    }
  };

  const handleSave = async () => {
    try {
      let savedActivity = editingActivity;

      if (editingActivity) {
        savedActivity = await updateActivity();
      } else {
        savedActivity = await createActivity();
      }

      if (savedActivity && modalSlots.some((slot) => slot.isNew)) {
        await savePendingSlots(savedActivity.id);
      }

      closeModal();
    } catch (error) {
      console.error("Failed to save activity", error);
      alert("Failed to save activity");
    }
  };

  const handleAddSlot = async () => {
    setSlotActionMessage("");

    if (!newSlotStart || !newSlotEnd) {
      setSlotActionMessage("Enter both start time and end time.");
      return;
    }

    if (editingActivity?.id) {
      try {
        setSlotCreating(true);
        const response = await axios.post(
          `${API_BASE_URL}/club/${clubId}/activity/${editingActivity.id}/slot`,
          {
            start_time: newSlotStart,
            end_time: newSlotEnd,
          },
          { headers: getAuthHeaders() },
        );

        if (response?.data?.success) {
          setModalSlots((prev) => [
            ...prev,
            {
              ...response.data.data,
              is_booked: false,
            },
          ]);
          await loadActivities();
          setSlotActionMessage("Slot added successfully.");
          setNewSlotStart("");
          setNewSlotEnd("");
        } else {
          setSlotActionMessage(
            response?.data?.message || "Failed to add slot.",
          );
        }
      } catch (error) {
        console.error("Failed to add slot", error);
        setSlotActionMessage("Failed to add slot.");
      } finally {
        setSlotCreating(false);
      }
    } else {
      const tempSlot: SlotOption = {
        id: -Date.now(),
        start_time: newSlotStart,
        end_time: newSlotEnd,
        is_booked: false,
        isNew: true,
      };
      setModalSlots((prev) => [...prev, tempSlot]);
      setNewSlotStart("");
      setNewSlotEnd("");
      setSlotActionMessage("Slot queued until activity is saved.");
    }
  };

  const handleRemoveSlot = async (slot: SlotOption) => {
    if (slot.isNew) {
      setModalSlots((prev) => prev.filter((item) => item.id !== slot.id));
      return;
    }

    if (!editingActivity?.id) return;

    try {
      setSlotCreating(true);
      await axios.delete(
        `$${API_BASE_URL}/club/$${clubId}/activity/$${editingActivity.id}/slot/$${slot.id}`,
        { headers: getAuthHeaders() },
      );
      setModalSlots((prev) => prev.filter((item) => item.id !== slot.id));
      await loadActivities();
      setSlotActionMessage("Slot removed successfully.");
    } catch (error) {
      console.error("Failed to remove slot", error);
      setSlotActionMessage("Failed to remove slot.");
    } finally {
      setSlotCreating(false);
    }
  };

  const ActionMenu = ({
    act,
    onEdit,
    onDelete,
  }: {
    act: Activity;
    onEdit: (act: Activity) => void;
    onDelete: (id: number) => void;
  }) => {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ position: "relative" }}>
        <button
          onClick={() => setOpen(!open)}
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
          }}
        >
          <MoreHorizontal size={15} color="#6B7280" />
        </button>
        {open && (
          <div
            style={{
              position: "absolute",
              right: 0,
              top: 36,
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
              {
                icon: Eye,
                label: "View Details",
                color: "#374151",
                action: () => {},
              },
              {
                icon: Edit,
                label: "Edit",
                color: "#0F62FE",
                action: () => onEdit(act),
              },
              {
                icon: Copy,
                label: "Duplicate",
                color: "#8B5CF6",
                action: () => {},
              },
              {
                icon: Trash2,
                label: "Delete",
                color: "#EF4444",
                action: () => onDelete(act.id),
              },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  item.action();
                  setOpen(false);
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
                  color: item.color,
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
                <item.icon size={14} color={item.color} />
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <DashboardLayout navigate={navigate} currentPage="activities">
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
            Activities
          </h1>
          <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>
            Manage all sports activities in your club
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            style={{
              padding: "9px 16px",
              borderRadius: 10,
              border: "1.5px solid #E5E7EB",
              background: "white",
              color: "#374151",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Upload size={14} /> Import
          </button>
          <button
            style={{
              padding: "9px 16px",
              borderRadius: 10,
              border: "1.5px solid #E5E7EB",
              background: "white",
              color: "#374151",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Download size={14} /> Export
          </button>
          <button
            onClick={openAddModal}
            style={{
              padding: "9px 18px",
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
            <Plus size={14} /> Add Activity
          </button>
        </div>
      </div>

      <div
        style={{
          background: "white",
          borderRadius: 14,
          padding: "16px 20px",
          marginBottom: 20,
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <div style={{ position: "relative", flex: 1, minWidth: 180 }}>
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
            onChange={(e) => setSearchQ(e.target.value)}
            placeholder="Search activities, coaches..."
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

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {categories.slice(0, 5).map((c) => (
            <button
              key={c}
              onClick={() => setFilterCat(c)}
              style={{
                padding: "6px 14px",
                borderRadius: 100,
                border: filterCat === c ? "none" : "1.5px solid #E5E7EB",
                background: filterCat === c ? "#0F62FE" : "white",
                color: filterCat === c ? "white" : "#374151",
                fontSize: 12,
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {c}
            </button>
          ))}
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
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
          <option value="All">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <div
          style={{
            display: "flex",
            background: "#F3F4F6",
            borderRadius: 10,
            padding: 3,
            gap: 2,
          }}
        >
          {(
            [
              ["card", Grid],
              ["table", List],
              ["calendar", Calendar],
            ] as const
          ).map(([mode, Icon]) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              style={{
                width: 34,
                height: 32,
                borderRadius: 8,
                border: "none",
                background: viewMode === mode ? "white" : "transparent",
                color: viewMode === mode ? "#0F62FE" : "#6B7280",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow:
                  viewMode === mode ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
                transition: "all 0.2s",
              }}
            >
              <Icon size={15} />
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ marginBottom: 16, color: "#6B7280", fontSize: 13 }}>
          Loading activities...
        </div>
      ) : null}

      {errorMessage ? (
        <div style={{ marginBottom: 16, color: "#DC2626", fontSize: 13 }}>
          {errorMessage}
        </div>
      ) : null}

      {viewMode === "card" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 20,
          }}
        >
          {filtered.map((act) => (
            <div
              key={act.id}
              style={{
                background: "white",
                borderRadius: 16,
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
                <img
                  src={act.image}
                  alt={act.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
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
                    background: act.status === "active" ? "#22C55E" : "#6B7280",
                    color: "white",
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  {act.status === "active" ? "Active" : "Inactive"}
                </span>
                <div style={{ position: "absolute", top: 8, right: 8 }}>
                  <ActionMenu
                    act={act}
                    onEdit={openEditModal}
                    onDelete={handleDeleteActivity}
                  />
                </div>
              </div>
              <div style={{ padding: "16px" }}>
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
                  style={{ fontSize: 12, color: "#6B7280", margin: "0 0 12px" }}
                >
                  ðŸ‘¤ {act.coach}
                </p>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 8,
                    marginBottom: 12,
                  }}
                >
                  <div
                    style={{
                      background: "#F9FAFB",
                      borderRadius: 8,
                      padding: "8px 10px",
                    }}
                  >
                    <p style={{ fontSize: 10, color: "#9CA3AF", margin: 0 }}>
                      Capacity
                    </p>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#111827",
                        margin: 0,
                      }}
                    >
                      {act.slots}/{act.capacity} slots
                    </p>
                  </div>
                  <div
                    style={{
                      background: "#F9FAFB",
                      borderRadius: 8,
                      padding: "8px 10px",
                    }}
                  >
                    <p style={{ fontSize: 10, color: "#9CA3AF", margin: 0 }}>
                      Price
                    </p>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#0F62FE",
                        margin: 0,
                      }}
                    >
                      ${act.price}/session
                    </p>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 10,
                  }}
                >
                  <Clock size={12} color="#9CA3AF" />
                  <span style={{ fontSize: 12, color: "#6B7280" }}>
                    {act.slots > 0 ? `$${act.slots} slots` : "No slots"}
                  </span>
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
                        act.slots / act.capacity > 0.8
                          ? "#22C55E"
                          : act.slots / act.capacity > 0.5
                            ? "#F59E0B"
                            : "#EF4444",
                      width: `$${(act.slots / act.capacity) * 100}%`,
                    }}
                  />
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    onClick={() => handleDeleteActivity(act.id)}
                    style={{
                      flex: 1,
                      padding: "7px",
                      borderRadius: 8,
                      background: "#FEE2E2",
                      color: "#991B1B",
                      fontSize: 12,
                      fontWeight: 600,
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 4,
                    }}
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                  <button
                    onClick={() => openEditModal(act)}
                    style={{
                      flex: 1,
                      padding: "7px",
                      borderRadius: 8,
                      background: "#0F62FE",
                      color: "white",
                      fontSize: 12,
                      fontWeight: 600,
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 4,
                    }}
                  >
                    <Edit size={12} /> Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedActivity && (
        <div
          onClick={() => {
            setSelectedActivity(null);
            setActivitySlots([]);
            setBookingMessage("");
          }}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: 24,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 520,
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
                marginBottom: 12,
              }}
            >
              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 28,
                    color: "#0F62FE",
                    fontWeight: 800,
                  }}
                >
                  {activitySlots.filter((slot) => !slot.is_booked).length}
                </p>
                <h3
                  style={{ margin: "4px 0 0", fontSize: 20, color: "#111827" }}
                >
                  {selectedActivity.name}
                </h3>
              </div>
              <button
                onClick={() => {
                  setSelectedActivity(null);
                  setActivitySlots([]);
                  setBookingMessage("");
                }}
                style={{
                  border: "none",
                  background: "#F3F4F6",
                  borderRadius: 999,
                  width: 32,
                  height: 32,
                  cursor: "pointer",
                  fontSize: 16,
                  color: "#374151",
                }}
              >
                ✕
              </button>
            </div>

            <p style={{ margin: "0 0 16px", fontSize: 13, color: "#6B7280" }}>
              Choose a slot and confirm your booking.
            </p>

            {bookingMessage && (
              <div
                style={{
                  marginBottom: 12,
                  padding: "10px 12px",
                  borderRadius: 10,
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
            )}

            {slotsLoading ? (
              <div style={{ color: "#6B7280", fontSize: 14 }}>
                Loading slots...
              </div>
            ) : activitySlots.length === 0 ? (
              <div style={{ color: "#6B7280", fontSize: 14 }}>
                No slots are available for this activity yet.
              </div>
            ) : (
              <div style={{ display: "grid", gap: 10 }}>
                {activitySlots.map((slot) => (
                  <div
                    key={slot.id}
                    style={{
                      border: "1px solid #E5E7EB",
                      borderRadius: 12,
                      padding: "12px 14px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 700,
                          color: "#111827",
                        }}
                      >
                        {slot.start_time} - {slot.end_time}
                      </div>
                      <div
                        style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}
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
                        padding: "8px 12px",
                        borderRadius: 10,
                        border: "none",
                        background: slot.is_booked ? "#E5E7EB" : "#0F62FE",
                        color: slot.is_booked ? "#6B7280" : "white",
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: slot.is_booked ? "not-allowed" : "pointer",
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

      {viewMode === "table" && (
        <div
          style={{
            background: "white",
            borderRadius: 16,
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            overflow: "hidden",
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr
                  style={{
                    background: "#F9FAFB",
                    borderBottom: "1px solid #E5E7EB",
                  }}
                >
                  {[
                    "Activity",
                    "Coach",
                    "Schedule",
                    "Capacity",
                    "Price",
                    "Status",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "12px 16px",
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#6B7280",
                        textAlign: "left",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((act, i) => (
                  <tr
                    key={act.id}
                    style={{
                      borderBottom:
                        i < filtered.length - 1 ? "1px solid #F3F4F6" : "none",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#FAFBFF")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <td style={{ padding: "14px 16px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                        }}
                      >
                        <img
                          src={act.image}
                          alt={act.name}
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 10,
                            objectFit: "cover",
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
                            {act.name}
                          </p>
                          <p
                            style={{
                              fontSize: 11,
                              color: "#9CA3AF",
                              margin: 0,
                            }}
                          >
                            {act.category}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "14px 16px",
                        fontSize: 13,
                        color: "#374151",
                      }}
                    >
                      {act.coach}
                    </td>
                    <td
                      style={{
                        padding: "14px 16px",
                        fontSize: 13,
                        color: "#374151",
                      }}
                    >
                      {act.schedule}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div>
                        <p
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "#111827",
                            margin: "0 0 4px",
                          }}
                        >
                          {act.slots}/{act.capacity}
                        </p>
                        <div
                          style={{
                            height: 4,
                            background: "#F3F4F6",
                            borderRadius: 100,
                            width: 80,
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              borderRadius: 100,
                              background: "#22C55E",
                              width: `${(act.slots / act.capacity) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "14px 16px",
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#0F62FE",
                      }}
                    >
                      $${act.price}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span
                        style={{
                          padding: "4px 12px",
                          borderRadius: 100,
                          background:
                            act.status === "active" ? "#F0FDF4" : "#F9FAFB",
                          color:
                            act.status === "active" ? "#22C55E" : "#6B7280",
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        {act.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        {[
                          {
                            Icon: Eye,
                            action: () => void openSlotModal(act),
                          },
                          { Icon: Edit, action: () => openEditModal(act) },
                          { Icon: Copy, action: () => {} },
                          {
                            Icon: Trash2,
                            action: () => handleDeleteActivity(act.id),
                          },
                        ].map(({ Icon, action }, idx) => (
                          <button
                            key={idx}
                            onClick={action}
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
                              color: idx === 3 ? "#EF4444" : "#374151",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.background = "#F9FAFB")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.background = "white")
                            }
                          >
                            <Icon size={13} />
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {}
      {viewMode === "calendar" && (
        <div
          style={{
            background: "white",
            borderRadius: 16,
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            overflow: "hidden",
          }}
        >
          {}
          <div
            style={{
              padding: "20px 24px",
              borderBottom: "1px solid #E5E7EB",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3
              style={{
                fontSize: 17,
                fontWeight: 700,
                color: "#111827",
                margin: 0,
              }}
            >
              June 29 â€“ July 5, 2026
            </h3>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  border: "1.5px solid #E5E7EB",
                  background: "white",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ChevronLeft size={16} color="#374151" />
              </button>
              <button
                style={{
                  padding: "0 16px",
                  height: 34,
                  borderRadius: 10,
                  border: "1.5px solid #E5E7EB",
                  background: "#EFF4FF",
                  color: "#0F62FE",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Today
              </button>
              <button
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  border: "1.5px solid #E5E7EB",
                  background: "white",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ChevronRight size={16} color="#374151" />
              </button>
            </div>
          </div>
          {}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              borderBottom: "1px solid #E5E7EB",
            }}
          >
            {calendarDays.map((d, i) => (
              <div
                key={d}
                style={{
                  padding: "12px 8px",
                  textAlign: "center",
                  borderRight: i < 6 ? "1px solid #F3F4F6" : "none",
                }}
              >
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#9CA3AF",
                    textTransform: "uppercase",
                    margin: "0 0 4px",
                  }}
                >
                  {d}
                </p>
                <p
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: i === 0 ? "#0F62FE" : "#111827",
                    margin: 0,
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    background: i === 0 ? "#EFF4FF" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {29 + i}
                </p>
              </div>
            ))}
          </div>
          {}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              minHeight: 300,
            }}
          >
            {[0, 1, 2, 3, 4, 5, 6].map((dayIdx) => (
              <div
                key={dayIdx}
                style={{
                  padding: "10px 8px",
                  borderRight: dayIdx < 6 ? "1px solid #F3F4F6" : "none",
                  minHeight: 280,
                }}
              >
                {calendarSlots
                  .filter((s) => s.day === dayIdx)
                  .map((slot, si) => (
                    <div
                      key={si}
                      style={{
                        background: `${slot.color}15`,
                        border: `1.5px solid ${slot.color}40`,
                        borderRadius: 8,
                        padding: "6px 8px",
                        marginBottom: 6,
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = `${slot.color}25`)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = `${slot.color}15`)
                      }
                    >
                      <p
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: slot.color,
                          margin: 0,
                        }}
                      >
                        {slot.time}
                      </p>
                      <p
                        style={{
                          fontSize: 11,
                          color: "#374151",
                          margin: "2px 0 0",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {slot.name}
                      </p>
                    </div>
                  ))}
                <button
                  style={{
                    width: "100%",
                    padding: "6px",
                    borderRadius: 8,
                    border: "1.5px dashed #E5E7EB",
                    background: "transparent",
                    color: "#9CA3AF",
                    fontSize: 12,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4,
                  }}
                >
                  <Plus size={12} /> Add
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {showAddModal && (
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
              maxWidth: 480,
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
                {editingActivity
                  ? `Edit Activity â€” ${editingActivity.name}`
                  : "Add New Activity"}
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
                }}
              >
                âœ•
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
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
                  Activity Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Football 5v5"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, name: e.target.value }))
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
                  onFocus={(e) => (e.target.style.borderColor = "#0F62FE")}
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
                  Coach
                </label>
                <input
                  type="text"
                  placeholder="Coach name"
                  value={formData.coach}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, coach: e.target.value }))
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
                  onFocus={(e) => (e.target.style.borderColor = "#0F62FE")}
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
                  Price per Session ($)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, price: e.target.value }))
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
                  onFocus={(e) => (e.target.style.borderColor = "#0F62FE")}
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
                  Sport Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, category: e.target.value }))
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
                    background: "white",
                    boxSizing: "border-box",
                  }}
                >
                  {[
                    "Football",
                    "Basketball",
                    "Swimming",
                    "Gym",
                    "Tennis",
                    "Yoga",
                    "Karate",
                    "Padel",
                  ].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
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
                    Slot start time
                  </label>
                  <input
                    type="time"
                    value={newSlotStart}
                    onChange={(e) => setNewSlotStart(e.target.value)}
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
                      marginBottom: 6,
                    }}
                  >
                    Slot end time
                  </label>
                  <input
                    type="time"
                    value={newSlotEnd}
                    onChange={(e) => setNewSlotEnd(e.target.value)}
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
                  marginTop: 10,
                  padding: "16px",
                  borderRadius: 16,
                  border: "1px solid #EF4444",
                  background: "#FFF5F5",
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
                  <div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#991B1B",
                      }}
                    >
                      Slot schedule
                    </p>
                    <p
                      style={{
                        margin: "4px 0 0",
                        fontSize: 12,
                        color: "#6B7280",
                      }}
                    >
                      Add start and end times, Ø«Ù… Ø§Ø­ÙØ¸ Ø§Ù„Ù†Ø´Ø§Ø·.
                    </p>
                  </div>
                  <button
                    onClick={handleAddSlot}
                    disabled={slotCreating}
                    style={{
                      padding: "10px 14px",
                      borderRadius: 10,
                      border: "none",
                      background: "#EF4444",
                      color: "white",
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: slotCreating ? "not-allowed" : "pointer",
                    }}
                  >
                    {slotCreating ? "Adding..." : "Add slot"}
                  </button>
                </div>
                <div style={{ display: "grid", gap: 10 }}>
                  {modalSlots.length === 0 ? (
                    <div
                      style={{
                        padding: "12px 14px",
                        borderRadius: 12,
                        background: "#FEF2F2",
                        color: "#991B1B",
                        fontSize: 13,
                      }}
                    >
                      No slots added yet.
                    </div>
                  ) : (
                    modalSlots.map((slot) => (
                      <div
                        key={slot.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "12px 14px",
                          borderRadius: 12,
                          background: "white",
                          border: "1px solid #FECACA",
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontSize: 14,
                              fontWeight: 700,
                              color: "#991B1B",
                            }}
                          >
                            {slot.start_time} - {slot.end_time}
                          </div>
                          <div
                            style={{
                              fontSize: 12,
                              color: "#6B7280",
                              marginTop: 4,
                            }}
                          >
                            {slot.isNew ? "Pending save" : "Saved to backend"}
                          </div>
                        </div>
                        <button
                          onClick={() => void handleRemoveSlot(slot)}
                          style={{
                            padding: "8px 12px",
                            borderRadius: 10,
                            border: "1px solid #FECACA",
                            background: "#FEE2E2",
                            color: "#991B1B",
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
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
                  onClick={handleSave}
                  style={{
                    flex: 1,
                    padding: "11px",
                    borderRadius: 10,
                    background: "linear-gradient(135deg, #0F62FE, #0043CE)",
                    color: "white",
                    fontSize: 14,
                    fontWeight: 600,
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(15,98,254,0.3)",
                  }}
                >
                  {editingActivity ? "Save Changes" : "Create Activity"}
                </button>
              </div>
              {slotActionMessage ? (
                <div
                  style={{
                    marginTop: 12,
                    padding: "10px 12px",
                    borderRadius: 12,
                    background: slotActionMessage.includes("success")
                      ? "#ECFDF5"
                      : "#FEF3F2",
                    color: slotActionMessage.includes("success")
                      ? "#166534"
                      : "#B91C1C",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  {slotActionMessage}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
