const LOCATIONS = ["Lusada", "Agbara", "Ijanikin"];

export async function POST(request) {
  let data;
  try { data = await request.json(); }
  catch { return Response.json({ success: false, error: "Invalid request data." }, { status: 400 }); }
  if (!data || typeof data.name !== "string" || typeof data.code !== "string") {
    return Response.json({ success: false, error: "Full name and registration code are required." }, { status: 400 });
  }
  const name = data.name.trim();
  const code = data.code.trim().toUpperCase();
  if (!name || name.length > 150 || !/^MWR-\d{4,}$/.test(code) || code.length > 30 || !LOCATIONS.includes(data.location)) {
    return Response.json({ success: false, error: "Enter your ticket name, a valid MWR registration code, and one pickup location." }, { status: 400 });
  }
  const endpoint = process.env.GOOGLE_SCRIPT_URL || process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;
  if (!endpoint) return Response.json({ success: false, error: "Transport registration is not configured yet." }, { status: 503 });
  try {
    const upstream = await fetch(endpoint, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "transportation", name, code, location: data.location }),
      redirect: "follow", signal: AbortSignal.timeout(25000), cache: "no-store",
    });
    if (!upstream.ok) throw new Error("Backend request failed");
    const result = await upstream.json();
    if (result.success !== true) {
      return Response.json({ success: false, error: typeof result.error === "string" ? result.error : "Your request could not be saved." }, { status: 400 });
    }
    const transport = result.transportation;
    if (!transport || typeof transport.name !== "string" || transport.code !== code || !LOCATIONS.includes(transport.location)) {
      return Response.json({ success: false, error: "Transport registration needs the updated Apps Script backend. Please contact the organisers." }, { status: 502 });
    }
    return Response.json({ success: true, transportation: { name: transport.name, code: transport.code, location: transport.location, alreadyRegistered: transport.alreadyRegistered === true } });
  } catch {
    return Response.json({ success: false, error: "Unable to confirm your transport request. Please try again; duplicate requests will not create another entry." }, { status: 502 });
  }
}
