import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req) {
    try {
        const authPayload = getAuthUser(req);
        if (!authPayload) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        // Find team where this user is a member
        const { data: memberRel } = await supabaseAdmin
            .from('team_members')
            .select('team_id')
            .eq('user_id', authPayload.id)
            .single();

        if (!memberRel) {
            return NextResponse.json({ team: null, feedback: [] });
        }

        const teamId = memberRel.team_id;

        // Fetch team with mentor details
        const { data: team, error: teamErr } = await supabaseAdmin
            .from('teams')
            .select(`
                *,
                leader:leader_id(id, name, email, prn),
                mentor:mentor_id(id, name, email, department)
            `)
            .eq('id', teamId)
            .single();

        if (teamErr || !team) {
            return NextResponse.json({ team: null, feedback: [] });
        }

        // Fetch team members
        const { data: teamMembers } = await supabaseAdmin
            .from('team_members')
            .select('user:user_id(id, name, email, prn, phone)')
            .eq('team_id', teamId);

        team.members = teamMembers ? teamMembers.map(m => m.user) : [];
        team.teamName = team.team_name;
        team.groupCode = team.group_code;
        team.academicYear = team.academic_year;

        // Fetch paper for this team
        const { data: paper } = await supabaseAdmin
            .from('papers')
            .select('*')
            .eq('team_id', teamId)
            .single();

        if (paper) {
            paper.filePath = paper.file_path;
            paper.fileUrl = paper.file_url;
            paper.rejectionReason = paper.rejection_reason;
            paper.publicationStatus = paper.publication_status;
            team.paper = paper;
        } else {
            team.paper = null;
        }

        // Fetch feedbacks if paper exists
        let feedbacks = [];
        if (paper) {
            const { data: fbData } = await supabaseAdmin
                .from('feedbacks')
                .select(`
                    *,
                    mentor:mentor_id(id, name, email)
                `)
                .eq('paper_id', paper.id)
                .order('created_at', { ascending: false });

            feedbacks = fbData || [];
        }

        return NextResponse.json({ team, feedback: feedbacks });
    } catch (err) {
        console.error('Get my team error:', err);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
