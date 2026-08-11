import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function PUT(req, { params }) {
    try {
        const authPayload = getAuthUser(req);
        if (!authPayload || authPayload.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { id: teamId } = await params;
        const { mentorId } = await req.json();

        if (!mentorId) {
            return NextResponse.json({ message: 'Please select a faculty mentor' }, { status: 400 });
        }

        const { data: team, error } = await supabaseAdmin
            .from('teams')
            .update({
                mentor_id: mentorId,
                updated_at: new Date().toISOString()
            })
            .eq('id', teamId)
            .select()
            .single();

        if (error || !team) {
            return NextResponse.json({ message: 'Team not found or mentor assignment failed' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Faculty mentor assigned successfully', team });
    } catch (err) {
        console.error('Assign mentor error:', err);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
