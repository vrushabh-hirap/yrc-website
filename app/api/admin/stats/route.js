import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req) {
    try {
        const authPayload = getAuthUser(req);
        if (!authPayload || authPayload.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const [{ count: totalTeams }, { count: totalPapers }, { count: totalFaculty }, { count: totalStudents }] = await Promise.all([
            supabaseAdmin.from('teams').select('*', { count: 'exact', head: true }),
            supabaseAdmin.from('papers').select('*', { count: 'exact', head: true }),
            supabaseAdmin.from('users').select('*', { count: 'exact', head: true }).eq('role', 'faculty'),
            supabaseAdmin.from('users').select('*', { count: 'exact', head: true }).eq('role', 'student')
        ]);

        return NextResponse.json({
            stats: {
                totalTeams: totalTeams || 0,
                totalPapers: totalPapers || 0,
                totalFaculty: totalFaculty || 0,
                totalStudents: totalStudents || 0
            }
        });
    } catch (err) {
        console.error('Admin stats error:', err);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
