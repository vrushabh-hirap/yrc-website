import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function PUT(req, { params }) {
    try {
        const authPayload = getAuthUser(req);
        if (!authPayload || (authPayload.role !== 'faculty' && authPayload.role !== 'admin')) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { id: paperId } = await params;
        const { publicationStatus } = await req.json();

        if (!publicationStatus || !['not_published', 'preparing', 'published'].includes(publicationStatus)) {
            return NextResponse.json({ message: 'Invalid publication status' }, { status: 400 });
        }

        const { data: paper, error } = await supabaseAdmin
            .from('papers')
            .update({
                publication_status: publicationStatus,
                updated_at: new Date().toISOString()
            })
            .eq('id', paperId)
            .select()
            .single();

        if (error || !paper) {
            return NextResponse.json({ message: 'Paper not found or update failed' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Publication status updated', paper });
    } catch (err) {
        console.error('Publication status error:', err);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
