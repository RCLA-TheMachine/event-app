import { Resend } from 'resend';
import { NextResponse } from 'next/server';

interface InschrijvingData {
  voornaam: string;
  achternaam: string;
  email: string;
  telefoon: string;
  aantal: number;
  petjes: number;
  opmerkingen: string | null;
  avondeten: boolean;
  totaalprijs: number;
  walkPrice: number;
  hatPrice: number;
}

export async function POST(request: Request) {
  try {
    const data: InschrijvingData = await request.json();

    const petjesRow = data.petjes > 0
      ? `<tr>
           <td style="padding:8px 0;color:#444;">${data.petjes} ${data.petjes === 1 ? 'petje' : 'petjes'} × €15</td>
           <td style="padding:8px 0;text-align:right;color:#444;">€${data.hatPrice}</td>
         </tr>`
      : '';

    const avondetenRow = data.avondeten
      ? `<tr>
           <td colspan="2" style="padding:8px 0;color:#0000CD;">✓ Mee-eten tijdens het avondmaal (niet inbegrepen in de prijs)</td>
         </tr>`
      : '';

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background-color:#FDE8DC;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 16px;">
    
    <!-- Header -->
    <div style="background-color:#0000CD;border-radius:16px 16px 0 0;padding:32px;text-align:center;">
      <h1 style="color:white;margin:0;font-size:24px;font-style:italic;">
        In de schaduw van de ooievaar
      </h1>
      <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:14px;">
        Wandeling • 29 augustus 2026 • Citadel van Diest
      </p>
    </div>

    <!-- Content -->
    <div style="background-color:white;padding:32px;border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb;">
      
      <h2 style="color:#0000CD;margin:0 0 8px;font-size:20px;">
        Bedankt voor je inschrijving, ${data.voornaam}!
      </h2>
      <p style="color:#555;margin:0 0 24px;font-size:15px;line-height:1.5;">
        We hebben je inschrijving goed ontvangen. Hieronder vind je een overzicht van je gegevens en de betalingsinformatie.
      </p>

      <!-- Gegevens -->
      <div style="background-color:#f9fafb;border-radius:12px;padding:20px;margin-bottom:24px;">
        <h3 style="color:#0000CD;margin:0 0 12px;font-size:16px;">Jouw gegevens</h3>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr>
            <td style="padding:4px 0;color:#888;width:140px;">Naam</td>
            <td style="padding:4px 0;color:#333;">${data.voornaam} ${data.achternaam}</td>
          </tr>
          <tr>
            <td style="padding:4px 0;color:#888;">E-mail</td>
            <td style="padding:4px 0;color:#333;">${data.email}</td>
          </tr>
          <tr>
            <td style="padding:4px 0;color:#888;">Telefoon</td>
            <td style="padding:4px 0;color:#333;">${data.telefoon}</td>
          </tr>
          <tr>
            <td style="padding:4px 0;color:#888;">Aantal personen</td>
            <td style="padding:4px 0;color:#333;">${data.aantal}</td>
          </tr>
          <tr>
            <td style="padding:4px 0;color:#888;">Aantal petjes</td>
            <td style="padding:4px 0;color:#333;">${data.petjes}</td>
          </tr>
          ${data.opmerkingen ? `<tr>
            <td style="padding:4px 0;color:#888;vertical-align:top;">Opmerkingen</td>
            <td style="padding:4px 0;color:#333;">${data.opmerkingen}</td>
          </tr>` : ''}
          ${avondetenRow}
        </table>
      </div>

      <!-- Prijsoverzicht -->
      <div style="background-color:#f0f0ff;border-radius:12px;padding:20px;margin-bottom:24px;border:1px solid rgba(0,0,205,0.1);">
        <h3 style="color:#0000CD;margin:0 0 12px;font-size:16px;">Prijsoverzicht</h3>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr>
            <td style="padding:8px 0;color:#444;">${data.aantal} ${data.aantal === 1 ? 'persoon' : 'personen'} × €30</td>
            <td style="padding:8px 0;text-align:right;color:#444;">€${data.walkPrice}</td>
          </tr>
          <tr>
            <td style="padding:4px 0 8px;color:#888;font-style:italic;padding-left:16px;font-size:13px;">${data.aantal} × lunch inbegrepen</td>
            <td></td>
          </tr>
          ${petjesRow}
          <tr>
            <td colspan="2" style="border-top:2px solid #0000CD;padding-top:12px;"></td>
          </tr>
          <tr>
            <td style="padding:4px 0;color:#0000CD;font-weight:bold;font-size:16px;">Totaal</td>
            <td style="padding:4px 0;text-align:right;color:#0000CD;font-weight:bold;font-size:20px;">€${data.totaalprijs}</td>
          </tr>
        </table>
      </div>

      <!-- Betaalinformatie -->
      <div style="background-color:#fffbeb;border-radius:12px;padding:20px;margin-bottom:24px;border:1px solid #f59e0b33;">
        <h3 style="color:#92400e;margin:0 0 12px;font-size:16px;">💳 Betalingsinformatie</h3>
        <p style="color:#78350f;margin:0 0 12px;font-size:14px;line-height:1.5;">
          Gelieve het totaalbedrag over te schrijven naar onderstaand rekeningnummer met je naam als mededeling.
        </p>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr>
            <td style="padding:4px 0;color:#92400e;width:140px;">Rekeningnummer</td>
            <td style="padding:4px 0;color:#78350f;font-weight:bold;font-family:monospace;font-size:15px;">BE11 1111 1111 1111</td>
          </tr>
          <tr>
            <td style="padding:4px 0;color:#92400e;">Bedrag</td>
            <td style="padding:4px 0;color:#78350f;font-weight:bold;">€${data.totaalprijs}</td>
          </tr>
          <tr>
            <td style="padding:4px 0;color:#92400e;">Mededeling</td>
            <td style="padding:4px 0;color:#78350f;font-weight:bold;">${data.voornaam} ${data.achternaam}</td>
          </tr>
        </table>
      </div>

      <p style="color:#888;font-size:13px;line-height:1.5;margin:0;">
        Heb je vragen? Antwoord gerust op deze e-mail. We kijken ernaar uit je te verwelkomen op 29 augustus 2026!
      </p>
    </div>

    <!-- Footer -->
    <div style="background-color:#0000CD;border-radius:0 0 16px 16px;padding:20px;text-align:center;">
      <p style="color:rgba(255,255,255,0.7);margin:0;font-size:13px;font-style:italic;">
        In de schaduw van de ooievaar • Wandeling 2026
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
