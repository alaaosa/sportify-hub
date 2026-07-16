import { useParams } from "react-router-dom";
import type { Page } from "../components/Navbar";

const DEFAULT_CLUB_ID = 5;

export const parseClubId = (value?: string | null): number => {
  const parsed = Number(value);
  if (Number.isInteger(parsed) && parsed > 0) {
    return parsed;
  }
  return DEFAULT_CLUB_ID;
};

export const getStoredClubId = (): number => {
  if (typeof window === "undefined") {
    return DEFAULT_CLUB_ID;
  }

  const stored = window.localStorage.getItem("clubId");
  return parseClubId(stored);
};

export const getClubIdFromLocation = (pathname: string): number => {
  const match = pathname.match(
    /^\/(clubs|dashboard|activities|events|members|memberships|bookings|coaches|payments|reports)\/(\d+)/,
  );

  if (!match) {
    return 0;
  }

  return parseClubId(match[2]);
};

export const useClubId = (): number => {
  const params = useParams<{ clubId?: string }>();
  const clubId = parseClubId(params.clubId ?? null);
  if (clubId > 0) {
    return clubId;
  }
  return getStoredClubId();
};

export const clubPagePath = (page: Page, clubId: number): string => {
  switch (page) {
    case "dashboard":
      return `/dashboard/$${clubId}`;
    case "activities":
      return `/activities/$${clubId}`;
    case "events":
      return `/events/$${clubId}`;
    case "club-profile":
      return `/clubs/$${clubId}`;
    case "members":
      return `/members/$${clubId}`;
    case "memberships":
      return `/memberships/$${clubId}`;
    case "bookings":
      return `/bookings/$${clubId}`;
    case "coaches":
      return `/coaches/$${clubId}`;
    case "payments":
      return `/payments/$${clubId}`;
    case "reports":
      return `/reports/$${clubId}`;
    default:
      return "/";
  }
};

export const isClubPage = (page: Page): boolean =>
  [
    "dashboard",
    "activities",
    "events",
    "club-profile",
    "members",
    "memberships",
    "bookings",
    "coaches",
    "payments",
    "reports",
  ].includes(page);
