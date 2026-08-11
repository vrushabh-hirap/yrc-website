import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function DELETE(req, { params }) {
    try {
        const authPayload = getAuthUser(req);
        if (!authPayload || authPayload.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { id: teamId } = await params;

        // Fetch team members to remove their student accounts
        const { data: teamMembers } = await supabaseAdmin
            .from('team_members')
            .select('user_id')
            .eq('team_id', teamId);

        const memberUserIds = teamMembers ? teamMembers.map(m => m.user_id) : [];

        // Delete paper if existing
        await supabaseAdmin.from('papers').delete().eq('team_id', teamId);

        // Delete team (cascades junction)
        const { error: teamDeleteErr } = await supabaseAdmin.from('teams').delete().eq('id', teamId);
        if (teamDeleteErr) throw teamDeleteErr;

        // Delete student accounts for team members
        if (memberUserIds.length > 0) {
            await supabaseAdmin.from('users').delete().in('id', memberUserIds);
        }

        return NextResponse.json({ message: 'Team and associated accounts deleted successfully' });
    } catch (err) {
        console.error('Delete team error:', err);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
