import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req) {
    try {
        const authPayload = getAuthUser(req);
        if (!authPayload) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { data: user, error } = await supabaseAdmin
            .from('users')
            .select('id, name, email, role, phone, prn, department, created_at')
            .eq('id', authPayload.id)
            .single();

        if (error || !user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ user });
    } catch (err) {
        console.error('Me endpoint error:', err);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
