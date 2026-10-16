export async function POST(request) {
  let body;
  try { body=await request.json(); }
  catch { return Response.json({error:"Invalid submission."},{status:400}); }
  const name=String(body.name||"").trim().replace(/\s+/g," ");
  const phone=String(body.phone||"").replace(/[\s()-]/g,"");
  if(name.length<2||name.length>100||!/^\+?[0-9]{10,15}$/.test(phone))
    return Response.json({error:"Enter a valid name and phone number."},{status:400});
  const endpoint=process.env.WC_GOOGLE_SCRIPT_URL || process.env.GOOGLE_SCRIPT_URL || process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;
  const secret=process.env.WC_SHARED_SECRET;
  if(!endpoint||!secret) return Response.json({error:"Registration backend is not configured."},{status:503});
  try {
    const upstream=await fetch(endpoint,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify({action:"worldConferenceRegister",name,phone,secret}),redirect:"follow",cache:"no-store",signal:AbortSignal.timeout(25000)});
    if(!upstream.ok) throw Error("Backend unavailable");
    const data=await upstream.json();
    if(data.success===true) return Response.json({message:"Registration successful!",registrationId:data.registrationId});
    return Response.json({error:data.error||"Registration could not be completed."},{status:data.duplicate?409:400});
  } catch { return Response.json({error:"Unable to confirm registration. Please try again later."},{status:502}); }
}