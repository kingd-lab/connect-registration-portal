export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid submission." }, { status: 400 });
  }

  const name = String(body?.name || "").trim().replace(/\s+/g, " ");
  const phone = String(body?.phone || "").replace(/[\s()-]/g, "");

  if (name.length < 2 || name.length > 100 || !/^\+?[0-9]{10,15}$/.test(phone)) {
    return Response.json({ error: "Enter a valid name and phone number." }, { status: 400 });
  }

  const endpoint = process.env.WC_GOOGLE_SCRIPT_URL ||
    process.env.GOOGLE_SCRIPT_URL ||
    process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;
  const secret = process.env.WC_SHARED_SECRET;

  if (!endpoint || !secret) {
    return Response.json({ error: "Registration backend is not configured." }, { status: 503 });
  }

  try {
    const upstream = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "worldConferenceRegister", name, phone, secret }),
      redirect: "follow",
      cache: "no-store",
      signal: AbortSignal.timeout(55000)
    });

    const raw = await upstream.text();
    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      console.error("WC upstream non-JSON response", {
        status: upstream.status,
        contentType: upstream.headers.get("content-type"),
        responseLength: raw.length
      });
      return Response.json({
        error: "We couldn't confirm the result. Check with the organisers before submitting again.",
        uncertain: true
      }, { status: 502 });
    }

    if (!upstream.ok) {
      console.error("WC upstream HTTP error", { status: upstream.status });
      return Response.json({
        error: "We couldn't confirm the result. Check with the organisers before submitting again.",
        uncertain: true
      }, { status: 502 });
    }

    if (data.success === true && typeof data.registrationId === "string") {
      return Response.json({ success: true, message: "Registration successful!", registrationId: data.registrationId });
    }

    if (data.duplicate === true) {
      return Response.json({
        error: data.error || "This phone number is already registered.",
        registrationId: data.registrationId
      }, { status: 409 });
    }

    return Response.json({ error: data.error || "Registration could not be completed." }, { status: 400 });
  } catch (error) {
    console.error("WC upstream connection failure", { name: error?.name, message: error?.message });
    return Response.json({
      error: "We couldn't confirm the result. Your details may already be saved. Check with the organisers before submitting again.",
      uncertain: true
    }, { status: 502 });
  }
}
