export type AppUserRole = "SUPER_ADMIN" | "CLUB_ADMIN" | "USER" | null;

export interface StoredUser {
  id?: number;
  role?: string;
  [key: string]: unknown;
}

export const getStoredUser = (): StoredUser | null => {
  if (typeof window === "undefined") return null;

  try {
    const rawUser = window.localStorage.getItem("user");
    return rawUser ? (JSON.parse(rawUser) as StoredUser) : null;
  } catch {
    return null;
  }
};

export const getStoredUserRole = (): AppUserRole => {
  const user = getStoredUser();
  const role = user?.role;

  if (role === "SUPER_ADMIN" || role === "CLUB_ADMIN" || role === "USER") {
    return role;
  }

  return null;
};

export const dispatchAuthChange = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("auth:changed"));
};

export const persistAuthData = (token: string, user: StoredUser | null) => {
  if (typeof window === "undefined") return;

  window.localStorage.setItem("token", token);

  if (user) {
    window.localStorage.setItem("user", JSON.stringify(user));
  }

  dispatchAuthChange();
};

export const clearAuthData = () => {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem("token");
  window.localStorage.removeItem("user");
  dispatchAuthChange();
};
