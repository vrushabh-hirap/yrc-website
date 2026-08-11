import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req) {
    try {
        const authPayload = getAuthUser(req);
        if (!authPayload) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        // Get user team
        const { data: memberRel } = await supabaseAdmin
            .from('team_members')
            .select('team_id')
            .eq('user_id', authPayload.id)
            .single();

        if (!memberRel) {
            return NextResponse.json({ message: 'You are not assigned to any team' }, { status: 400 });
        }

        const teamId = memberRel.team_id;

        const { data: team } = await supabaseAdmin
            .from('teams')
            .select('*')
            .eq('id', teamId)
            .single();

        if (!team) {
            return NextResponse.json({ message: 'Team not found' }, { status: 404 });
        }

        const formData = await req.formData();
        const title = formData.get('title');
        const abstract = formData.get('abstract');
        const file = formData.get('paper');

        if (!title || !abstract || !file) {
            return NextResponse.json({ message: 'Please provide title, abstract, and PDF paper file' }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const fileName = `${team.group_code}_${Date.now()}.pdf`;
        const storagePath = `papers/${fileName}`;

        // Upload PDF to Supabase Storage Bucket `yrc-papers`
        const { data: uploadData, error: uploadErr } = await supabaseAdmin.storage
            .from('yrc-papers')
            .upload(storagePath, buffer, {
                contentType: 'application/pdf',
                upsert: true
            });

        if (uploadErr) {
            console.error('Supabase Storage Upload Error:', uploadErr);
            return NextResponse.json({ message: 'Failed to upload paper PDF to Supabase Storage' }, { status: 500 });
        }

        // Get public URL from Supabase Storage
        const { data: urlData } = supabaseAdmin.storage
            .from('yrc-papers')
            .getPublicUrl(storagePath);

        const publicUrl = urlData.publicUrl;

        // Check if existing paper for team
        const { data: existingPaper } = await supabaseAdmin
            .from('papers')
            .select('*')
            .eq('team_id', teamId)
            .single();

        let paper;
        if (existingPaper) {
            // Resubmission version upgrade
            const newVersion = (existingPaper.version || 1) + 1;
            const { data: updatedPaper, error: updateErr } = await supabaseAdmin
                .from('papers')
                .update({
                    title,
                    abstract,
                    file_url: publicUrl,
                    file_path: storagePath,
                    status: 'submitted',
                    rejection_reason: null,
                    version: newVersion,
                    updated_at: new Date().toISOString()
                })
                .eq('id', existingPaper.id)
                .select()
                .single();

            if (updateErr) throw updateErr;
            paper = updatedPaper;
        } else {
            // New Paper insert
            const { data: newPaper, error: insertErr } = await supabaseAdmin
                .from('papers')
                .insert({
                    team_id: teamId,
                    title,
                    abstract,
                    file_url: publicUrl,
                    file_path: storagePath,
                    track: team.track,
                    status: 'submitted',
                    version: 1
                })
                .select()
                .single();

            if (insertErr) throw insertErr;
            paper = newPaper;
        }

        return NextResponse.json({ message: 'Paper submitted successfully! 🎉', paper });
    } catch (err) {
        console.error('Submit paper error:', err);
        return NextResponse.json({ message: 'Server error during paper submission' }, { status: 500 });
    }
}
