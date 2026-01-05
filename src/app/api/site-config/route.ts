// =============================================================================
// SITE CONFIG API - Stores CA address and other global settings in Supabase
// =============================================================================

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// GET - Fetch current site config
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('site_config')
      .select('*')
      .eq('key', 'ca_address')
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows found, which is ok for first time
      console.error('Supabase error:', error);
    }

    return NextResponse.json({
      success: true,
      data: {
        caAddress: data?.value || 'Coming Soon',
        updatedAt: data?.updated_at || null,
      },
    });
  } catch (error) {
    console.error('Site config error:', error);
    return NextResponse.json({
      success: true,
      data: { caAddress: 'Coming Soon', updatedAt: null },
    });
  }
}

// POST - Update site config (password protected)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password, caAddress } = body;

    // Verify password
    const correctPassword = process.env.NEXT_PUBLIC_CA_UPDATE_PASSWORD;
    if (password !== correctPassword) {
      return NextResponse.json(
        { success: false, error: 'Incorrect password' },
        { status: 401 }
      );
    }

    // Upsert the CA address
    const { error } = await supabase
      .from('site_config')
      .upsert(
        {
          key: 'ca_address',
          value: caAddress,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'key' }
      );

    if (error) {
      console.error('Supabase upsert error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to update' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { caAddress, updatedAt: new Date().toISOString() },
    });
  } catch (error) {
    console.error('Site config update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update config' },
      { status: 500 }
    );
  }
}
