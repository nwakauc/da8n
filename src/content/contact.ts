/**
 * Contact routes for the DA8N public site.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS FILE EXISTS AT ALL, AND WHY EVERY ADDRESS IN IT IS REAL
 *
 * Until now this site had no contact route, and two pages depended on one.
 * `/terms` said "if you believe something here is wrong, tell us at
 * [awaiting contact route]" and `/privacy` said the same about data requests.
 * A legal page that instructs a reader to get in touch and then does not say
 * how is worse than one that says nothing: it documents an obligation and
 * fails it in the same sentence. Under UK and EU data protection law a privacy
 * notice without a contact route is not compliant.
 *
 * So the brackets are gone from both pages and this is what replaced them.
 *
 * EVERY ADDRESS BELOW ALREADY EXISTS AND IS ALREADY MONITORED. They are the
 * D8N platform mailboxes from `apps/d8n/web/src/content/contact.ts`, and DA8N
 * is a D8N product — `trust@d8n.tech` is documented there as covering "a
 * safety concern about a D8N product, a security issue, or something on this
 * site you believe is wrong", which is exactly what `/terms` section 8 asks a
 * reader to report.
 *
 * NOTHING HERE WAS INVENTED. A plausible-looking `hello@da8n.com` would have
 * read better and would have been a placeholder of the worst kind — one that
 * looks finished, passes review, and silently drops a data subject's access
 * request on the floor. The one address this site genuinely still needs is the
 * controller's own privacy mailbox on the DA8N domain, and that is held as a
 * single visible `Awaiting` on `/contact` rather than quietly guessed. It is
 * blocking for launch and recorded in the README.
 *
 * MEMBER MATTERS DO NOT BELONG IN AN INBOX. Account, profile, verification,
 * membership and deletion all live in the member application, and reporting a
 * member has to happen in the app because that is where the conversation is —
 * a report by email arrives without the evidence attached to it. Those routes
 * point at the app, not at a mailbox, and that is a deliberate design choice
 * rather than an omission.
 * ---------------------------------------------------------------------------
 */

export type ContactRoute = {
  readonly slug: string;
  readonly heading: string;
  /** Small label above the heading. Who this route is for. */
  readonly audience: string;
  readonly body: string;
  /**
   * Where it goes. `email` renders a mailto with a pre-filled subject so the
   * enquiry arrives already triaged; `app` hands the person to the member
   * application, which owns the session and the data.
   */
  readonly destination:
    | { readonly kind: "email"; readonly address: string; readonly subject: string }
    | { readonly kind: "app"; readonly path: string; readonly label: string }
    | { readonly kind: "page"; readonly path: string; readonly label: string };
};

export const CONTACT_PAGE = {
  kicker: "CONTACT",
  title: "Getting in touch",
  lede:
    "Where each kind of question actually goes. Anything about your account or another member is handled in the app, because that is where your profile and your conversations are.",
} as const;

export const CONTACT_ROUTES: readonly ContactRoute[] = [
  {
    slug: "safety",
    heading: "Report a safety concern",
    audience: "TRUST & SAFETY",
    body:
      "If it concerns a conversation or another member — a money request, pressure, threats, or a profile that is not who it says it is — report it from inside the app. Block first and report second; blocking takes effect immediately and does not wait for a review, and a report made in the app arrives with the conversation attached to it. For a safety or security concern about this website itself, write to the platform trust team. If you are in immediate danger, contact your local emergency services first, and if money or bank details have been shared, contact your bank before anything else.",
    destination: {
      kind: "email",
      address: "trust@d8n.tech",
      subject: "DA8N website — trust and safety",
    },
  },
  {
    slug: "account",
    heading: "Your account, profile or membership",
    audience: "FOR MEMBERS",
    body:
      "Signing in, your profile, verification status, membership and deleting your account are all handled in the app. Plans and prices live there too, because they depend on your market and this site does not know it. This website has no account area and cannot look anything up for you.",
    destination: { kind: "app", path: "/sign-in", label: "Go to the app" },
  },
  {
    slug: "privacy",
    heading: "Privacy and your data",
    audience: "DATA REQUESTS",
    body:
      "To ask what is held about you, to correct it, to object to its use or to have it deleted, start with the privacy notice — it sets out what this website collects, which is very little, and what the member application holds, which is a separate matter handled in the app. Requests about the website go to the controller's privacy contact.",
    destination: { kind: "page", path: "/privacy", label: "Read the privacy notice" },
  },
  {
    slug: "press",
    heading: "Press, partnerships and everything else",
    audience: "BUSINESS",
    body:
      "Press enquiries, partnership proposals, and anything on this site you believe is factually wrong — including a comparison claim about another product. Comparison claims carry the date they were last checked, so tell us which page and what you think is out of date.",
    destination: { kind: "email", address: "hello@d8n.tech", subject: "DA8N enquiry" },
  },
];

export function mailto(route: ContactRoute): string | null {
  if (route.destination.kind !== "email") return null;
  const { address, subject } = route.destination;
  return `mailto:${address}?subject=${encodeURIComponent(subject)}`;
}
