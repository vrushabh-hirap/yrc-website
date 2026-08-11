import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req) {
    try {
        const authPayload = getAuthUser(req);
        if (!authPayload) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        if (authPayload.role === 'faculty') {
            const { data: mentor } = await supabaseAdmin
                .from('mentors')
                .select('id, name, email, department, phone, created_at')
                .eq('id', authPayload.id)
                .single();

            if (mentor) {
                return NextResponse.json({ user: { ...mentor, role: 'faculty' } });
            }
        }

        const { data: user } = await supabaseAdmin
            .from('users')
            .select('id, name, email, role, phone, prn, department, created_at')
            .eq('id', authPayload.id)
            .single();

        if (user) {
            return NextResponse.json({ user });
        }

        return NextResponse.json({ message: 'User not found' }, { status: 404 });
    } catch (err) {
        console.error('Me endpoint error:', err);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
