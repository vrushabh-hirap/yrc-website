import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req) {
    try {
        const authPayload = getAuthUser(req);
        if (!authPayload) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        // Find team led by or containing user
        const { data: team, error: teamErr } = await supabaseAdmin
            .from('teams')
            .select(`
                *,
                leader:leader_id(id, name, email, prn, phone),
                mentor:mentor_id(id, name, email, department, phone)
            `)
            .eq('leader_id', authPayload.id)
            .single();

        if (teamErr || !team) {
            return NextResponse.json({ team: null, feedback: [] });
        }

        // Fetch team members from `team_members` table
        const { data: members } = await supabaseAdmin
            .from('team_members')
            .select('*')
            .eq('team_id', team.id)
            .order('is_leader', { ascending: false });

        team.members = members || [];
        team.teamName = team.team_name;
        team.groupCode = team.group_code;
        team.academicYear = team.academic_year;

        // Fetch paper for team
        const { data: paper } = await supabaseAdmin
            .from('papers')
            .select('*')
            .eq('team_id', team.id)
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
