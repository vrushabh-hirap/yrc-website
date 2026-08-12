import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '@/lib/supabase';
import { generateToken } from '@/lib/auth';

const ADMIN_EMAIL = 'admin@pccoepune.org';
const ADMIN_HASH = '$2b$10$TbqcFMtnpd6k9dvsYXVATOZQdvqSsTaidSH5Nc5BoXtKhRdFVsFbG'; // bcrypt hash for 'admin123'

export async function POST(req) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ message: 'Please provide email and password' }, { status: 400 });
        }

        const cleanEmail = email.toLowerCase().trim();

        // Admin fallback auto-seeding
        if (cleanEmail === ADMIN_EMAIL && password === 'admin123') {
            let { data: adminUser } = await supabaseAdmin
                .from('users')
                .select('*')
                .eq('email', ADMIN_EMAIL)
                .single();

            if (!adminUser) {
                const { data: createdAdmin } = await supabaseAdmin
                    .from('users')
                    .insert({
                        name: 'YRC Admin',
                        email: ADMIN_EMAIL,
                        password: ADMIN_HASH,
                        role: 'admin',
                        phone: '9999999999',
                        prn: 'ADMIN01',
                        department: 'AIML'
                    })
                    .select()
                    .single();
                adminUser = createdAdmin;
            } else if (adminUser.role !== 'admin' || !await bcrypt.compare('admin123', adminUser.password)) {
                const { data: updatedAdmin } = await supabaseAdmin
                    .from('users')
                    .update({ password: ADMIN_HASH, role: 'admin' })
                    .eq('email', ADMIN_EMAIL)
                    .select()
                    .single();
                adminUser = updatedAdmin;
            }

            if (adminUser) {
                delete adminUser.password;
                const token = generateToken({ id: adminUser.id, email: adminUser.email, role: 'admin' });
                return NextResponse.json({ user: adminUser, token });
            }
        }

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
