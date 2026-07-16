import { useEffect, useState } from "react";
import axios from "axios";
import {
  Plus,
  Edit,
  Trash2,
  Check,
  Users,
  DollarSign,
  TrendingUp,
  X,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { DashboardLayout } from "./DashboardLayout";
import { Page } from "./Navbar";
import { useClubId } from "../utils/club";

interface Plan {
  id: number;
  name: string;
  price: number;
  period: "month" | "year";
  sessions: number | "unlimited";
  features: string[];
  color: string;
  subscribers: number;
  revenue: number;
  active: boolean;
  popular: boolean;
}

const FEATURE_SUGGESTIONS = [];
const API_BASE_URL =
  (import.meta as any)?.env?.VITE_API_URL || "http://localhost:4000";

export function MembershipsPage({
  navigate,
}: {
  navigate: (page: Page) => void;
}) {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [editing, setEditing] = useState<Plan | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [flash, setFlash] = useState("");
  const clubId = useClubId();

  const [fName, setFName] = useState("");
  const [fPrice, setFPrice] = useState("");
  const [fSessions, setFSessions] = useState("");
  const [fUnlimited, setFUnlimited] = useState(false);
  const [fFeatures, setFFeatures] = useState<string[]>([]);
  const [fNewFeature, setFNewFeature] = useState("");
  const [fColor, setFColor] = useState("#0F62FE");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const toast = (m: string) => {
    setFlash(m);
    setTimeout(() => setFlash(""), 2500);
  };

  const loadPlans = async () => {
    try {
      setLoading(true);
      const response = await axios
        .get(`${API_BASE_URL}/club/${clubId}/plan`)
        .catch(() => null);
      const result = response?.data ?? null;
      if (!response || result?.success === false) {
        throw new Error(result?.message || "Failed to load plans");
      }
      const list = Array.isArray(result?.data) ? result.data : [];
      setPlans(
        list.map((plan: any) => ({
          id: plan.id,
          name: plan.name || "Untitled Plan",
          price: Number(plan.price || 0),
          period: "month" as const,
          sessions:
            plan.sessions === 999999
              ? ("unlimited" as const)
              : Number(plan.sessions || 0),
          features: (() => {
            const v = plan.features;
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
                .map((x: string) =>
                  x.replace(/^\s*"|"\s*$|^\s*'|'\s*$/g, "").trim(),
                )
                .filter(Boolean);
            }
            return [];
          })(),
          color: plan.color || "#0F62FE",
          subscribers: plan.subscribers || 0,
          revenue: plan.revenue || 0,
          active: plan.active ?? true,
          popular: plan.popular ?? false,
        })),
      );
      setErrorMessage("");
    } catch (error) {
      console.error("Failed to load plans", error);
      setErrorMessage("Failed to load plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPlans();
  }, [clubId]);

  const openAdd = () => {
    setFName("");
    setFPrice("");
    setFSessions("");
    setFUnlimited(false);
    setFFeatures([]);
    setFColor("#0F62FE");
    setEditing(null);
    setShowAdd(true);
  };
  const openEdit = (p: Plan) => {
    setFName(p.name);
    setFPrice(String(p.price));
    setFSessions(p.sessions === "unlimited" ? "" : String(p.sessions));
    setFUnlimited(p.sessions === "unlimited");
    setFFeatures([...p.features]);
    setFColor(p.color);
    setEditing(p);
    setShowAdd(true);
  };
  const savePlan = async () => {
    if (!fName || !fPrice) return;

    const payload = {
      name: fName,
      price: Number(fPrice),
      sessions: fUnlimited ? 999999 : Number(fSessions || 0),
      features: fFeatures,
      color: fColor,
    };

    try {
      if (editing) {
        const response = await axios.put(
          `${API_BASE_URL}/club/${clubId}/plan/${editing.id}`,
          payload,
          { headers: { "Content-Type": "application/json" } },
        );
        const result = response.data;
        if (
          response.status < 200 ||
          response.status >= 300 ||
          result?.success === false
        ) {
          throw new Error(result?.message || "Failed to update plan");
        }
        toast("Plan updated.");
      } else {
        const response = await axios.post(
          `${API_BASE_URL}/club/${clubId}/plan`,
          payload,
          {
            headers: { "Content-Type": "application/json" },
          },
        );
        const result = response.data;
        if (
          response.status < 200 ||
          response.status >= 300 ||
          result?.success === false
        ) {
          throw new Error(result?.message || "Failed to create plan");
        }
        toast("Plan created.");
      }
      await loadPlans();
      setShowAdd(false);
      setEditing(null);
    } catch (error) {
      console.error("Failed to save plan", error);
      toast("Failed to save plan");
    }
  };
  const toggleActive = (id: number) =>
    setPlans((ps) =>
      ps.map((p) => (p.id === id ? { ...p, active: !p.active } : p)),
    );
  const togglePopular = (id: number) =>
    setPlans((ps) =>
      ps.map((p) => ({ ...p, popular: p.id === id ? !p.popular : false })),
    );
  const deletePlan = async () => {
    if (!deleteId) return;
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/club/${clubId}/plan/${deleteId}`,
      );
      const result = response.data;
      if (
        response.status < 200 ||
        response.status >= 300 ||
        result?.success === false
      ) {
        throw new Error(result?.message || "Failed to delete plan");
      }
      await loadPlans();
      setDeleteId(null);
      toast("Plan deleted.");
    } catch (error) {
      console.error("Failed to delete plan", error);
      toast("Failed to delete plan");
    }
  };
  const addFeature = () => {
    if (fNewFeature.trim()) {
      setFFeatures((f) => [...f, fNewFeature.trim()]);
      setFNewFeature("");
    }
  };
  const removeFeature = (i: number) =>
    setFFeatures((f) => f.filter((_, idx) => idx !== i));

  const totals = {
    subscribers: plans.reduce((a, p) => a + p.subscribers, 0),
    revenue: plans.reduce((a, p) => a + p.revenue, 0),
  };

  return (
    <DashboardLayout navigate={navigate} currentPage="memberships">
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
            Membership Plans
          </h1>
          <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>
            Manage subscription plans, pricing and features
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
          <Plus size={15} /> New Plan
        </button>
      </div>

      {loading ? (
        <div style={{ marginBottom: 16, color: "#6B7280", fontSize: 13 }}>
          Loading plans...
        </div>
      ) : null}
      {errorMessage ? (
        <div style={{ marginBottom: 16, color: "#DC2626", fontSize: 13 }}>
          {errorMessage}
        </div>
      ) : null}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(170px,1fr))",
          gap: 14,
          marginBottom: 28,
        }}
      >
        {[
          {
            icon: Users,
            label: "Total Subscribers",
            value: totals.subscribers,
            color: "#0F62FE",
            bg: "#EFF4FF",
          },
          {
            icon: DollarSign,
            label: "Monthly Revenue",
            value: `$${totals.revenue.toLocaleString()}`,
            color: "#22C55E",
            bg: "#F0FDF4",
          },
          {
            icon: TrendingUp,
            label: "Active Plans",
            value: plans.filter((p) => p.active).length,
            color: "#F59E0B",
            bg: "#FFFBEB",
          },
        ].map((c) => (
          <div
            key={c.label}
            style={{
              background: "white",
              borderRadius: 14,
              padding: "16px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              display: "flex",
              gap: 12,
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 11,
                background: c.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <c.icon size={18} color={c.color} />
            </div>
            <div>
              <p
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: "#111827",
                  margin: 0,
                }}
              >
                {c.value}
              </p>
              <p style={{ fontSize: 12, color: "#6B7280", margin: 0 }}>
                {c.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))",
          gap: 22,
          alignItems: "start",
        }}
      >
        {plans.map((plan) => (
          <div
            key={plan.id}
            style={{
              background: "white",
              borderRadius: 20,
              overflow: "hidden",
              boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
              border: `2px solid ${plan.popular ? plan.color : "transparent"}`,
              position: "relative",
              opacity: plan.active ? 1 : 0.6,
            }}
          >
            {plan.popular && (
              <div
                style={{
                  background: plan.color,
                  color: "white",
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "5px 0",
                  textAlign: "center",
                }}
              >
                ⭐ Most Popular
              </div>
            )}
            {}
            <div style={{ height: 5, background: plan.color }} />
            <div style={{ padding: "22px 22px 18px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 14,
                }}
              >
                <div>
                  <h3
                    style={{
                      fontSize: 18,
                      fontWeight: 800,
                      color: "#111827",
                      margin: 0,
                    }}
                  >
                    {plan.name}
                  </h3>
                  <p
                    style={{
                      fontSize: 13,
                      color: "#9CA3AF",
                      margin: "3px 0 0",
                    }}
                  >
                    {plan.sessions === "unlimited"
                      ? "Unlimited sessions"
                      : `${plan.sessions} sessions/mo`}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p
                    style={{
                      fontSize: 26,
                      fontWeight: 900,
                      color: plan.color,
                      margin: 0,
                    }}
                  >
                    {`$${plan.price}`}
                  </p>
                  <p style={{ fontSize: 11, color: "#9CA3AF", margin: 0 }}>
                    per month
                  </p>
                </div>
              </div>
              {}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 7,
                  marginBottom: 18,
                }}
              >
                {plan.features.map((f: string) => (
                  <div
                    key={f}
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <div
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        background: `${plan.color}18`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Check size={9} color={plan.color} strokeWidth={3} />
                    </div>
                    <span style={{ fontSize: 12, color: "#374151" }}>{f}</span>
                  </div>
                ))}
              </div>
              {}
              <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                <div
                  style={{
                    flex: 1,
                    background: "#F9FAFB",
                    borderRadius: 9,
                    padding: "9px",
                    textAlign: "center",
                  }}
                >
                  <p
                    style={{
                      fontSize: 17,
                      fontWeight: 800,
                      color: "#111827",
                      margin: 0,
                    }}
                  >
                    {plan.subscribers}
                  </p>
                  <p style={{ fontSize: 10, color: "#9CA3AF", margin: 0 }}>
                    Subscribers
                  </p>
                </div>
                <div
                  style={{
                    flex: 1,
                    background: "#F9FAFB",
                    borderRadius: 9,
                    padding: "9px",
                    textAlign: "center",
                  }}
                >
                  <p
                    style={{
                      fontSize: 17,
                      fontWeight: 800,
                      color: "#22C55E",
                      margin: 0,
                    }}
                  >
                    {`$${plan.revenue.toLocaleString()}`}
                  </p>
                  <p style={{ fontSize: 10, color: "#9CA3AF", margin: 0 }}>
                    Monthly Rev.
                  </p>
                </div>
              </div>
              {}
              <div style={{ display: "flex", gap: 7 }}>
                <button
                  onClick={() => openEdit(plan)}
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
                  onClick={() => toggleActive(plan.id)}
                  title={plan.active ? "Deactivate" : "Activate"}
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
                  }}
                >
                  {plan.active ? (
                    <ToggleRight size={16} color="#22C55E" />
                  ) : (
                    <ToggleLeft size={16} color="#9CA3AF" />
                  )}
                </button>
                <button
                  onClick={() => togglePopular(plan.id)}
                  title="Toggle popular"
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 9,
                    border: `1px solid ${plan.popular ? plan.color : "#E5E7EB"}`,
                    background: plan.popular ? `${plan.color}12` : "white",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                  }}
                >
                  ⭐
                </button>
                <button
                  onClick={() => setDeleteId(plan.id)}
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
          </div>
        ))}

        {}
        <button
          onClick={openAdd}
          style={{
            borderRadius: 20,
            border: "2px dashed #E5E7EB",
            background: "transparent",
            minHeight: 200,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            cursor: "pointer",
            transition: "border-color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#0F62FE")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#E5E7EB")}
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
            <Plus size={20} color="#0F62FE" />
          </div>
          <p
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "#0F62FE",
              margin: 0,
            }}
          >
            Add New Plan
          </p>
        </button>
      </div>

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
              maxWidth: 480,
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
                marginBottom: 22,
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
                {editing ? `Edit: ${editing.name}` : "Create Plan"}
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
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <div>
                  <label style={lbl}>Plan Name *</label>
                  <input
                    value={fName}
                    onChange={(e) => setFName(e.target.value)}
                    placeholder="e.g. Premium"
                    style={inp}
                    onFocus={(e) => (e.target.style.borderColor = "#0F62FE")}
                    onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                  />
                </div>
                <div>
                  <label style={lbl}>Price ($/mo) *</label>
                  <input
                    type="number"
                    value={fPrice}
                    onChange={(e) => setFPrice(e.target.value)}
                    placeholder="79"
                    style={inp}
                    onFocus={(e) => (e.target.style.borderColor = "#0F62FE")}
                    onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                  />
                </div>
              </div>
              <div>
                <label style={lbl}>Sessions per Month</label>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <input
                    type="number"
                    value={fSessions}
                    onChange={(e) => setFSessions(e.target.value)}
                    placeholder="24"
                    disabled={fUnlimited}
                    style={{ ...inp, flex: 1, opacity: fUnlimited ? 0.5 : 1 }}
                    onFocus={(e) => (e.target.style.borderColor = "#0F62FE")}
                    onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                  />
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      fontSize: 13,
                      color: "#374151",
                      fontWeight: 500,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={fUnlimited}
                      onChange={(e) => setFUnlimited(e.target.checked)}
                      style={{ accentColor: "#0F62FE", width: 15, height: 15 }}
                    />
                    Unlimited
                  </label>
                </div>
              </div>
              <div>
                <label style={lbl}>Accent Color</label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {[
                    "#0F62FE",
                    "#22C55E",
                    "#F59E0B",
                    "#8B5CF6",
                    "#EF4444",
                    "#06B6D4",
                    "#374151",
                  ].map((c) => (
                    <button
                      key={c}
                      onClick={() => setFColor(c)}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: c,
                        border:
                          fColor === c
                            ? "3px solid white"
                            : "3px solid transparent",
                        boxShadow: fColor === c ? `0 0 0 2px ${c}` : "none",
                        cursor: "pointer",
                      }}
                    />
                  ))}
                </div>
              </div>
              {}
              <div>
                <label style={lbl}>Features</label>
                {fFeatures.map((f, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 6,
                    }}
                  >
                    <Check size={13} color="#22C55E" />
                    <span style={{ flex: 1, fontSize: 13, color: "#374151" }}>
                      {f}
                    </span>
                    <button
                      onClick={() => removeFeature(i)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#EF4444",
                      }}
                    >
                      <X size={13} />
                    </button>
                  </div>
                ))}
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <input
                    value={fNewFeature}
                    onChange={(e) => setFNewFeature(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addFeature()}
                    placeholder="Add a feature…"
                    style={{ ...inp, flex: 1 }}
                    onFocus={(e) => (e.target.style.borderColor = "#0F62FE")}
                    onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                  />
                  <button
                    onClick={addFeature}
                    style={{
                      padding: "0 14px",
                      borderRadius: 9,
                      background: "#0F62FE",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    Add
                  </button>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 6,
                    marginTop: 10,
                  }}
                >
                  {FEATURE_SUGGESTIONS.filter((s) => !fFeatures.includes(s))
                    .slice(0, 6)
                    .map((s) => (
                      <button
                        key={s}
                        onClick={() => setFFeatures((f) => [...f, s])}
                        style={{
                          padding: "4px 10px",
                          borderRadius: 100,
                          border: "1px dashed #E5E7EB",
                          background: "white",
                          fontSize: 11,
                          color: "#6B7280",
                          cursor: "pointer",
                        }}
                      >
                        + {s}
                      </button>
                    ))}
                </div>
              </div>
              <div style={{ display: "flex", gap: 9, marginTop: 6 }}>
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
                  onClick={savePlan}
                  disabled={!fName || !fPrice}
                  style={{
                    flex: 2,
                    padding: "10px",
                    borderRadius: 10,
                    background:
                      fName && fPrice
                        ? "linear-gradient(135deg,#0F62FE,#0043CE)"
                        : "#E5E7EB",
                    color: fName && fPrice ? "white" : "#9CA3AF",
                    fontSize: 13,
                    fontWeight: 700,
                    border: "none",
                    cursor: fName && fPrice ? "pointer" : "not-allowed",
                  }}
                >
                  {editing ? "Save Changes" : "Create Plan"}
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
              maxWidth: 360,
              width: "100%",
              textAlign: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                background: "#FFF1F2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 14px",
              }}
            >
              <Trash2 size={22} color="#EF4444" />
            </div>
            <h3
              style={{
                fontSize: 17,
                fontWeight: 800,
                color: "#111827",
                margin: "0 0 8px",
              }}
            >
              Delete Plan?
            </h3>
            <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 22px" }}>
              This will remove the plan and cannot be undone. Existing
              subscribers won't be affected immediately.
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
                onClick={deletePlan}
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
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

const lbl: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: "#374151",
  display: "block",
  marginBottom: 5,
};
const inp: React.CSSProperties = {
  width: "100%",
  height: 38,
  border: "1.5px solid #E5E7EB",
  borderRadius: 9,
  padding: "0 11px",
  fontSize: 13,
  outline: "none",
  boxSizing: "border-box",
  color: "#111827",
};
