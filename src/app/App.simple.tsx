import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { LandingPage } from "./components/LandingPage";
import { Dashboard } from "./components/Dashboard";
import { ActivitiesPage } from "./components/ActivitiesPage";
import { EventsPage } from "./components/EventsPage";
import { FAQPage } from "./components/FAQPage";
import { ClubProfile } from "./components/ClubProfile";
import { AdminDashboard } from "./components/AdminDashboard";
import { AuthPage } from "./components/AuthPage";
import { MembersPage } from "./components/MembersPage";
import { MembershipsPage } from "./components/MembershipsPage";
import { BookingsPage } from "./components/BookingsPage";
import { CoachesPage } from "./components/CoachesPage";
import { PaymentsPage } from "./components/PaymentsPage";
import { ReportsPage } from "./components/ReportsPage";
import { SettingsPage } from "./components/SettingsPage";
import type { Page } from "./components/Navbar";
import { getStoredUserRole } from "./utils/auth";
import ErrorBoundary from "./ErrorBoundary";

function AppContent() {
  const [userRole, setUserRole] = useState(getStoredUserRole());
  const routerNavigate = useNavigate();
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

  const navigate = (page: Page) => {
    const path =
      page === "landing"
        ? "/"
        : page === "faq"
          ? "/help-center"
          : page === "admin"
            ? "/admin"
            : page === "auth"
              ? "/auth"
              : page === "settings"
                ? "/settings"
                : page === "dashboard"
                  ? "/dashboard"
                  : page === "activities"
                    ? "/activities"
                    : page === "events"
                      ? "/events"
                      : page === "club-profile"
                        ? "/clubs"
                        : page === "members"
                          ? "/members"
                          : page === "memberships"
                            ? "/memberships"
                            : page === "bookings"
                              ? "/bookings"
                              : page === "coaches"
                                ? "/coaches"
                                : page === "payments"
                                  ? "/payments"
                                  : page === "reports"
                                    ? "/reports"
                                    : "/";

    routerNavigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPage = (page: Page) => {
    if (page === "dashboard") {
      if (userRole === "SUPER_ADMIN")
        return <AdminDashboard navigate={navigate} />;
      if (userRole === "CLUB_ADMIN") return <Dashboard navigate={navigate} />;
      return <LandingPage navigate={navigate} />;
    }

    if (page === "admin") {
      if (userRole === "SUPER_ADMIN")
        return <AdminDashboard navigate={navigate} />;
      return <LandingPage navigate={navigate} />;
    }

    switch (page) {
      case "landing":
        return <LandingPage navigate={navigate} />;
      case "activities":
        return <ActivitiesPage navigate={navigate} />;
      case "events":
        return <EventsPage navigate={navigate} />;
      case "faq":
        return <FAQPage navigate={navigate} />;
      case "club-profile":
        return <ClubProfile navigate={navigate} />;
      case "auth":
        return <AuthPage navigate={navigate} />;
      case "members":
        return <MembersPage navigate={navigate} />;
      case "memberships":
        return <MembershipsPage navigate={navigate} />;
      case "bookings":
        return <BookingsPage navigate={navigate} />;
      case "coaches":
        return <CoachesPage navigate={navigate} />;
      case "payments":
        return <PaymentsPage navigate={navigate} />;
      case "reports":
        return <ReportsPage navigate={navigate} />;
      case "settings":
        return <SettingsPage navigate={navigate} />;
      default:
        return <LandingPage navigate={navigate} />;
    }
  };

  return (
    <Routes>
      <Route path="/" element={renderPage("landing")} />
      <Route path="/dashboard" element={renderPage("dashboard")} />
      <Route path="/activities" element={renderPage("activities")} />
      <Route path="/events" element={renderPage("events")} />
      <Route path="/help-center" element={renderPage("faq")} />
      <Route path="/clubs" element={renderPage("club-profile")} />
      <Route path="/admin" element={renderPage("admin")} />
      <Route path="/auth" element={renderPage("auth")} />
      <Route path="/members" element={renderPage("members")} />
      <Route path="/memberships" element={renderPage("memberships")} />
      <Route path="/bookings" element={renderPage("bookings")} />
      <Route path="/coaches" element={renderPage("coaches")} />
      <Route path="/payments" element={renderPage("payments")} />
      <Route path="/reports" element={renderPage("reports")} />
      <Route path="/settings" element={renderPage("settings")} />
      <Route path="/club-profile" element={<Navigate to="/clubs" replace />} />
      <Route path="/faq" element={<Navigate to="/help-center" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function AppShell() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default function App() {
  return <AppShell />;
}
