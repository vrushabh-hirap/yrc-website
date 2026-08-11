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
            .from('mentors')
            .select('id, name, email, department, phone, created_at');

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

        const { name, email, password, department, phone } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ message: 'Please fill name, email, and password' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const { data: newMentor, error } = await supabaseAdmin
            .from('mentors')
            .insert({
                name,
                email: email.toLowerCase(),
                password: hashedPassword,
                department: department || 'AIML',
                phone: phone || ''
            })
            .select('id, name, email, department, phone')
            .single();

        if (error) {
            return NextResponse.json({ message: 'Failed to create faculty mentor account (Email may exist)' }, { status: 400 });
        }

        return NextResponse.json({ message: 'Faculty mentor account created successfully! 🎉', faculty: newMentor }, { status: 201 });
    } catch (err) {
        console.error('Create faculty error:', err);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
