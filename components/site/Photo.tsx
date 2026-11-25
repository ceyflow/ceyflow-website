import { PHOTOS, type PhotoSlot } from "../../lib/sitePhotos";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** A photo from lib/sitePhotos.ts. Renders nothing if that slot has no photo yet. */
export function Photo({ slot, className = "" }: { slot: PhotoSlot; className?: string }) {
  const p = PHOTOS[slot];
  if (!p) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={`${BASE}${p.src}`} alt={p.alt} width={p.width} height={p.height} loading="lazy" decoding="async" className={`h-auto w-full object-cover ${className}`} />
  );
}

/** A wide photo with an optional caption, for between sections. Renders nothing without a photo. */
export function PhotoBand({ slot, className = "" }: { slot: PhotoSlot; className?: string }) {
  const p = PHOTOS[slot];
  if (!p) return null;
  return (
    <figure className={`mx-auto max-w-6xl px-4 ${className}`}>
      <Photo slot={slot} className="aspect-[16/8] rounded-md md:aspect-[16/7]" />
      {p.caption && <figcaption className="mt-3 text-sm text-slate-500">{p.caption}</figcaption>}
    </figure>
  );
}
