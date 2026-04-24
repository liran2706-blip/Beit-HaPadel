import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll(); },
          setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    const { data } = await supabase.auth.exchangeCodeForSession(code);

    // If new Google user, create profile
    if (data?.user) {
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', data.user.id)
        .maybeSingle();

      if (!existingProfile) {
        const fullName = data.user.user_metadata?.full_name || '';
        const nameParts = fullName.split(' ');
        const firstName = nameParts[0] || 'שחקן';
        const lastName = nameParts.slice(1).join(' ') || '';

        await supabase.from('profiles').insert({
          id: data.user.id,
          first_name: firstName,
          last_name: lastName,
          phone: '',
          level: 3,
          is_admin: false,
        });

        // New Google user — send to complete profile
        return NextResponse.redirect(`${origin}/profile?new=1`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/`);
}
