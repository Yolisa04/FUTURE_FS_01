import httpx
from app.config import settings


async def send_booking_email(to_email: str, subject: str, html: str):
    """
    Fires a transactional email through Resend. If there's no API key
    configured (e.g. local dev), we just skip it quietly instead of
    blowing up the request - bookings shouldn't fail because email isn't
    wired up yet.
    """
    if not settings.RESEND_API_KEY:
        print(f"[notifications] RESEND_API_KEY not set, skipping email to {to_email}: {subject}")
        return

    async with httpx.AsyncClient() as client:
        try:
            await client.post(
                "https://api.resend.com/emails",
                headers={"Authorization": f"Bearer {settings.RESEND_API_KEY}"},
                json={
                    "from": settings.RESEND_FROM_EMAIL,
                    "to": [to_email],
                    "subject": subject,
                    "html": html,
                },
                timeout=10,
            )
        except httpx.HTTPError as e:
            print(f"[notifications] Resend email failed: {e}")


async def send_booking_sms(to_phone: str, body: str):
    if not (settings.TWILIO_ACCOUNT_SID and settings.TWILIO_AUTH_TOKEN and settings.TWILIO_FROM_NUMBER):
        print(f"[notifications] Twilio not configured, skipping SMS to {to_phone}: {body}")
        return

    url = f"https://api.twilio.com/2010-04-01/Accounts/{settings.TWILIO_ACCOUNT_SID}/Messages.json"
    async with httpx.AsyncClient() as client:
        try:
            await client.post(
                url,
                auth=(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN),
                data={"To": to_phone, "From": settings.TWILIO_FROM_NUMBER, "Body": body},
                timeout=10,
            )
        except httpx.HTTPError as e:
            print(f"[notifications] Twilio SMS failed: {e}")


def booking_confirmation_html(customer_name: str, service_name: str, date: str, time: str) -> str:
    return f"""
    <div style="font-family: Georgia, serif; color: #3a2e1f;">
      <h2 style="color:#a8672b;">Your appointment is confirmed</h2>
      <p>Hi {customer_name},</p>
      <p>We're looking forward to seeing you. Here are your booking details:</p>
      <ul>
        <li><strong>Service:</strong> {service_name}</li>
        <li><strong>Date:</strong> {date}</li>
        <li><strong>Time:</strong> {time}</li>
      </ul>
      <p>If you need to reschedule, just reply to this email.</p>
      <p>— Makasana Room</p>
    </div>
    """
