import { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  Zap,
  ArrowRight,
  Check,
  ChevronLeft,
} from "lucide-react";
import { Page } from "./Navbar";
import axios from "axios";
import { persistAuthData } from "../utils/auth";

const SPORTS = [
  "Football",
  "Gym & Fitness",
  "Swimming",
  "Basketball",
  "Tennis",
  "Yoga",
  "Martial Arts",
  "Volleyball",
];

const BG_IMG =
  "https://images.unsplash.com/photo-1761971975769-97e598bf526b?w=900&q=80";

interface AuthPageProps {
  navigate: (page: Page) => void;
}

const API_BASE_URL =
  (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env
    ?.VITE_API_URL || "http://localhost:4000";

export function AuthPage({ navigate }: AuthPageProps) {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authMessage, setAuthMessage] = useState<string | null>(null);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [remember, setRemember] = useState(false);

  const [signName, setSignName] = useState("");
  const [signEmail, setSignEmail] = useState("");
  const [signPhone, setSignPhone] = useState("");
  const [signPass, setSignPass] = useState("");
  const [signConfirm, setSignConfirm] = useState("");

  const toggleSport = (s: string) =>
    setSelectedSports((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );

  const passStrength = (p: string) => {
    if (!p) return 0;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  };
  const strength = passStrength(signPass);
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthColor = ["", "#EF4444", "#F59E0B", "#3B82F6", "#22C55E"];

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthMessage(null);
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signin`, {
        email: loginEmail.trim(),
        password: loginPass,
      });

      const responseData = response?.data;
      const token = responseData?.data?.token ?? responseData?.token;
      const user = responseData?.data?.user ?? responseData?.user;
      if (token) {
        persistAuthData(token, user ?? null);
      }

      setDone(true);
      setTimeout(() => {
        setDone(false);
        navigate("landing");
      }, 1800);
    } catch (error: any) {
      setAuthMessage(
        error?.response?.data?.message || "Login failed. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupNext = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthMessage(null);

    if (!signName.trim()) {
      setAuthMessage("Please enter your full name.");
      return;
    }

    if (!signEmail.trim()) {
      setAuthMessage("Please enter your email address.");
      return;
    }

    if (!signPass) {
      setAuthMessage("Please enter a password.");
      return;
    }

    if (signPass.length < 8) {
      setAuthMessage("Password must be at least 8 characters.");
      return;
    }

    if (signPass !== signConfirm) {
      setAuthMessage("Passwords do not match.");
      return;
    }

    setStep(2);
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthMessage(null);
    setIsLoading(true);

    try {
      await axios.post(`${API_BASE_URL}/auth/signup`, {
        fullName: signName.trim(),
        email: signEmail.trim(),
        pNumber: signPhone.trim(),
        password: signPass,
        cPassword: signConfirm,
      });

      setDone(true);
      setTimeout(() => {
        setDone(false);
        navigate("landing");
      }, 1800);
    } catch (error: any) {
      setAuthMessage(
        error?.response?.data?.message || "Signup failed. Please try again.",
      );
      setStep(1);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#F8FAFC" }}>
      <div
        style={{ flex: "0 0 46%", position: "relative", overflow: "hidden" }}
        className="hidden lg:block"
      >
        <img
          src={BG_IMG}
          alt="Sports"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(160deg, rgba(11,24,41,0.85) 0%, rgba(15,98,254,0.6) 100%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: 28,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 11,
                background: "linear-gradient(135deg, #0F62FE, #0043CE)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(15,98,254,0.4)",
              }}
            >
              <Zap size={20} color="white" fill="white" />
            </div>
            <span style={{ fontSize: 20, fontWeight: 800, color: "white" }}>
              Sportify<span style={{ color: "#60A5FA" }}>Hub</span>
            </span>
          </div>
        </div>

        <div style={{ position: "absolute", bottom: 80, left: 48, right: 48 }}>
          <h2
            style={{
              fontSize: 36,
              fontWeight: 900,
              color: "white",
              lineHeight: 1.2,
              margin: "0 0 16px",
              letterSpacing: "-0.5px",
            }}
          >
            Your Sports Club,
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #60A5FA, #34D399)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              All in One Place
            </span>
          </h2>
          <p
            style={{
              fontSize: 15,
              color: "rgba(255,255,255,0.7)",
              lineHeight: 1.7,
              margin: "0 0 32px",
            }}
          >
            Book sessions, join events, track your progress, and connect with
            coaches — start today.
          </p>

          <div style={{ display: "flex", gap: 32 }}>
            {[
              ["1,200+", "Clubs"],
              ["50K+", "Members"],
              ["8K+", "Events/mo"],
            ].map(([val, lbl]) => (
              <div key={lbl}>
                <p
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    color: "white",
                    margin: 0,
                  }}
                >
                  {val}
                </p>
                <p
                  style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.5)",
                    margin: "2px 0 0",
                  }}
                >
                  {lbl}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 24px",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 420,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 32,
          }}
          className="lg:hidden"
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 9,
                background: "linear-gradient(135deg, #0F62FE, #0043CE)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Zap size={16} color="white" fill="white" />
            </div>
            <span style={{ fontSize: 17, fontWeight: 800, color: "#111827" }}>
              Sportify<span style={{ color: "#0F62FE" }}>Hub</span>
            </span>
          </div>
        </div>

        <div style={{ width: "100%", maxWidth: 420 }}>
          {done ? (
            <div style={{ textAlign: "center", padding: "48px 24px" }}>
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #22C55E, #16A34A)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                  boxShadow: "0 8px 24px rgba(34,197,94,0.3)",
                }}
              >
                <Check size={34} color="white" strokeWidth={2.5} />
              </div>
              <h3
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: "#111827",
                  margin: "0 0 8px",
                }}
              >
                {tab === "login" ? "Welcome back!" : "Account created!"}
              </h3>
              <p style={{ fontSize: 14, color: "#6B7280" }}>
                Redirecting you to the platform…
              </p>
            </div>
          ) : (
            <>
              <div
                style={{
                  display: "flex",
                  background: "#F3F4F6",
                  borderRadius: 12,
                  padding: 4,
                  marginBottom: 32,
                }}
              >
                {(["login", "signup"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setTab(t);
                      setStep(1);
                    }}
                    style={{
                      flex: 1,
                      padding: "10px",
                      borderRadius: 9,
                      border: "none",
                      background: tab === t ? "white" : "transparent",
                      color: tab === t ? "#111827" : "#6B7280",
                      fontSize: 14,
                      fontWeight: tab === t ? 700 : 500,
                      cursor: "pointer",
                      boxShadow:
                        tab === t ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
                      transition: "all 0.2s",
                    }}
                  >
                    {t === "login" ? "Log In" : "Sign Up"}
                  </button>
                ))}
              </div>

              {tab === "login" && (
                <>
                  <div style={{ marginBottom: 28 }}>
                    <h1
                      style={{
                        fontSize: 26,
                        fontWeight: 900,
                        color: "#111827",
                        margin: "0 0 6px",
                        letterSpacing: "-0.5px",
                      }}
                    >
                      Welcome back
                    </h1>
                    <p style={{ fontSize: 14, color: "#6B7280", margin: 0 }}>
                      Log in to your SportifyHub account
                    </p>
                  </div>

                  <form
                    onSubmit={handleLoginSubmit}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 16,
                    }}
                  >
                    {authMessage && (
                      <div
                        style={{
                          padding: "10px 12px",
                          borderRadius: 10,
                          background: "#FEE2E2",
                          color: "#B91C1C",
                          fontSize: 13,
                          fontWeight: 600,
                        }}
                      >
                        {authMessage}
                      </div>
                    )}
                    <InputField
                      icon={<Mail size={16} color="#9CA3AF" />}
                      label="Email Address"
                      type="email"
                      value={loginEmail}
                      onChange={setLoginEmail}
                      placeholder="you@example.com"
                      required
                    />
                    <InputField
                      icon={<Lock size={16} color="#9CA3AF" />}
                      label="Password"
                      type={showPass ? "text" : "password"}
                      value={loginPass}
                      onChange={setLoginPass}
                      placeholder="Enter your password"
                      required
                      rightEl={
                        <button
                          type="button"
                          onClick={() => setShowPass((s) => !s)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: 0,
                            display: "flex",
                            color: "#9CA3AF",
                          }}
                        >
                          {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      }
                    />

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
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
                          checked={remember}
                          onChange={(e) => setRemember(e.target.checked)}
                          style={{
                            width: 15,
                            height: 15,
                            accentColor: "#0F62FE",
                            cursor: "pointer",
                          }}
                        />
                        <span style={{ fontSize: 13, color: "#374151" }}>
                          Remember me
                        </span>
                      </label>
                      <button
                        type="button"
                        style={{
                          background: "none",
                          border: "none",
                          color: "#0F62FE",
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        Forgot password?
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={!loginEmail || !loginPass || isLoading}
                      style={{
                        width: "100%",
                        padding: "13px",
                        borderRadius: 12,
                        background:
                          loginEmail && loginPass && !isLoading
                            ? "linear-gradient(135deg, #0F62FE, #0043CE)"
                            : "#E5E7EB",
                        color:
                          loginEmail && loginPass && !isLoading
                            ? "white"
                            : "#9CA3AF",
                        fontSize: 15,
                        fontWeight: 700,
                        border: "none",
                        cursor:
                          loginEmail && loginPass && !isLoading
                            ? "pointer"
                            : "not-allowed",
                        boxShadow:
                          loginEmail && loginPass && !isLoading
                            ? "0 6px 20px rgba(15,98,254,0.35)"
                            : "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        transition: "all 0.2s",
                        marginTop: 4,
                      }}
                    >
                      {isLoading ? "Signing in..." : "Log In"}{" "}
                      <ArrowRight size={16} />
                    </button>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        margin: "4px 0",
                      }}
                    >
                      <div
                        style={{ flex: 1, height: 1, background: "#E5E7EB" }}
                      />
                      <span style={{ fontSize: 12, color: "#9CA3AF" }}>
                        or continue with
                      </span>
                      <div
                        style={{ flex: 1, height: 1, background: "#E5E7EB" }}
                      />
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 10,
                      }}
                    >
                      {[
                        ["G", "Google", "#EA4335"],
                        ["f", "Facebook", "#1877F2"],
                      ].map(([icon, label, color]) => (
                        <button
                          key={label}
                          type="button"
                          style={{
                            padding: "10px",
                            borderRadius: 10,
                            border: "1.5px solid #E5E7EB",
                            background: "white",
                            fontSize: 13,
                            fontWeight: 600,
                            color: "#374151",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 8,
                            transition: "border-color 0.2s",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.borderColor =
                              color as string)
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.borderColor = "#E5E7EB")
                          }
                        >
                          <span
                            style={{ fontWeight: 800, color: color as string }}
                          >
                            {icon}
                          </span>{" "}
                          {label}
                        </button>
                      ))}
                    </div>
                  </form>

                  <p
                    style={{
                      textAlign: "center",
                      marginTop: 24,
                      fontSize: 13,
                      color: "#6B7280",
                    }}
                  >
                    Don't have an account?{" "}
                    <button
                      onClick={() => setTab("signup")}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#0F62FE",
                        fontWeight: 700,
                        cursor: "pointer",
                        fontSize: 13,
                      }}
                    >
                      Sign up free
                    </button>
                  </p>
                </>
              )}

              {tab === "signup" && (
                <>
                  <div style={{ marginBottom: 24 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 6,
                      }}
                    >
                      <h1
                        style={{
                          fontSize: 26,
                          fontWeight: 900,
                          color: "#111827",
                          margin: 0,
                          letterSpacing: "-0.5px",
                        }}
                      >
                        {step === 1
                          ? "Create account 🚀"
                          : "Pick your sports 🏅"}
                      </h1>
                    </div>
                    <p style={{ fontSize: 14, color: "#6B7280", margin: 0 }}>
                      {step === 1
                        ? "Join SportifyHub for free — no card required"
                        : "Choose the sports you're interested in"}
                    </p>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginTop: 14,
                      }}
                    >
                      {[1, 2].map((s) => (
                        <div
                          key={s}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <div
                            style={{
                              width: 26,
                              height: 26,
                              borderRadius: "50%",
                              background: step >= s ? "#0F62FE" : "#E5E7EB",
                              color: step >= s ? "white" : "#9CA3AF",
                              fontSize: 12,
                              fontWeight: 700,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {step > s ? <Check size={12} strokeWidth={3} /> : s}
                          </div>
                          <span
                            style={{
                              fontSize: 12,
                              color: step >= s ? "#0F62FE" : "#9CA3AF",
                              fontWeight: step >= s ? 600 : 400,
                            }}
                          >
                            {s === 1 ? "Your Info" : "Interests"}
                          </span>
                          {s < 2 && (
                            <div
                              style={{
                                width: 30,
                                height: 2,
                                background: step > s ? "#0F62FE" : "#E5E7EB",
                                borderRadius: 100,
                              }}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {step === 1 && (
                    <form
                      onSubmit={handleSignupNext}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 14,
                      }}
                    >
                      {authMessage && (
                        <div
                          style={{
                            padding: "10px 12px",
                            borderRadius: 10,
                            background: "#FEE2E2",
                            color: "#B91C1C",
                            fontSize: 13,
                            fontWeight: 600,
                          }}
                        >
                          {authMessage}
                        </div>
                      )}
                      <InputField
                        icon={<User size={16} color="#9CA3AF" />}
                        label="Full Name"
                        type="text"
                        value={signName}
                        onChange={setSignName}
                        placeholder="Alex Johnson"
                        required
                      />
                      <InputField
                        icon={<Mail size={16} color="#9CA3AF" />}
                        label="Email Address"
                        type="email"
                        value={signEmail}
                        onChange={setSignEmail}
                        placeholder="you@example.com"
                        required
                      />
                      <InputField
                        icon={<Phone size={16} color="#9CA3AF" />}
                        label="Phone Number"
                        type="tel"
                        value={signPhone}
                        onChange={setSignPhone}
                        placeholder="+1 (555) 000-0000"
                      />
                      <div>
                        <InputField
                          icon={<Lock size={16} color="#9CA3AF" />}
                          label="Password"
                          type={showPass ? "text" : "password"}
                          value={signPass}
                          onChange={setSignPass}
                          placeholder="Min. 8 characters"
                          required
                          rightEl={
                            <button
                              type="button"
                              onClick={() => setShowPass((s) => !s)}
                              style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                padding: 0,
                                display: "flex",
                                color: "#9CA3AF",
                              }}
                            >
                              {showPass ? (
                                <EyeOff size={16} />
                              ) : (
                                <Eye size={16} />
                              )}
                            </button>
                          }
                        />
                        {signPass && (
                          <div style={{ marginTop: 8 }}>
                            <div
                              style={{
                                display: "flex",
                                gap: 4,
                                marginBottom: 4,
                              }}
                            >
                              {[1, 2, 3, 4].map((i) => (
                                <div
                                  key={i}
                                  style={{
                                    flex: 1,
                                    height: 4,
                                    borderRadius: 100,
                                    background:
                                      i <= strength
                                        ? strengthColor[strength]
                                        : "#E5E7EB",
                                    transition: "all 0.3s",
                                  }}
                                />
                              ))}
                            </div>
                            <span
                              style={{
                                fontSize: 11,
                                fontWeight: 600,
                                color: strengthColor[strength],
                              }}
                            >
                              {strengthLabel[strength]}
                            </span>
                          </div>
                        )}
                      </div>
                      <InputField
                        icon={<Lock size={16} color="#9CA3AF" />}
                        label="Confirm Password"
                        type={showConfirmPass ? "text" : "password"}
                        value={signConfirm}
                        onChange={setSignConfirm}
                        placeholder="Repeat your password"
                        required
                        rightEl={
                          <button
                            type="button"
                            onClick={() => setShowConfirmPass((s) => !s)}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              padding: 0,
                              display: "flex",
                              color: "#9CA3AF",
                            }}
                          >
                            {showConfirmPass ? (
                              <EyeOff size={16} />
                            ) : (
                              <Eye size={16} />
                            )}
                          </button>
                        }
                        error={
                          signConfirm && signPass !== signConfirm
                            ? "Passwords do not match"
                            : ""
                        }
                      />

                      <button
                        type="submit"
                        disabled={
                          !signName ||
                          !signEmail ||
                          !signPass ||
                          signPass !== signConfirm ||
                          isLoading
                        }
                        style={{
                          width: "100%",
                          padding: "13px",
                          borderRadius: 12,
                          background:
                            signName &&
                            signEmail &&
                            signPass &&
                            signPass === signConfirm &&
                            !isLoading
                              ? "linear-gradient(135deg, #0F62FE, #0043CE)"
                              : "#E5E7EB",
                          color:
                            signName &&
                            signEmail &&
                            signPass &&
                            signPass === signConfirm &&
                            !isLoading
                              ? "white"
                              : "#9CA3AF",
                          fontSize: 15,
                          fontWeight: 700,
                          border: "none",
                          cursor:
                            signName &&
                            signEmail &&
                            signPass &&
                            signPass === signConfirm &&
                            !isLoading
                              ? "pointer"
                              : "not-allowed",
                          boxShadow:
                            signName &&
                            signEmail &&
                            signPass &&
                            signPass === signConfirm &&
                            !isLoading
                              ? "0 6px 20px rgba(15,98,254,0.35)"
                              : "none",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 8,
                          marginTop: 4,
                        }}
                      >
                        {isLoading ? "Processing..." : "Next Step"}{" "}
                        <ArrowRight size={16} />
                      </button>
                    </form>
                  )}

                  {step === 2 && (
                    <form
                      onSubmit={handleSignupSubmit}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 20,
                      }}
                    >
                      {authMessage && (
                        <div
                          style={{
                            padding: "10px 12px",
                            borderRadius: 10,
                            background: "#FEE2E2",
                            color: "#B91C1C",
                            fontSize: 13,
                            fontWeight: 600,
                          }}
                        >
                          {authMessage}
                        </div>
                      )}
                      <div
                        style={{ display: "flex", flexWrap: "wrap", gap: 10 }}
                      >
                        {SPORTS.map((sport) => {
                          const active = selectedSports.includes(sport);
                          return (
                            <button
                              key={sport}
                              type="button"
                              onClick={() => toggleSport(sport)}
                              style={{
                                padding: "9px 18px",
                                borderRadius: 100,
                                border: active ? "none" : "1.5px solid #E5E7EB",
                                background: active
                                  ? "linear-gradient(135deg, #0F62FE, #0043CE)"
                                  : "white",
                                color: active ? "white" : "#374151",
                                fontSize: 13,
                                fontWeight: active ? 700 : 500,
                                cursor: "pointer",
                                transition: "all 0.2s",
                                boxShadow: active
                                  ? "0 4px 12px rgba(15,98,254,0.25)"
                                  : "none",
                              }}
                            >
                              {active && (
                                <Check
                                  size={12}
                                  style={{ display: "inline", marginRight: 5 }}
                                  strokeWidth={3}
                                />
                              )}
                              {sport}
                            </button>
                          );
                        })}
                      </div>

                      <p style={{ fontSize: 12, color: "#9CA3AF", margin: 0 }}>
                        {selectedSports.length === 0
                          ? "Select at least one sport to personalize your experience"
                          : `$${selectedSports.length} sport$${selectedSports.length > 1 ? "s" : ""} selected`}
                      </p>

                      <div style={{ display: "flex", gap: 10 }}>
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          style={{
                            padding: "12px 20px",
                            borderRadius: 12,
                            border: "1.5px solid #E5E7EB",
                            background: "white",
                            color: "#374151",
                            fontSize: 14,
                            fontWeight: 600,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          <ChevronLeft size={14} /> Back
                        </button>
                        <button
                          type="submit"
                          disabled={isLoading}
                          style={{
                            flex: 1,
                            padding: "13px",
                            borderRadius: 12,
                            background: isLoading
                              ? "#9CA3AF"
                              : "linear-gradient(135deg, #0F62FE, #0043CE)",
                            color: "white",
                            fontSize: 15,
                            fontWeight: 700,
                            border: "none",
                            cursor: isLoading ? "not-allowed" : "pointer",
                            boxShadow: isLoading
                              ? "none"
                              : "0 6px 20px rgba(15,98,254,0.35)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 8,
                          }}
                        >
                          {isLoading ? "Creating account..." : "Create Account"}{" "}
                          <ArrowRight size={16} />
                        </button>
                      </div>

                      <p
                        style={{
                          textAlign: "center",
                          fontSize: 12,
                          color: "#9CA3AF",
                          lineHeight: 1.6,
                        }}
                      >
                        By creating an account you agree to our{" "}
                        <span
                          style={{
                            color: "#0F62FE",
                            cursor: "pointer",
                            fontWeight: 600,
                          }}
                        >
                          Terms of Service
                        </span>{" "}
                        and{" "}
                        <span
                          style={{
                            color: "#0F62FE",
                            cursor: "pointer",
                            fontWeight: 600,
                          }}
                        >
                          Privacy Policy
                        </span>
                      </p>
                    </form>
                  )}

                  <p
                    style={{
                      textAlign: "center",
                      marginTop: 20,
                      fontSize: 13,
                      color: "#6B7280",
                    }}
                  >
                    Already have an account?{" "}
                    <button
                      onClick={() => setTab("login")}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#0F62FE",
                        fontWeight: 700,
                        cursor: "pointer",
                        fontSize: 13,
                      }}
                    >
                      Log in
                    </button>
                  </p>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}


function InputField({
  icon,
  label,
  type,
  value,
  onChange,
  placeholder,
  required,
  rightEl,
  error,
}: {
  icon: React.ReactNode;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  required?: boolean;
  rightEl?: React.ReactNode;
  error?: string;
}) {
  const [focused, setFocused] = useState(false);
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
      <div
        style={{ position: "relative", display: "flex", alignItems: "center" }}
      >
        <span
          style={{
            position: "absolute",
            left: 13,
            display: "flex",
            pointerEvents: "none",
          }}
        >
          {icon}
        </span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%",
            height: 44,
            paddingLeft: 40,
            paddingRight: rightEl ? 40 : 14,
            border: `1.5px solid ${error ? "#EF4444" : focused ? "#0F62FE" : "#E5E7EB"}`,
            borderRadius: 10,
            fontSize: 14,
            color: "#111827",
            outline: "none",
            boxSizing: "border-box",
            background: "white",
            transition: "border-color 0.2s",
          }}
        />
        {rightEl && (
          <span style={{ position: "absolute", right: 12, display: "flex" }}>
            {rightEl}
          </span>
        )}
      </div>
      {error && (
        <p
          style={{
            fontSize: 11,
            color: "#EF4444",
            margin: "4px 0 0",
            fontWeight: 500,
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
