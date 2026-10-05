import type { Metadata } from "next";
import { NOINDEX_METADATA } from "@/lib/seo";
import Link from "next/link";

export const metadata: Metadata = { title: "Not found", ...NOINDEX_METADATA };

export default function NotFound() {
  return (
    <div className="da8n-shell">
      <h1>Not found</h1>
      <p>
        That page does not exist. <Link href="/">Start from the beginning</Link>.
      </p>
    </div>
  );
}
