import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req) {
    try {
        const authPayload = getAuthUser(req);
        if (!authPayload || (authPayload.role !== 'faculty' && authPayload.role !== 'admin')) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        // Get teams assigned to mentor
        const { data: teams, error } = await supabaseAdmin
            .from('teams')
            .select(`
                *,
                leader:leader_id(id, name, email, prn, phone),
                paper:papers(*)
            `)
            .eq('mentor_id', authPayload.id);

        if (error) throw error;

        const formattedTeams = await Promise.all((teams || []).map(async (team) => {
            const { data: members } = await supabaseAdmin
                .from('team_members')
                .select('*')
                .eq('team_id', team.id);

            team.members = members || [];
            team.teamName = team.team_name;
            team.groupCode = team.group_code;

            if (team.paper) {
                team.paper.filePath = team.paper.file_path;
                team.paper.fileUrl = team.paper.file_url;
                team.paper.rejectionReason = team.paper.rejection_reason;
                team.paper.publicationStatus = team.paper.publication_status;
            }

            return team;
        }));

        return NextResponse.json(formattedTeams);
    } catch (err) {
        console.error('Assigned papers error:', err);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
