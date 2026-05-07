import { Sparkles } from "lucide-react";

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const text =
    size === "lg" ? "text-2xl" : size === "sm" ? "text-base" : "text-lg";
  const icon = size === "lg" ? 28 : size === "sm" ? 18 : 22;
  return (
    <div className="flex items-center gap-2">
      <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-white shadow-card">
        <Sparkles size={icon} strokeWidth={2.4} />
      </div>
      <span className={`font-bold tracking-tight ${text}`}>
        Planet<span className="text-brand">AI</span>
      </span>
    </div>
  );
}
