import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '@/lib/supabase';
import { generateToken } from '@/lib/auth';

export async function POST(req) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ message: 'Please provide email and password' }, { status: 400 });
        }

        const cleanEmail = email.toLowerCase().trim();

        // 1. Check `users` table (Student Leaders & Admin)
        const { data: user } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('email', cleanEmail)
            .single();

        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                delete user.password;
                const token = generateToken({ id: user.id, email: user.email, role: user.role });
                return NextResponse.json({ user, token });
            }
        }

        // 2. Check `mentors` table (Faculty Mentors)
        const { data: mentor } = await supabaseAdmin
            .from('mentors')
            .select('*')
            .eq('email', cleanEmail)
            .single();

        if (mentor) {
            const isMatch = await bcrypt.compare(password, mentor.password);
            if (isMatch) {
                delete mentor.password;
                const mentorUser = { ...mentor, role: 'faculty' };
                const token = generateToken({ id: mentor.id, email: mentor.email, role: 'faculty' });
                return NextResponse.json({ user: mentorUser, token });
            }
        }

        return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    } catch (err) {
        console.error('Login error:', err);
        return NextResponse.json({ message: 'Server error during login' }, { status: 500 });
    }
}
