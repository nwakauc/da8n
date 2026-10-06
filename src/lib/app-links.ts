/**
 * Where member actions go.
 *
 * This app has no authenticated area. Join and sign-in belong to the member
 * application, which still lives in the Date9ja app until DA8N is proven —
 * see README "The boundary". Routing those CTAs through one module means the
 * eventual cutover is a single env change, not a sweep for hardcoded hosts.
 *
 * The session cookie is host-only (`d8n_web_session`, no `Domain=`), so a
 * member signed in on one host is NOT signed in on the other. These links
 * therefore cross an authentication boundary on purpose: they hand the member
 * to the app that owns the session, rather than pretending this host can.
 */

const DEFAULT_APP_ORIGIN = "https://www.date9ja.love";

function appOrigin(): string {
  const configured = process.env.NEXT_PUBLIC_APP_ORIGIN?.trim();
  if (!configured) return DEFAULT_APP_ORIGIN;
  return configured.replace(/\/+$/, "");
}

/** An absolute URL into the member application. */
export function appUrl(path: string): string {
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${appOrigin()}${suffix}`;
}

export const JOIN_URL = () => appUrl("/sign-up");
export const SIGN_IN_URL = () => appUrl("/sign-in");

/**
 * The Android app listing.
 *
 * It is the DATE9JA app, not a DA8N one — there is no DA8N build. That is the
 * same boundary every other member CTA on this site crosses (see the module
 * note above), kept in one place so the cutover is one env change. There is no
 * iOS listing to point at, which is why the iOS badge is a label.
 */
const DEFAULT_ANDROID_URL = "https://play.google.com/store/apps/details?id=love.date9ja.mobile";

export function androidStoreUrl(): string {
  return process.env.NEXT_PUBLIC_ANDROID_STORE_URL?.trim() || DEFAULT_ANDROID_URL;
}
