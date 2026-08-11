import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req) {
    try {
        const authPayload = getAuthUser(req);
        if (!authPayload || (authPayload.role !== 'faculty' && authPayload.role !== 'admin')) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { paperId, content } = await req.json();

        if (!paperId || !content || !content.trim()) {
            return NextResponse.json({ message: 'Please provide paperId and content' }, { status: 400 });
        }

        const { data: feedback, error: fbErr } = await supabaseAdmin
            .from('feedbacks')
            .insert({
                paper_id: paperId,
                mentor_id: authPayload.id,
                content
            })
            .select()
            .single();

        if (fbErr || !feedback) {
            console.error('Feedback insert error:', fbErr);
            return NextResponse.json({ message: 'Failed to create feedback' }, { status: 500 });
        }

        // Set paper status to under_review if currently submitted
        await supabaseAdmin
            .from('papers')
            .update({ status: 'under_review', updated_at: new Date().toISOString() })
            .eq('id', paperId)
            .eq('status', 'submitted');

        return NextResponse.json({ message: 'Feedback submitted successfully', feedback }, { status: 201 });
    } catch (err) {
        console.error('Feedback error:', err);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
