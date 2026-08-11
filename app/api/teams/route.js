import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req) {
    try {
        const authPayload = getAuthUser(req);
        if (!authPayload || authPayload.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const track = searchParams.get('track');
        const year = searchParams.get('year');

        let query = supabaseAdmin
            .from('teams')
            .select(`
                *,
                leader:leader_id(id, name, email, prn, phone),
                mentor:mentor_id(id, name, email, department),
                paper:papers(*)
            `)
            .order('created_at', { ascending: false });

        if (track) query = query.eq('track', track);
        if (year) query = query.eq('academic_year', year);

        const { data: teams, error } = await query;
        if (error) throw error;

        const formattedTeams = await Promise.all((teams || []).map(async (team) => {
            const { data: members } = await supabaseAdmin
                .from('team_members')
                .select('*')
                .eq('team_id', team.id);

            team.members = members || [];
            team.teamName = team.team_name;
            team.groupCode = team.group_code;
            team.academicYear = team.academic_year;

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
        console.error('List teams error:', err);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
