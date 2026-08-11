import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '@/lib/supabase';
import { generateToken } from '@/lib/auth';

export async function POST(req) {
    try {
        const body = await req.json();
        const { accountType = 'student', name, email, password, department = 'AIML' } = body;

        // --- FACULTY MENTOR REGISTRATION ---
        if (accountType === 'faculty') {
            if (!name || !email || !password) {
                return NextResponse.json({ message: 'Please fill name, email, and password for faculty account' }, { status: 400 });
            }

            const { data: existingUser } = await supabaseAdmin
                .from('users')
                .select('id')
                .eq('email', email.toLowerCase())
                .single();

            if (existingUser) {
                return NextResponse.json({ message: 'Email address is already registered' }, { status: 400 });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const { data: newFaculty, error: userErr } = await supabaseAdmin
                .from('users')
                .insert({
                    name,
                    email: email.toLowerCase(),
                    password: hashedPassword,
                    role: 'faculty',
                    department
                })
                .select()
                .single();

            if (userErr || !newFaculty) {
                console.error('Faculty creation error:', userErr);
                return NextResponse.json({ message: 'Failed to create faculty mentor account' }, { status: 500 });
            }

            delete newFaculty.password;
            const token = generateToken({ id: newFaculty.id, email: newFaculty.email, role: newFaculty.role });

            return NextResponse.json({
                user: newFaculty,
                token
            }, { status: 201 });
        }

        // --- STUDENT TEAM REGISTRATION ---
        const { teamName, track, division, members } = body;

        if (!teamName || !track || !division || !members || members.length < 2 || members.length > 4) {
            return NextResponse.json({ message: 'Invalid team registration details (2-4 members required)' }, { status: 400 });
        }

        const { data: existingTeam } = await supabaseAdmin
            .from('teams')
            .select('id')
            .eq('team_name', teamName)
            .single();

        if (existingTeam) {
            return NextResponse.json({ message: 'Team name is already taken' }, { status: 400 });
        }

        const memberEmails = members.map(m => m.email.toLowerCase());
        const { data: existingUsers } = await supabaseAdmin
            .from('users')
            .select('email')
            .in('email', memberEmails);

        if (existingUsers && existingUsers.length > 0) {
            return NextResponse.json({ 
                message: `User with email ${existingUsers[0].email} is already registered` 
            }, { status: 400 });
        }

        const createdUsers = [];
        for (const m of members) {
            const hashedPassword = await bcrypt.hash(m.password, 10);
            const { data: newUser, error: userErr } = await supabaseAdmin
                .from('users')
                .insert({
                    name: m.name,
                    email: m.email.toLowerCase(),
                    password: hashedPassword,
                    role: 'student',
                    phone: m.phone,
                    prn: m.prn,
                    department: 'AIML'
                })
                .select()
                .single();

            if (userErr || !newUser) {
                console.error('User creation error:', userErr);
                return NextResponse.json({ message: 'Failed to create member account' }, { status: 500 });
            }
            createdUsers.push(newUser);
        }

        const leaderUser = createdUsers[0];

        const { count } = await supabaseAdmin
            .from('teams')
            .select('*', { count: 'exact', head: true })
            .eq('division', division);

        const countNum = (count || 0) + 1;
        const groupCode = `YRC${division}${String(countNum).padStart(2, '0')}`;

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

        const memberJunctions = createdUsers.map(u => ({
            team_id: newTeam.id,
            user_id: u.id
        }));

        await supabaseAdmin.from('team_members').insert(memberJunctions);

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
