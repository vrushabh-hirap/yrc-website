import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req, { params }) {
    try {
        const authPayload = getAuthUser(req);
        if (!authPayload || (authPayload.role !== 'faculty' && authPayload.role !== 'admin')) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { id: paperId } = await params;
        const { reason } = await req.json();

        if (!reason || !reason.trim()) {
            return NextResponse.json({ message: 'Please provide a rejection reason' }, { status: 400 });
        }

        const { data: paper, error } = await supabaseAdmin
            .from('papers')
            .update({
                status: 'rejected',
                rejection_reason: reason,
                updated_at: new Date().toISOString()
            })
            .eq('id', paperId)
            .select()
            .single();

        if (error || !paper) {
            return NextResponse.json({ message: 'Paper not found or rejection failed' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Paper rejected. Team notified.', paper });
    } catch (err) {
        console.error('Reject paper error:', err);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
