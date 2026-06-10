import { redirect } from "next/navigation";

// Root domain → landing page jualan PlanetPrompt (mayoritas traffic dari ads).
// Member login tetap lewat /login (→ /app, lihat next.config.js).
export default function RootPage() {
  redirect("/planetprompt");
}
