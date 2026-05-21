import { Resend } from 'resend';
import type { BookingRow } from './supabase/types';
import { buildWhatsAppLink, formatEur, formatDuration } from './utils';

function getResend() {
  if (!process.env.RESEND_API_KEY) throw new Error('RESEND_API_KEY is not set');
  return new Resend(process.env.RESEND_API_KEY);
}

type Booking = BookingRow;

function getSubject(booking: Booking): string {
  const pickupCity = booking.pickup_address.split(',')[0];
  const dropoffCity = booking.dropoff_address.split(',')[0];
  if (booking.locale === 'ro') {
    return `Rezervarea ta VOLTLANE · ${pickupCity} → ${dropoffCity}`;
  }
  return `Your VOLTLANE booking · ${pickupCity} → ${dropoffCity}`;
}

function customerHtml(booking: Booking): string {
  const waLink = buildWhatsAppLink(
    process.env.WHATSAPP_NUMBER || '',
    `Hi, I have a question about booking ${booking.id}`
  );
  const isEn = booking.locale !== 'ro';

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>VOLTLANE Booking Confirmation</title>
</head>
<body style="background:#0A0A0B;color:#F5F4F0;font-family:sans-serif;margin:0;padding:40px 20px;">
<div style="max-width:560px;margin:0 auto;">
  <h1 style="font-size:28px;font-weight:700;color:#7EFFA1;margin-bottom:8px;">VOLT•LANE</h1>
  <p style="color:#A8A8B0;margin-bottom:32px;">${isEn ? "Premium Electric Transfers" : "Transferuri Electrice Premium"}</p>

  <h2 style="font-size:22px;font-weight:600;margin-bottom:16px;">
    ${isEn ? "Your booking is received!" : "Rezervarea ta a fost primită!"}
  </h2>
  <p style="color:#A8A8B0;margin-bottom:32px;">
    ${isEn ? "We'll confirm within 1 hour via email and WhatsApp." : "Vom confirma în maxim 1 oră prin email și WhatsApp."}
  </p>

  <div style="background:#1C1C24;border:1px solid #2A2A35;border-radius:12px;padding:24px;margin-bottom:24px;">
    <p style="font-size:12px;color:#6A6A75;font-family:monospace;margin:0 0 8px;">BOOKING ID</p>
    <p style="font-size:16px;font-family:monospace;color:#7EFFA1;margin:0;">${booking.id}</p>
  </div>

  <div style="background:#1C1C24;border:1px solid #2A2A35;border-radius:12px;padding:24px;margin-bottom:24px;">
    <table style="width:100%;border-collapse:collapse;">
      <tr><td style="padding:8px 0;color:#A8A8B0;font-size:14px;">${isEn ? "Route" : "Rută"}</td>
        <td style="padding:8px 0;text-align:right;font-size:14px;">${booking.pickup_address.split(',')[0]} → ${booking.dropoff_address.split(',')[0]}</td></tr>
      <tr><td style="padding:8px 0;color:#A8A8B0;font-size:14px;">${isEn ? "Vehicle" : "Vehicul"}</td>
        <td style="padding:8px 0;text-align:right;font-size:14px;">${booking.vehicle_id.replace(/_/g, ' ')}</td></tr>
      <tr><td style="padding:8px 0;color:#A8A8B0;font-size:14px;">${isEn ? "Date" : "Data"}</td>
        <td style="padding:8px 0;text-align:right;font-size:14px;">${new Date(booking.pickup_datetime).toLocaleString('en-GB', { timeZone: 'Europe/Bucharest' })}</td></tr>
      <tr><td style="padding:8px 0;color:#A8A8B0;font-size:14px;">${isEn ? "Distance" : "Distanță"}</td>
        <td style="padding:8px 0;text-align:right;font-size:14px;">${booking.distance_km} km · ${formatDuration(booking.duration_minutes)}</td></tr>
      <tr style="border-top:1px solid #2A2A35;">
        <td style="padding:12px 0 0;font-weight:700;font-size:16px;">${isEn ? "Total" : "Total"}</td>
        <td style="padding:12px 0 0;text-align:right;font-weight:700;font-size:20px;color:#E5C687;">${formatEur(booking.total_price_eur)}</td></tr>
    </table>
  </div>

  <a href="${waLink}" style="display:block;background:#25D366;color:#fff;text-align:center;padding:14px 24px;border-radius:100px;text-decoration:none;font-weight:600;margin-bottom:32px;">
    ${isEn ? "💬 Chat on WhatsApp" : "💬 Chat pe WhatsApp"}
  </a>

  <p style="color:#6A6A75;font-size:12px;text-align:center;">
    ${isEn ? "Questions? Reply to this email or reach us on WhatsApp." : "Întrebări? Răspundeți la acest email sau contactați-ne pe WhatsApp."}
  </p>
</div>
</body>
</html>`;
}

function adminHtml(booking: Booking): string {
  const waLink = buildWhatsAppLink(
    booking.customer_phone,
    `Hi ${booking.customer_name}, confirming your VOLTLANE booking ${booking.id} ✅`
  );

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:sans-serif;padding:32px;background:#f5f5f5;">
<div style="max-width:600px;margin:0 auto;background:#fff;border-radius:8px;padding:32px;">
  <h2 style="color:#0A0A0B;margin-bottom:24px;">🚗 New VOLTLANE Booking</h2>
  <table style="width:100%;border-collapse:collapse;font-size:14px;">
    <tr style="background:#f9f9f9;"><td style="padding:10px;font-weight:600;width:40%;">Customer</td><td style="padding:10px;">${booking.customer_name}</td></tr>
    <tr><td style="padding:10px;font-weight:600;">Email</td><td style="padding:10px;"><a href="mailto:${booking.customer_email}">${booking.customer_email}</a></td></tr>
    <tr style="background:#f9f9f9;"><td style="padding:10px;font-weight:600;">Phone</td><td style="padding:10px;">${booking.customer_phone}</td></tr>
    <tr><td style="padding:10px;font-weight:600;">Route</td><td style="padding:10px;">${booking.pickup_address} → ${booking.dropoff_address}</td></tr>
    <tr style="background:#f9f9f9;"><td style="padding:10px;font-weight:600;">Vehicle</td><td style="padding:10px;">${booking.vehicle_id}</td></tr>
    <tr><td style="padding:10px;font-weight:600;">Date</td><td style="padding:10px;">${new Date(booking.pickup_datetime).toLocaleString('en-GB', { timeZone: 'Europe/Bucharest' })}</td></tr>
    <tr style="background:#f9f9f9;"><td style="padding:10px;font-weight:600;">Distance</td><td style="padding:10px;">${booking.distance_km} km</td></tr>
    <tr><td style="padding:10px;font-weight:600;">Total</td><td style="padding:10px;font-weight:700;color:#2a7a2a;font-size:18px;">€${booking.total_price_eur}</td></tr>
    ${booking.flight_number ? `<tr style="background:#f9f9f9;"><td style="padding:10px;font-weight:600;">Flight</td><td style="padding:10px;">${booking.flight_number}</td></tr>` : ''}
    ${booking.notes ? `<tr><td style="padding:10px;font-weight:600;">Notes</td><td style="padding:10px;">${booking.notes}</td></tr>` : ''}
  </table>
  <div style="margin-top:24px;display:flex;gap:12px;">
    <a href="${waLink}" style="background:#25D366;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;">💬 WhatsApp Customer</a>
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/en/admin/bookings/${booking.id}" style="background:#0A0A0B;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;">View in Admin</a>
  </div>
</div>
</body>
</html>`;
}

export async function sendBookingEmails(booking: Booking) {
  const resend = getResend();
  await Promise.all([
    resend.emails.send({
      from: `VOLTLANE <${process.env.RESEND_FROM_EMAIL || 'hello@voltlane.com'}>`,
      to: [booking.customer_email],
      subject: getSubject(booking),
      html: customerHtml(booking),
    }),
    resend.emails.send({
      from: `VOLTLANE <${process.env.RESEND_FROM_EMAIL || 'hello@voltlane.com'}>`,
      to: [process.env.ADMIN_EMAIL || 'hello@voltlane.com'],
      subject: `🚗 New booking · ${booking.customer_name} · ${booking.pickup_address.split(',')[0]} → ${booking.dropoff_address.split(',')[0]} · €${booking.total_price_eur}`,
      html: adminHtml(booking),
    }),
  ]);
}
