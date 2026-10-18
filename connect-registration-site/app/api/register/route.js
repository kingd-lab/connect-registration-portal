// Word Conference 2026 registration is closed.
// Keep this server-side guard so direct API requests cannot create new entries.
export async function POST() {
  return Response.json(
    { success: false, error: "Registration for Word Conference 2026 is officially closed." },
    { status: 410, headers: { "Cache-Control": "no-store" } }
  );
}
