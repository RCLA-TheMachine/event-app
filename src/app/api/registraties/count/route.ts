import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: 'SUPABASE_SERVICE_ROLE_KEY not set' }, { status: 500 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );

  const { data, error } = await supabase
    .from('inschrijvingen')
    .select('aantal');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const totalPersonen = (data ?? []).reduce((sum, r) => sum + (r.aantal ?? 0), 0);
  return NextResponse.json({ totalPersonen });
}
