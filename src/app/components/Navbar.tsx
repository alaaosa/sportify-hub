import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Zap, ChevronDown, Shield } from "lucide-react";
import { getStoredUserRole, clearAuthData } from "../utils/auth";
import { getStoredClubId } from "../utils/club";

export type Page =
  | "landing"
  | "dashboard"
  | "activities"
  | "events"
  | "faq"
  | "club-profile"
  | "admin"
  | "auth"
  | "members"
  | "memberships"
  | "bookings"
  | "coaches"
  | "payments"
  | "reports"
  | "settings";

interface NavbarProps {
  navigate: (page: Page) => void;
  currentPage: Page;
}

export function Navbar({ navigate, currentPage }: NavbarProps) {
  const [userRole, setUserRole] = useState(getStoredUserRole());
  const location = useLocation();

  useEffect(() => {
    const syncRole = () => setUserRole(getStoredUserRole());
    syncRole();
    window.addEventListener("storage", syncRole);
    window.addEventListener("auth:changed", syncRole);
    return () => {
      window.removeEventListener("storage", syncRole);
      window.removeEventListener("auth:changed", syncRole);
    };
  }, []);

  const links = useMemo(() => {
    const items: { label: string; page: Page; icon?: React.ReactNode }[] = [
      { label: "Home", page: "landing" },
      { label: "Clubs", page: "club-profile" },
      { label: "Help Center", page: "faq" },
    ];

    if (userRole === "SUPER_ADMIN") {
      items.push({ label: "Admin", page: "admin", icon: <Shield size={13} /> });
    }

    if (userRole === "CLUB_ADMIN") {
      items.push({
        label: "Dashboard",
        page: "dashboard",
        icon: <Shield size={13} />,
      });
    }

    return items;
  }, [userRole]);

  const handleNavigate = (page: Page) => {
    navigate(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const activePath = location.pathname;
  const isActive = (page: Page) => {
    if (page === "landing") {
      return activePath === "/";
    }

    if (page === "club-profile") {
      return activePath === "/clubs" || activePath.startsWith("/clubs/");
    }

    if (page === "dashboard") {
      return (
        activePath === "/dashboard" || activePath.startsWith("/dashboard/")
      );
    }

    if (page === "activities") {
      return (
        activePath === "/activities" || activePath.startsWith("/activities/")
      );
    }

    if (page === "events") {
      return activePath === "/events" || activePath.startsWith("/events/");
    }

    if (page === "members") {
      return activePath === "/members" || activePath.startsWith("/members/");
    }

    if (page === "memberships") {
      return (
        activePath === "/memberships" || activePath.startsWith("/memberships/")
      );
    }

    if (page === "bookings") {
      return activePath === "/bookings" || activePath.startsWith("/bookings/");
    }

    if (page === "coaches") {
      return activePath === "/coaches" || activePath.startsWith("/coaches/");
    }

    if (page === "payments") {
      return activePath === "/payments" || activePath.startsWith("/payments/");
    }

    if (page === "reports") {
      return activePath === "/reports" || activePath.startsWith("/reports/");
    }

    const targetPath =
      page === "faq"
        ? "/help-center"
        : page === "admin"
          ? "/admin"
          : page === "auth"
            ? "/auth"
            : page === "settings"
              ? "/settings"
              : "/";

    return activePath === targetPath;
  };

  return (
    <nav
      style={{
        background: "#fff",
        boxShadow: "0 1px 0 #E5E7EB",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 68,
          position: "relative",
        }}
      >
        {}
        <button
          onClick={() => handleNavigate("landing")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 11,
              background: "linear-gradient(135deg, #0F62FE 0%, #0043CE 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(15,98,254,0.3)",
            }}
          >
            <Zap size={20} color="white" fill="white" />
          </div>
          <span
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: "#111827",
              letterSpacing: "-0.5px",
            }}
          >
            Sportify<span style={{ color: "#0F62FE" }}>Hub</span>
          </span>
        </button>

        {}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 32,
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
          }}
          className="hidden md:flex"
        >
          {links.map((item) => (
            <button
              key={item.page}
              onClick={() => handleNavigate(item.page)}
              style={{
                background:
                  item.page === "admin" && currentPage !== "admin"
                    ? "transparent"
                    : "none",
                border: "none",
                cursor: "pointer",
                fontSize: 15,
                fontWeight: isActive(item.page) ? 600 : 500,
                color:
                  item.page === "admin"
                    ? isActive(item.page)
                      ? "#0F62FE"
                      : "#6B7280"
                    : isActive(item.page)
                      ? "#0F62FE"
                      : "#374151",
                borderBottom: isActive(item.page)
                  ? "2px solid #0F62FE"
                  : "2px solid transparent",
                paddingBottom: 2,
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        {}
      </div>

      {}
    </nav>
  );
}
