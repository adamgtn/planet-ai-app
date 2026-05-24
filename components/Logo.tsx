export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const dim =
    size === "lg" ? "h-12 w-12" : size === "sm" ? "h-7 w-7" : "h-9 w-9";
  const text =
    size === "lg" ? "text-2xl" : size === "sm" ? "text-base" : "text-lg";

  return (
    <div className="flex items-center gap-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/planetsoft-icon.png"
        alt="PlanetSoft"
        className={`${dim} shrink-0 object-contain`}
      />
      <span className={`font-bold tracking-tight ${text}`}>
        planet<span className="text-brand">soft</span>
      </span>
    </div>
  );
}
