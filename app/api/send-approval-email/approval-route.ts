import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const {
      firstName,
      lastName,
      playerId,
      tournamentTitle,
      tournamentDate,
      tournamentLocation,
      tournamentPrice,
      whatsappUrl,
      payboxUrl,
    } = await request.json();

    // מושכים את האימייל של השחקן מ-Supabase Auth
    const supabase = createClient();
    const { data: { user } } = await (supabase as any).auth.admin.getUserById(playerId);
    const playerEmail = user?.email;

    if (!playerEmail) {
      return NextResponse.json({ error: 'Email not found' }, { status: 404 });
    }

    const { error } = await resend.emails.send({
      from: 'בית הפאדל <noreply@israelpadel.com>',
      to: playerEmail,
      subject: `✅ הרשמתך אושרה — ${tournamentTitle}`,
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="he">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,sans-serif;direction:rtl;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;max-width:600px;width:100%;">

                  <!-- Header -->
                  <tr>
                    <td style="background:#0a1628;padding:32px;text-align:center;">
                      <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:900;">
                        בית <span style="color:#60a5fa;">הפאדל</span>
                      </h1>
                      <p style="margin:8px 0 0;color:#93c5fd;font-size:14px;">israelpadel.com</p>
                    </td>
                  </tr>

                  <!-- Green success bar -->
                  <tr>
                    <td style="background:#16a34a;padding:14px;text-align:center;">
                      <p style="margin:0;color:#ffffff;font-size:18px;font-weight:700;">🎉 ההרשמה שלך אושרה!</p>
                    </td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="padding:32px;">
                      <p style="margin:0 0 8px;color:#1e293b;font-size:18px;font-weight:700;">שלום ${firstName} ${lastName},</p>
                      <p style="margin:0 0 24px;color:#475569;font-size:15px;line-height:1.6;">
                        שמחים לעדכן אותך שהרשמתך לטורניר <strong>${tournamentTitle}</strong> אושרה רשמית!
                      </p>

                      <!-- Tournament details -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;margin-bottom:24px;">
                        <tr>
                          <td style="background:#0a1628;padding:12px 16px;">
                            <p style="margin:0;color:#ffffff;font-size:14px;font-weight:700;">פרטי הטורניר</p>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding:16px;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                              <tr>
                                <td style="padding:6px 0;color:#64748b;font-size:14px;width:40%;">שם הטורניר</td>
                                <td style="padding:6px 0;color:#1e293b;font-size:14px;font-weight:600;">${tournamentTitle}</td>
                              </tr>
                              <tr>
                                <td style="padding:6px 0;color:#64748b;font-size:14px;border-top:1px solid #e2e8f0;">תאריך</td>
                                <td style="padding:6px 0;color:#1e293b;font-size:14px;font-weight:600;border-top:1px solid #e2e8f0;">${tournamentDate}</td>
                              </tr>
                              <tr>
                                <td style="padding:6px 0;color:#64748b;font-size:14px;border-top:1px solid #e2e8f0;">מיקום</td>
                                <td style="padding:6px 0;color:#1e293b;font-size:14px;font-weight:600;border-top:1px solid #e2e8f0;">${tournamentLocation}</td>
                              </tr>
                              <tr>
                                <td style="padding:6px 0;color:#64748b;font-size:14px;border-top:1px solid #e2e8f0;">דמי השתתפות</td>
                                <td style="padding:6px 0;color:#1e293b;font-size:14px;font-weight:600;border-top:1px solid #e2e8f0;">₪${tournamentPrice} לשחקן</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>

                      ${payboxUrl ? `
                      <!-- PayBox button -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                        <tr>
                          <td align="center">
                            <a href="${payboxUrl}" style="display:inline-block;background:#2563eb;color:#ffffff;font-size:16px;font-weight:700;padding:14px 32px;border-radius:12px;text-decoration:none;">
                              💳 לתשלום דמי השתתפות
                            </a>
                          </td>
                        </tr>
                      </table>
                      ` : ''}

                      ${whatsappUrl ? `
                      <!-- WhatsApp button -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                        <tr>
                          <td align="center">
                            <a href="${whatsappUrl}" style="display:inline-block;background:#16a34a;color:#ffffff;font-size:16px;font-weight:700;padding:14px 32px;border-radius:12px;text-decoration:none;">
                              💬 הצטרף לקבוצת WhatsApp
                            </a>
                          </td>
                        </tr>
                      </table>
                      ` : ''}

                      <p style="margin:0;color:#475569;font-size:14px;line-height:1.6;">
                        נתראה במגרש! 🏓
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:20px;text-align:center;">
                      <p style="margin:0;color:#94a3b8;font-size:12px;">© 2025 בית הפאדל · israelpadel.com</p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
