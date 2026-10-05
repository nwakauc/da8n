import Link from "next/link";
import type { City } from "@/content/cities";
import { cityPath } from "@/lib/routing";

/**
 * A city as a navigation chip. Used by the market page, the city page's
 * "Nearby" list and the `/cities` index, so the markup and the rules below
 * exist once rather than three times.
 *
 * `region` is suppressed when it repeats the city name. Several catalog
 * entries are city-states or eponymous regions — Dubai is in the emirate of
 * Dubai, Abu Dhabi in the emirate of Abu Dhabi, Lagos in Lagos State — and
 * rendering both produced "Dubai / Dubai". The region is there to disambiguate
 * (Houston, Texas; Atlanta, Georgia), so when it disambiguates nothing it
 * earns no pixels. `startsWith` rather than equality catches "Lagos" /
 * "Lagos State" too.
 */
export function regionLabel(city: City): string | null {
  const region = city.region?.trim();
  if (!region) return null;
  const name = city.name.toLowerCase();
  const value = region.toLowerCase();
  if (value === name || value.startsWith(`${name} `)) return null;
  return region;
}

export function CityChip({ city }: { readonly city: City }) {
  const region = regionLabel(city);

  return (
    <Link href={cityPath(city)} className="chip-link">
      <b>{city.name}</b>
      {region ? <span>{region}</span> : null}
    </Link>
  );
}
