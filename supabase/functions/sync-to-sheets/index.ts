// ============================================================
// sync-to-sheets - Supabase Edge Function
// Menerima data dari aplikasi (login/profil, order, pembayaran)
// lalu menulis baris baru ke Google Sheets via Google Sheets API.
//
// Setup:
//   1. Buat Service Account di Google Cloud (IAM & Admin > Service Accounts)
//   2. Aktifkan Google Sheets API
//   3. Bagikan Google Sheet ke email service account (Viewer/Editor)
//   4. Set secrets di Supabase:
//      supabase secrets set SHEETS_CLIENT_EMAIL=xxx SHEETS_PRIVATE_KEY="..." SHEETS_SHEET_ID=xxx
//   5. Deploy: supabase functions deploy sync-to-sheets
// ============================================================

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Baca konfigurasi dari secrets environment
const CLIENT_EMAIL = Deno.env.get("SHEETS_CLIENT_EMAIL") || "";
const PRIVATE_KEY = (Deno.env.get("SHEETS_PRIVATE_KEY") || "").replace(/\\n/g, "\n");
const SHEET_ID = Deno.env.get("SHEETS_SHEET_ID") || "";

const SCOPES = "https://www.googleapis.com/auth/spreadsheets";
const SHEETS_API = "https://sheets.googleapis.com/v4/spreadsheets";

// --- Helper: buat JWT & tukar jadi access token Google ---
async function getGoogleAccessToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claimSet = {
    iss: CLIENT_EMAIL,
    scope: SCOPES,
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  };

  const base64Url = (obj: object) =>
    btoa(JSON.stringify(obj)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

  const signingInput = `${base64Url(header)}.${base64Url(claimSet)}`;

  // Import RSA private key (PKCS8) dan sign
  const key = await crypto.subtle.importKey(
    "pkcs8",
    pemToArrayBuffer(PRIVATE_KEY),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    new TextEncoder().encode(signingInput)
  );

  const jwt = `${signingInput}.${arrayBufferToBase64Url(signature)}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  const data = await res.json();
  if (!res.ok || !data.access_token) {
    throw new Error(`Gagal mendapatkan token Google: ${JSON.stringify(data)}`);
  }
  return data.access_token;
}

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const b64 = pem
    .replace("-----BEGIN PRIVATE KEY-----", "")
    .replace("-----END PRIVATE KEY-----", "")
    .replace(/\s+/g, "");
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

function arrayBufferToBase64Url(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// --- Helper: append baris ke sheet ---
async function appendRows(token: string, range: string, values: string[][]) {
  const url = `${SHEETS_API}/${SHEET_ID}/values/${range}:append?valueInputOption=USER_ENTERED`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ values }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gagal menulis ke sheet: ${err}`);
  }
  return res.json();
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    const { type } = payload; // "profile" | "order"
    const timestamp = new Date().toISOString();

    if (type === "profile") {
      const { parent_name, email, phone, child_name, child_age, special_needs } = payload;
      await appendRows(
        await getGoogleAccessToken(),
        "Profil!A:G",
        [[
          timestamp,
          parent_name || "",
          email || "",
          phone || "",
          child_name || "",
          String(child_age ?? ""),
          special_needs || "",
        ]]
      );
    } else if (type === "order") {
      const {
        course_title,
        course_category,
        child_name,
        whatsapp,
        voucher_code,
        discount,
        total_amount,
        status,
      } = payload;
      await appendRows(
        await getGoogleAccessToken(),
        "Order!A:I",
        [[
          timestamp,
          course_title || "",
          course_category || "",
          child_name || "",
          whatsapp || "",
          voucher_code || "",
          String(discount ?? 0),
          String(total_amount ?? 0),
          status || "paid",
        ]]
      );
    } else {
      return new Response(JSON.stringify({ error: "Tipe data tidak dikenal" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
