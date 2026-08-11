import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '@/lib/supabase';
import { generateToken } from '@/lib/auth';

export async function POST(req) {
    try {
        const body = await req.json();
        const { accountType = 'student' } = body;

        // --- FACULTY MENTOR REGISTRATION ---
        if (accountType === 'faculty') {
            const { name, email, password, department = 'AIML', phone } = body;

            if (!name || !email || !password) {
                return NextResponse.json({ message: 'Please fill name, email, and password for faculty account' }, { status: 400 });
            }

            const { data: existingMentor } = await supabaseAdmin
                .from('mentors')
                .select('id')
                .eq('email', email.toLowerCase())
                .single();

            if (existingMentor) {
                return NextResponse.json({ message: 'Faculty email address is already registered' }, { status: 400 });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const { data: newMentor, error: mentorErr } = await supabaseAdmin
                .from('mentors')
                .insert({
                    name,
                    email: email.toLowerCase(),
                    password: hashedPassword,
                    department,
                    phone: phone || ''
                })
                .select('id, name, email, department, phone')
                .single();

            if (mentorErr || !newMentor) {
                console.error('Mentor creation error:', mentorErr);
                return NextResponse.json({ message: 'Failed to create faculty mentor account' }, { status: 500 });
            }

            const userPayload = { ...newMentor, role: 'faculty' };
            const token = generateToken({ id: newMentor.id, email: newMentor.email, role: 'faculty' });

            return NextResponse.json({
                user: userPayload,
                token
            }, { status: 201 });
        }

        // --- STUDENT TEAM REGISTRATION ---
        const { teamName, track, division, leader, members } = body;

        if (!teamName || !track || !division || !leader || !members || members.length < 1 || members.length > 3) {
            return NextResponse.json({ message: 'Invalid team details. Leader details + 1 to 3 member details required.' }, { status: 400 });
        }

        // Validate Leader fields
        if (!leader.name || !leader.email || !leader.password || !leader.prn || !leader.phone) {
            return NextResponse.json({ message: 'Team Leader requires Name, Email, Password, PRN, and Mobile number.' }, { status: 400 });
        }

        // Validate Non-Leader Member fields
        for (let i = 0; i < members.length; i++) {
            const m = members[i];
            if (!m.name || !m.email || !m.prn) {
                return NextResponse.json({ message: `Member ${i + 2} requires Name, Email, and PRN.` }, { status: 400 });
            }
        }

        // Check if team name already exists
        const { data: existingTeam } = await supabaseAdmin
            .from('teams')
            .select('id')
            .eq('team_name', teamName)
            .single();

        if (existingTeam) {
            return NextResponse.json({ message: 'Team name is already taken' }, { status: 400 });
        }

        // Check if leader email is already registered
        const { data: existingUser } = await supabaseAdmin
            .from('users')
            .select('email')
            .eq('email', leader.email.toLowerCase())
            .single();

        if (existingUser) {
            return NextResponse.json({ message: `Leader email ${leader.email} is already registered` }, { status: 400 });
        }

        // Create Leader Account in `users` table
        const hashedPassword = await bcrypt.hash(leader.password, 10);
        const { data: leaderUser, error: userErr } = await supabaseAdmin
            .from('users')
            .insert({
                name: leader.name,
                email: leader.email.toLowerCase(),
                password: hashedPassword,
                role: 'student',
                phone: leader.phone,
                prn: leader.prn,
                department: 'AIML'
            })
            .select()
            .single();

        if (userErr || !leaderUser) {
            console.error('User creation error:', userErr);
            return NextResponse.json({ message: 'Failed to create team leader account' }, { status: 500 });
        }

        // Generate group code (e.g. YRCA01, YRCB02)
        const { count } = await supabaseAdmin
            .from('teams')
            .select('*', { count: 'exact', head: true })
            .eq('division', division);

        const countNum = (count || 0) + 1;
        const groupCode = `YRC${division}${String(countNum).padStart(2, '0')}`;

        // Create Team in `teams` table
        const { data: newTeam, error: teamErr } = await supabaseAdmin
            .from('teams')
            .insert({
                team_name: teamName,
                track,
                division,
                group_code: groupCode,
                academic_year: '2025-26',
                leader_id: leaderUser.id
            })
            .select()
            .single();

        if (teamErr || !newTeam) {
            console.error('Team creation error:', teamErr);
            return NextResponse.json({ message: 'Failed to create team' }, { status: 500 });
        }

        // Insert Leader into `team_members` table
        const teamMembersToInsert = [
            {
                team_id: newTeam.id,
                name: leader.name,
                email: leader.email.toLowerCase(),
                prn: leader.prn,
                is_leader: true
            },
            ...members.map(m => ({
                team_id: newTeam.id,
                name: m.name,
                email: m.email.toLowerCase(),
                prn: m.prn,
                is_leader: false
            }))
        ];

        await supabaseAdmin.from('team_members').insert(teamMembersToInsert);

        delete leaderUser.password;
        const token = generateToken({ id: leaderUser.id, email: leaderUser.email, role: leaderUser.role });

        return NextResponse.json({
            user: leaderUser,
            team: newTeam,
            token
        }, { status: 201 });
    } catch (err) {
        console.error('Registration error:', err);
        return NextResponse.json({ message: 'Server error during registration' }, { status: 500 });
    }
}
