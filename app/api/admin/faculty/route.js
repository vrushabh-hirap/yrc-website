import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getAuthUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req) {
    try {
        const authPayload = getAuthUser(req);
        if (!authPayload || authPayload.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { data: faculty, error } = await supabaseAdmin
            .from('users')
            .select('id, name, email, department, created_at')
            .eq('role', 'faculty');

        if (error) throw error;

        return NextResponse.json(faculty || []);
    } catch (err) {
        console.error('Get faculty error:', err);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const authPayload = getAuthUser(req);
        if (!authPayload || authPayload.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { name, email, password, department } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ message: 'Please fill all required fields' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const { data: newFaculty, error } = await supabaseAdmin
            .from('users')
            .insert({
                name,
                email: email.toLowerCase(),
                password: hashedPassword,
                role: 'faculty',
                department: department || 'AIML'
            })
            .select('id, name, email, department, role')
            .single();

        if (error) {
            return NextResponse.json({ message: 'Failed to create faculty account (Email may exist)' }, { status: 400 });
        }

        return NextResponse.json({ message: 'Faculty account created successfully! 🎉', faculty: newFaculty }, { status: 201 });
    } catch (err) {
        console.error('Create faculty error:', err);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
