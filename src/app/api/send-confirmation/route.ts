import { Resend } from 'resend';
import { NextResponse } from 'next/server';

interface InschrijvingData {
  voornaam: string;
  achternaam: string;
  email: string;
  telefoon: string;
  aantal: number;
  petjes: number;
  avondeten: number;
  totaalprijs: number;
  walkPrice: number;
  hatPrice: number;
}

export async function POST(request: Request) {
  try {
    const data: InschrijvingData = await request.json();

    const petjesRowGegevens = data.petjes > 0
      ? `<tr>
           <td style="padding:4px 0;color:#888;width:160px;">Petjes</td>
           <td style="padding:4px 0;color:#333;">${data.petjes}</td>
         </tr>`
      : '';

    const avondetenRowGegevens = data.avondeten > 0
      ? `<tr>
           <td style="padding:4px 0;color:#888;width:160px;">Avondmaal</td>
           <td style="padding:4px 0;color:#333;">${data.avondeten} ${data.avondeten === 1 ? 'persoon' : 'personen'}</td>
         </tr>`
      : '';

    const petjesRowPrijs = data.petjes > 0
      ? `<tr>
           <td style="padding:6px 0;color:#444;">${data.petjes} ${data.petjes === 1 ? 'petje' : 'petjes'} &times; &euro;15</td>
           <td style="padding:6px 0;text-align:right;color:#444;">&euro;${data.hatPrice}</td>
         </tr>`
      : '';

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background-color:#FDE8DC;font-family:Georgia,serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 16px;">

    <!-- Header -->
    <div style="background-color:#0000CD;border-radius:16px 16px 0 0;padding:36px 32px;text-align:center;">
      <h1 style="color:white;margin:0;font-size:26px;font-style:italic;font-weight:bold;letter-spacing:-0.3px;">
        In de schaduw van de ooievaar
      </h1>
      <p style="color:rgba(255,255,255,0.65);margin:8px 0 0;font-size:13px;font-family:Arial,sans-serif;letter-spacing:0.05em;">
        WANDELING 2026
      </p>
    </div>

    <!-- Save the date banner -->
    <div style="background-color:#f0f0ff;border-left:4px solid #0000CD;border-right:1px solid rgba(0,0,205,0.12);padding:18px 24px;display:flex;align-items:center;">
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="font-family:Arial,sans-serif;font-size:11px;font-weight:bold;letter-spacing:0.12em;color:#0000CD;opacity:0.5;text-transform:uppercase;padding-bottom:4px;">
            Bewaar de datum
          </td>
        </tr>
        <tr>
          <td style="font-family:Georgia,serif;font-size:18px;font-weight:bold;color:#0000CD;">
            29 augustus 2026
          </td>
          <td style="font-family:Arial,sans-serif;font-size:13px;color:#0000CD;opacity:0.6;text-align:right;vertical-align:middle;">
            Citadel van Diest
          </td>
        </tr>
      </table>
    </div>

    <!-- Content -->
    <div style="background-color:white;padding:32px;border-left:1px solid rgba(0,0,205,0.1);border-right:1px solid rgba(0,0,205,0.1);">

      <h2 style="color:#0000CD;margin:0 0 8px;font-size:20px;font-style:italic;">
        Bedankt, ${data.voornaam}!
      </h2>
      <p style="color:#666;margin:0 0 28px;font-size:14px;line-height:1.6;font-family:Arial,sans-serif;">
        Je inschrijving is goed ontvangen. Hieronder vind je een overzicht en de betalingsinformatie.
      </p>

      <!-- Inschrijvingsoverzicht -->
      <div style="background-color:#fafafa;border-radius:12px;padding:20px 24px;margin-bottom:20px;border:1px solid #f0f0f0;">
        <p style="font-family:Arial,sans-serif;font-size:11px;font-weight:bold;letter-spacing:0.12em;color:#0000CD;opacity:0.45;text-transform:uppercase;margin:0 0 12px;">
          Jouw inschrijving
        </p>
        <table style="width:100%;border-collapse:collapse;font-size:14px;font-family:Arial,sans-serif;">
          <tr>
            <td style="padding:4px 0;color:#888;width:160px;">Naam</td>
            <td style="padding:4px 0;color:#222;font-weight:600;">${data.voornaam} ${data.achternaam}</td>
          </tr>
          <tr>
            <td style="padding:4px 0;color:#888;">Personen</td>
            <td style="padding:4px 0;color:#333;">${data.aantal}</td>
          </tr>
          ${petjesRowGegevens}
          ${avondetenRowGegevens}
        </table>
      </div>

      <!-- Prijsoverzicht -->
      <div style="background-color:#f0f0ff;border-radius:12px;padding:20px 24px;margin-bottom:20px;border:1px solid rgba(0,0,205,0.1);">
        <p style="font-family:Arial,sans-serif;font-size:11px;font-weight:bold;letter-spacing:0.12em;color:#0000CD;opacity:0.45;text-transform:uppercase;margin:0 0 12px;">
          Prijsoverzicht
        </p>
        <table style="width:100%;border-collapse:collapse;font-size:14px;font-family:Arial,sans-serif;">
          <tr>
            <td style="padding:6px 0;color:#444;">${data.aantal} ${data.aantal === 1 ? 'persoon' : 'personen'} &times; &euro;30</td>
            <td style="padding:6px 0;text-align:right;color:#444;">&euro;${data.walkPrice}</td>
          </tr>
          <tr>
            <td style="padding:0 0 6px;color:#999;font-size:12px;padding-left:12px;">${data.aantal}&times; lunch inbegrepen</td>
            <td></td>
          </tr>
          ${petjesRowPrijs}
          <tr>
            <td colspan="2" style="border-top:1px solid rgba(0,0,205,0.15);padding-top:10px;"></td>
          </tr>
          <tr>
            <td style="padding:4px 0;color:#0000CD;font-weight:bold;font-size:15px;">Totaal</td>
            <td style="padding:4px 0;text-align:right;color:#0000CD;font-weight:bold;font-size:22px;">&euro;${data.totaalprijs}</td>
          </tr>
        </table>
      </div>

      <!-- Betaalinformatie -->
      <div style="background-color:#fdf6f0;border-radius:12px;padding:20px 24px;margin-bottom:28px;border:1px solid rgba(0,0,205,0.1);">
        <p style="font-family:Arial,sans-serif;font-size:11px;font-weight:bold;letter-spacing:0.12em;color:#0000CD;opacity:0.45;text-transform:uppercase;margin:0 0 12px;">
          Betaling
        </p>
        <p style="color:#555;margin:0 0 14px;font-size:14px;line-height:1.6;font-family:Arial,sans-serif;">
          Gelieve het totaalbedrag over te schrijven met je naam als mededeling.
        </p>
        <table style="width:100%;border-collapse:collapse;font-size:14px;font-family:Arial,sans-serif;">
          <tr>
            <td style="padding:4px 0;color:#888;width:160px;">Rekeningnummer</td>
            <td style="padding:4px 0;color:#222;font-weight:bold;font-family:monospace;font-size:15px;letter-spacing:0.04em;">BE11 1111 1111 1111</td>
          </tr>
          <tr>
            <td style="padding:4px 0;color:#888;">Bedrag</td>
            <td style="padding:4px 0;color:#222;font-weight:bold;">&euro;${data.totaalprijs}</td>
          </tr>
          <tr>
            <td style="padding:4px 0;color:#888;">Mededeling</td>
            <td style="padding:4px 0;color:#222;font-weight:bold;">${data.voornaam} ${data.achternaam}</td>
          </tr>
        </table>
      </div>

      <p style="color:#999;font-size:13px;line-height:1.6;margin:0;font-family:Arial,sans-serif;">
        Heb je vragen? Antwoord gerust op deze e-mail. We kijken ernaar uit je te verwelkomen op 29 augustus!
      </p>
    </div>

    <!-- Footer -->
    <div style="background-color:#0000CD;border-radius:0 0 16px 16px;padding:20px 32px;text-align:center;">
      <p style="color:rgba(255,255,255,0.6);margin:0 0 4px;font-size:12px;font-style:italic;font-family:Georgia,serif;">
        In de schaduw van de ooievaar &bull; Wandeling 2026
      </p>
      <p style="margin:0;">
        <a href="https://indeschaduwvandeooievaar.be" style="color:rgba(255,255,255,0.4);font-size:11px;font-family:Arial,sans-serif;text-decoration:none;letter-spacing:0.04em;">
          indeschaduwvandeooievaar.be
        </a>
      </p>
    </div>

  </div>
</body>
</html>`;

    const resend = new Resend(process.env.RESEND_API_KEY);

    const { error } = await resend.emails.send({
      from: 'In de schaduw van de ooievaar <noreply@indeschaduwvandeooievaar.be>',
      replyTo: 'info@indeschaduwvandeooievaar.be',
      to: data.email,
      subject: `Bevestiging inschrijving — In de schaduw van de ooievaar`,
      html: htmlContent,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
