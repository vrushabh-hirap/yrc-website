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

        // Query user from Supabase
        const { data: user, error } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('email', email.toLowerCase())
            .single();

        if (error || !user) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        // Remove password from payload
        delete user.password;

        const token = generateToken({ id: user.id, email: user.email, role: user.role });

        return NextResponse.json({ user, token });
    } catch (err) {
        console.error('Login error:', err);
        return NextResponse.json({ message: 'Server error during login' }, { status: 500 });
    }
}
