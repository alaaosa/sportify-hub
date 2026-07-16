import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  UserX,
  Mail,
  Phone,
  Calendar,
  Star,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Users,
  UserCheck,
  UserMinus,
  X,
  Check,
} from "lucide-react";
import { DashboardLayout } from "./DashboardLayout";
import { Page } from "./Navbar";

type MemberStatus = "active" | "inactive" | "suspended";
type Plan = "Elite" | "Premium" | "Basic";

interface Member {
  id: number;
  name: string;
  avatar: string;
  gradient: string;
  email: string;
  phone: string;
  plan: Plan;
  status: MemberStatus;
  joinDate: string;
  sport: string;
  sessionsLeft: number;
  totalSessions: number;
  rating: number;
}

const MEMBERS: Member[] = [
  {
    id: 1001,
    name: "Aisha Ali",
    avatar: "AA",
    gradient: "linear-gradient(135deg,#0F62FE,#22C55E)",
    email: "aisha.ali@example.com",
    phone: "+961 70 123 456",
    plan: "Elite",
    status: "active",
    joinDate: "Jan 12, 2026",
    sport: "Tennis",
    sessionsLeft: 48,
    totalSessions: 48,
    rating: 4.9,
  },
  {
    id: 1002,
    name: "Omar Khaled",
    avatar: "OK",
    gradient: "linear-gradient(135deg,#F59E0B,#EF4444)",
    email: "omar.khaled@example.com",
    phone: "+20 100 987 6543",
    plan: "Premium",
    status: "active",
    joinDate: "Feb 03, 2026",
    sport: "Football",
    sessionsLeft: 18,
    totalSessions: 24,
    rating: 4.6,
  },
  {
    id: 1003,
    name: "Sara Nabil",
    avatar: "SN",
    gradient: "linear-gradient(135deg,#06B6D4,#0F62FE)",
    email: "sara.nabil@example.com",
    phone: "+971 50 321 9876",
    plan: "Basic",
    status: "inactive",
    joinDate: "Mar 18, 2026",
    sport: "Yoga",
    sessionsLeft: 0,
    totalSessions: 8,
    rating: 4.2,
  },
  {
    id: 1004,
    name: "Mohamed Youssef",
    avatar: "MY",
    gradient: "linear-gradient(135deg,#8B5CF6,#EC4899)",
    email: "mohamed.y@example.com",
    phone: "+2 010 555 0190",
    plan: "Premium",
    status: "suspended",
    joinDate: "Apr 04, 2026",
    sport: "Swimming",
    sessionsLeft: 12,
    totalSessions: 24,
    rating: 4.4,
  },
  {
    id: 1005,
    name: "Hana Said",
    avatar: "HS",
    gradient: "linear-gradient(135deg,#F59E0B,#D97706)",
    email: "hana.said@example.com",
    phone: "+202 12 345 6789",
    plan: "Elite",
    status: "active",
    joinDate: "May 10, 2026",
    sport: "Crossfit",
    sessionsLeft: 36,
    totalSessions: 48,
    rating: 4.8,
  },
  {
    id: 1006,
    name: "Yousef Ibrahim",
    avatar: "YI",
    gradient: "linear-gradient(135deg,#22C55E,#0F62FE)",
    email: "yousef.ibrahim@example.com",
    phone: "+966 55 123 4567",
    plan: "Basic",
    status: "active",
    joinDate: "Jun 02, 2026",
    sport: "Basketball",
    sessionsLeft: 4,
    totalSessions: 8,
    rating: 4.1,
  },
  {
    id: 1007,
    name: "Layla Ibrahim",
    avatar: "LI",
    gradient: "linear-gradient(135deg,#06B6D4,#F59E0B)",
    email: "layla.ibrahim@example.com",
    phone: "+965 66 444 7777",
    plan: "Premium",
    status: "active",
    joinDate: "Jun 20, 2026",
    sport: "Pilates",
    sessionsLeft: 20,
    totalSessions: 24,
    rating: 4.7,
  },
  {
    id: 1008,
    name: "Karim Farag",
    avatar: "KF",
    gradient: "linear-gradient(135deg,#EF4444,#F97316)",
    email: "karim.farag@example.com",
    phone: "+20 11 223 3445",
    plan: "Basic",
    status: "inactive",
    joinDate: "May 28, 2026",
    sport: "Gym",
    sessionsLeft: 0,
    totalSessions: 8,
    rating: 3.9,
  },
  {
    id: 1009,
    name: "Nora Adel",
    avatar: "NA",
    gradient: "linear-gradient(135deg,#22C55E,#0F62FE)",
    email: "nora.adel@example.com",
    phone: "+963 94 555 6677",
    plan: "Elite",
    status: "active",
    joinDate: "Jul 01, 2026",
    sport: "Tennis",
    sessionsLeft: 48,
    totalSessions: 48,
    rating: 5.0,
  },
  {
    id: 1010,
    name: "Ibrahim Hassan",
    avatar: "IH",
    gradient: "linear-gradient(135deg,#8B5CF6,#EC4899)",
    email: "ibrahim.h@example.com",
    phone: "+2010 777 8888",
    plan: "Premium",
    status: "active",
    joinDate: "Jul 05, 2026",
    sport: "Football",
    sessionsLeft: 22,
    totalSessions: 24,
    rating: 4.5,
  },
];

const planColors: Record<Plan, { bg: string; text: string }> = {
  Elite: { bg: "#FFFBEB", text: "#D97706" },
  Premium: { bg: "#EFF4FF", text: "#0F62FE" },
  Basic: { bg: "#F9FAFB", text: "#6B7280" },
};
const statusConfig: Record<
  MemberStatus,
  { bg: string; text: string; dot: string; label: string }
> = {
  active: { bg: "#F0FDF4", text: "#16A34A", dot: "#22C55E", label: "Active" },
  inactive: {
    bg: "#F9FAFB",
    text: "#6B7280",
    dot: "#9CA3AF",
    label: "Inactive",
  },
  suspended: {
    bg: "#FFF1F2",
    text: "#DC2626",
    dot: "#EF4444",
    label: "Suspended",
  },
};

const PER_PAGE = 8;

export function MembersPage({ navigate }: { navigate: (page: Page) => void }) {
  const [members, setMembers] = useState(MEMBERS);
  const [search, setSearch] = useState("");
  const [planF, setPlanF] = useState<"All" | Plan>("All");
  const [statusF, setStatusF] = useState<"All" | MemberStatus>("All");
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState<Member | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newPlan, setNewPlan] = useState<Plan>("Basic");
  const [newSport, setNewSport] = useState("Football");
  const [flash, setFlash] = useState("");
  const toast = (m: string) => {
    setFlash(m);
    setTimeout(() => setFlash(""), 2500);
  };

  const filtered = useMemo(
    () =>
      members.filter((m) => {
        if (
          search &&
          !m.name.toLowerCase().includes(search.toLowerCase()) &&
          !m.email.toLowerCase().includes(search.toLowerCase())
        )
          return false;
        if (planF !== "All" && m.plan !== planF) return false;
        if (statusF !== "All" && m.status !== statusF) return false;
        return true;
      }),
    [members, search, planF, statusF],
  );

  const pages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const addMember = () => {
    if (!newName || !newEmail) return;
    const initials = newName
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    setMembers((ms) => [
      ...ms,
      {
        id: Date.now(),
        name: newName,
        avatar: initials,
        gradient: "linear-gradient(135deg,#0F62FE,#22C55E)",
        email: newEmail,
        phone: newPhone,
        plan: newPlan,
        status: "active",
        joinDate: "Jun 28, 2026",
        sport: newSport,
        sessionsLeft: newPlan === "Elite" ? 48 : newPlan === "Premium" ? 24 : 8,
        totalSessions:
          newPlan === "Elite" ? 48 : newPlan === "Premium" ? 24 : 8,
        rating: 0,
      },
    ]);
    setShowAdd(false);
    setNewName("");
    setNewEmail("");
    setNewPhone("");
    toast("Member added.");
  };

  const suspend = (id: number) => {
    setMembers((ms) =>
      ms.map((m) => (m.id === id ? { ...m, status: "suspended" } : m)),
    );
    setDetail(null);
    toast("Member suspended.");
  };
  const activate = (id: number) => {
    setMembers((ms) =>
      ms.map((m) => (m.id === id ? { ...m, status: "active" } : m)),
    );
    toast("Member activated.");
  };
  const remove = (id: number) => {
    setMembers((ms) => ms.filter((m) => m.id !== id));
    setDetail(null);
    toast("Member removed.");
  };

  const stats = {
    total: members.length,
    active: members.filter((m) => m.status === "active").length,
    elite: members.filter((m) => m.plan === "Elite").length,
    new: 4,
  };

  return (
    <DashboardLayout navigate={navigate} currentPage="members">
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
            fontWeight: 500,
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
            Members
          </h1>
          <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>
            Manage all club members, plans and status
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
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
          <Plus size={15} /> Add Member
        </button>
      </div>

      {}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(170px,1fr))",
          gap: 14,
          marginBottom: 22,
        }}
      >
        {[
          {
            icon: Users,
            label: "Total Members",
            value: stats.total,
            color: "#0F62FE",
            bg: "#EFF4FF",
          },
          {
            icon: UserCheck,
            label: "Active",
            value: stats.active,
            color: "#22C55E",
            bg: "#F0FDF4",
          },
          {
            icon: Star,
            label: "Elite Members",
            value: stats.elite,
            color: "#F59E0B",
            bg: "#FFFBEB",
          },
          {
            icon: TrendingUp,
            label: "New This Month",
            value: stats.new,
            color: "#8B5CF6",
            bg: "#F5F3FF",
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
                flexShrink: 0,
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

      {}
      <div
        style={{
          background: "white",
          borderRadius: 12,
          padding: "14px 18px",
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
            placeholder="Search by name or email…"
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
        <div style={{ display: "flex", gap: 6 }}>
          {(["All", "Elite", "Premium", "Basic"] as const).map((p) => (
            <button
              key={p}
              onClick={() => {
                setPlanF(p);
                setPage(1);
              }}
              style={{
                padding: "5px 12px",
                borderRadius: 100,
                border: planF === p ? "none" : "1.5px solid #E5E7EB",
                background: planF === p ? "#0F62FE" : "white",
                color: planF === p ? "white" : "#374151",
                fontSize: 12,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              {p}
            </button>
          ))}
        </div>
        <select
          value={statusF}
          onChange={(e) => {
            setStatusF(e.target.value as any);
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
          <option value="All">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {}
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
            style={{ width: "100%", borderCollapse: "collapse", minWidth: 750 }}
          >
            <thead>
              <tr
                style={{
                  background: "#F9FAFB",
                  borderBottom: "1px solid #E5E7EB",
                }}
              >
                {[
                  "Member",
                  "Plan",
                  "Sport",
                  "Sessions",
                  "Joined",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "11px 14px",
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
                    colSpan={7}
                    style={{
                      padding: 40,
                      textAlign: "center",
                      color: "#9CA3AF",
                      fontSize: 14,
                    }}
                  >
                    No members found
                  </td>
                </tr>
              ) : (
                paginated.map((m, i) => (
                  <tr
                    key={m.id}
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
                    <td style={{ padding: "13px 14px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <div
                          style={{
                            width: 36,
                            height: 36,
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
                        <div>
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
                          <p
                            style={{
                              fontSize: 11,
                              color: "#9CA3AF",
                              margin: 0,
                            }}
                          >
                            {m.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "13px 14px" }}>
                      <span
                        style={{
                          padding: "3px 10px",
                          borderRadius: 100,
                          background: planColors[m.plan].bg,
                          color: planColors[m.plan].text,
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      >
                        {m.plan}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "13px 14px",
                        fontSize: 13,
                        color: "#374151",
                      }}
                    >
                      {m.sport}
                    </td>
                    <td style={{ padding: "13px 14px" }}>
                      <p
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#111827",
                          margin: "0 0 3px",
                        }}
                      >
                        {m.sessionsLeft}/{m.totalSessions}
                      </p>
                      <div
                        style={{
                          height: 4,
                          background: "#F3F4F6",
                          borderRadius: 100,
                          width: 70,
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            borderRadius: 100,
                            background:
                              m.sessionsLeft / m.totalSessions < 0.25
                                ? "#EF4444"
                                : "#22C55E",
                            width: `${(m.sessionsLeft / m.totalSessions) * 100}%`,
                          }}
                        />
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "13px 14px",
                        fontSize: 13,
                        color: "#6B7280",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {m.joinDate}
                    </td>
                    <td style={{ padding: "13px 14px" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          padding: "3px 10px",
                          borderRadius: 100,
                          background: statusConfig[m.status].bg,
                          color: statusConfig[m.status].text,
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      >
                        <span
                          style={{
                            width: 5,
                            height: 5,
                            borderRadius: "50%",
                            background: statusConfig[m.status].dot,
                          }}
                        />
                        {statusConfig[m.status].label}
                      </span>
                    </td>
                    <td style={{ padding: "13px 14px" }}>
                      <div style={{ display: "flex", gap: 4 }}>
                        <button
                          onClick={() => setDetail(m)}
                          title="View"
                          style={actionBtn}
                        >
                          <Eye size={13} />
                        </button>
                        {m.status === "active" ? (
                          <button
                            onClick={() => suspend(m.id)}
                            title="Suspend"
                            style={{ ...actionBtn, color: "#F59E0B" }}
                          >
                            <UserX size={13} />
                          </button>
                        ) : (
                          <button
                            onClick={() => activate(m.id)}
                            title="Activate"
                            style={{ ...actionBtn, color: "#22C55E" }}
                          >
                            <UserCheck size={13} />
                          </button>
                        )}
                        <button
                          onClick={() => remove(m.id)}
                          title="Remove"
                          style={{ ...actionBtn, color: "#EF4444" }}
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
            padding: "12px 18px",
            borderTop: "1px solid #F3F4F6",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 13, color: "#6B7280" }}>
            Showing {Math.min((page - 1) * PER_PAGE + 1, filtered.length)}–
            {Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
          </span>
          <div style={{ display: "flex", gap: 5 }}>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{ ...pageBtn, opacity: page === 1 ? 0.4 : 1 }}
            >
              <ChevronLeft size={13} />
            </button>
            {[...Array(pages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                style={{
                  ...pageBtn,
                  background: page === i + 1 ? "#0F62FE" : "white",
                  color: page === i + 1 ? "white" : "#374151",
                  fontWeight: page === i + 1 ? 700 : 400,
                  borderColor: page === i + 1 ? "#0F62FE" : "#E5E7EB",
                }}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              disabled={page === pages}
              style={{ ...pageBtn, opacity: page === pages ? 0.4 : 1 }}
            >
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
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
              width: 360,
              background: "white",
              overflowY: "auto",
              boxShadow: "-12px 0 40px rgba(0,0,0,0.12)",
            }}
          >
            <div style={{ padding: 24 }}>
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
                  Member Details
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
                    width: 70,
                    height: 70,
                    borderRadius: "50%",
                    background: detail.gradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    fontWeight: 800,
                    color: "white",
                    margin: "0 auto 12px",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
                  }}
                >
                  {detail.avatar}
                </div>
                <p
                  style={{
                    fontSize: 17,
                    fontWeight: 700,
                    color: "#111827",
                    margin: 0,
                  }}
                >
                  {detail.name}
                </p>
                <span
                  style={{
                    padding: "3px 12px",
                    borderRadius: 100,
                    background: planColors[detail.plan].bg,
                    color: planColors[detail.plan].text,
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  {detail.plan}
                </span>
              </div>
              {[
                { icon: Mail, val: detail.email },
                { icon: Phone, val: detail.phone },
                { icon: Calendar, val: `Joined: ${detail.joinDate}` },
              ].map((r) => (
                <div
                  key={r.val}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 10,
                  }}
                >
                  <r.icon size={14} color="#9CA3AF" />
                  <span style={{ fontSize: 13, color: "#374151" }}>
                    {r.val}
                  </span>
                </div>
              ))}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                  margin: "20px 0",
                }}
              >
                {[
                  { label: "Sport", val: detail.sport },
                  {
                    label: "Sessions Left",
                    val: `${detail.sessionsLeft}/${detail.totalSessions}`,
                  },
                  { label: "Status", val: statusConfig[detail.status].label },
                  {
                    label: "Rating",
                    val:
                      detail.rating > 0
                        ? `⭐ ${Number(detail.rating).toFixed(1)}`
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
                      {r.val}
                    </p>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {detail.status === "active" ? (
                  <button
                    onClick={() => suspend(detail.id)}
                    style={{
                      flex: 1,
                      padding: "10px",
                      borderRadius: 10,
                      background: "#FFFBEB",
                      color: "#D97706",
                      fontSize: 13,
                      fontWeight: 700,
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Suspend
                  </button>
                ) : (
                  <button
                    onClick={() => activate(detail.id)}
                    style={{
                      flex: 1,
                      padding: "10px",
                      borderRadius: 10,
                      background: "#F0FDF4",
                      color: "#16A34A",
                      fontSize: 13,
                      fontWeight: 700,
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Activate
                  </button>
                )}
                <button
                  onClick={() => remove(detail.id)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: 10,
                    background: "#FFF1F2",
                    color: "#EF4444",
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
            padding: 20,
          }}
          onClick={() => setShowAdd(false)}
        >
          <div
            style={{
              background: "white",
              borderRadius: 18,
              padding: 28,
              width: "100%",
              maxWidth: 420,
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
                Add New Member
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
                ["Full Name", newName, setNewName, "text", "Alex Johnson"],
                ["Email", newEmail, setNewEmail, "email", "alex@email.com"],
                ["Phone", newPhone, setNewPhone, "tel", "+1 555 000 0000"],
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
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#0F62FE")}
                    onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                  />
                </div>
              ))}
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
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#374151",
                      display: "block",
                      marginBottom: 5,
                    }}
                  >
                    Plan
                  </label>
                  <select
                    value={newPlan}
                    onChange={(e) => setNewPlan(e.target.value as Plan)}
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
                    }}
                  >
                    <option value="Basic">Basic</option>
                    <option value="Premium">Premium</option>
                    <option value="Elite">Elite</option>
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
                    Sport
                  </label>
                  <select
                    value={newSport}
                    onChange={(e) => setNewSport(e.target.value)}
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
                    }}
                  >
                    {[
                      "Football",
                      "Gym",
                      "Swimming",
                      "Tennis",
                      "Yoga",
                      "Basketball",
                      "Karate",
                    ].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={{ display: "flex", gap: 9, marginTop: 4 }}>
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
                  onClick={addMember}
                  disabled={!newName || !newEmail}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: 10,
                    background:
                      newName && newEmail
                        ? "linear-gradient(135deg,#0F62FE,#0043CE)"
                        : "#E5E7EB",
                    color: newName && newEmail ? "white" : "#9CA3AF",
                    fontSize: 13,
                    fontWeight: 700,
                    border: "none",
                    cursor: newName && newEmail ? "pointer" : "not-allowed",
                  }}
                >
                  Add Member
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

const actionBtn: React.CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: 7,
  border: "1px solid #E5E7EB",
  background: "white",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#374151",
};
const pageBtn: React.CSSProperties = {
  width: 30,
  height: 30,
  borderRadius: 7,
  border: "1.5px solid #E5E7EB",
  background: "white",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 12,
  color: "#374151",
};
