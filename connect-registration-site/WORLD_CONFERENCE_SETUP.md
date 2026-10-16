# World Conference 2026 — Apps Script integration

The Google Sheet already contains the tab `World Conference 2026` with columns Timestamp, Registration ID, Full Name, Phone Number, Registration Status.

## IMPORTANT
Keep your existing Apps Script functions. Add the function below to the same Apps Script project. In your existing `doPost(e)`, after parsing the request JSON into `data`, add:

```javascript
if (data.action === "worldConferenceRegister") return worldConferenceRegister_(data);
```

Do not create a second `doPost`. If your parsed request variable has another name, use that name instead.

## Additional Apps Script function

```javascript
function worldConferenceRegister_(data) {
  const json = obj => ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
  const expected = PropertiesService.getScriptProperties().getProperty("WC_SHARED_SECRET");
  if (!expected || !data || data.secret !== expected)
    return json({success:false,error:"Unauthorized"});
  const name = String(data.name || "").trim().replace(/\s+/g, " ");
  const phone = String(data.phone || "").replace(/[\s()-]/g, "");
  if (name.length < 2 || name.length > 100 || !/^\+?[0-9]{10,15}$/.test(phone))
    return json({success:false,error:"Invalid name or phone number"});
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) return json({success:false,error:"Please retry in a moment"});
  try {
    const sheet = SpreadsheetApp.openById("10elujG5-p_uUEBher98w7W2dCHhb48PKObv0Oy4lkKg")
      .getSheetByName("World Conference 2026");
    if (!sheet) return json({success:false,error:"Registration sheet not found"});
    const last = sheet.getLastRow();
    const digits = value => String(value).replace(/\D/g, "");
    const canonical = value => {
      let d = digits(value);
      if (d.startsWith("234") && d.length === 13) d = "0" + d.slice(3);
      return d;
    };
    if (last > 1) {
      const existing = sheet.getRange(2,4,last-1,1).getDisplayValues();
      if (existing.some(row => canonical(row[0]) === canonical(phone)))
        return json({success:false,duplicate:true,error:"This phone number is already registered."});
    }
    const id = "WC-" + String(last).padStart(4,"0");
    const next = last + 1;
    sheet.getRange(next,4).setNumberFormat("@");
    sheet.getRange(next,1,1,5).setValues([[new Date(),id,name,phone,"Registered"]]);
    SpreadsheetApp.flush();
    return json({success:true,registrationId:id});
  } finally {
    lock.releaseLock();
  }
}
```

## Deployment configuration

1. In Apps Script Project Settings > Script Properties, add `WC_SHARED_SECRET` with a long random value.
2. In Vercel project Environment Variables, add `WC_SHARED_SECRET` with exactly the same value.
3. Keep the existing Apps Script URL environment variable, or set `WC_GOOGLE_SCRIPT_URL` to the deployed web app URL.
4. Deploy a **new version** of the Apps Script web app, with Execute as: Me, and appropriate access for public registration through the Next.js server.
5. Redeploy the Vercel site if needed.
6. Test with a non-sensitive sample registration; verify the row appears in the World Conference tab and duplicates are rejected.
7. Once the public URL is confirmed, generate and print the QR code pointing to `https://YOUR-SITE/world-conference`.

Never publish the shared secret in client-side code, screenshots, or GitHub.
