import { D8nMark } from "./icons";

/**
 * "Powered by D8N" chip, linking to the platform site.
 *
 * `rel="noopener noreferrer"` with `target="_blank"`: noopener because a new
 * tab must not get a handle on this window, noreferrer because the platform
 * site does not need this page's referrer to render.
 */
export function PoweredByD8n() {
  return (
    <a
      href="https://d8n.tech"
      target="_blank"
      rel="noopener noreferrer"
      title="Learn about the D8N platform"
      aria-label="Powered by D8N"
      className="d8n-chip"
    >
      <D8nMark size={28} />
      <span>
        Powered by <b>D8N</b>
      </span>
    </a>
  );
}
