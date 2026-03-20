// app/api/founder/client-context/route.ts
// Returns full client context for a given brain_id — founder only
// Assessment (phase1, phase2, phase3) + uploaded files with signed URLs
// Handles both real second_brain UUIDs and assessment_XXX fallback IDs
// Verifies session + role = 'developer' before responding

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdmin } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const brain_id = request.nextUrl.searchParams.get('brain_id')
    if (!brain_id) {
      return NextResponse.json({ error: 'Missing brain_id' }, { status: 400 })
    }

    // ── Verify session ──
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // ── Verify role = developer ──
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || !profile || profile.role !== 'developer') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // ── Admin client ──
    const supabaseAdmin = createAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    let user_id: string
    let assessment_id: number

    // ── Detect if brain_id is a fake assessment_XXX id or a real UUID ──
    if (brain_id.startsWith('assessment_')) {
      assessment_id = parseInt(brain_id.replace('assessment_', ''))

      const { data: assessment, error: aErr } = await supabaseAdmin
        .from('assessments')
        .select('user_id')
        .eq('id', assessment_id)
        .single()

      if (aErr || !assessment) {
        return NextResponse.json({ error: 'Assessment not found' }, { status: 404 })
      }

      user_id = assessment.user_id

    } else {
      const { data: brain, error: brainError } = await supabaseAdmin
        .from('second_brains')
        .select('user_id, assessment_id')
        .eq('id', brain_id)
        .single()

      if (brainError || !brain) {
        return NextResponse.json({ error: 'Brain not found' }, { status: 404 })
      }

      user_id = brain.user_id
      assessment_id = brain.assessment_id
    }

    // ── Get user email ──
    let user_email = user_id
    try {
      const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(user_id)
      if (authUser?.user?.email) user_email = authUser.user.email
    } catch { }

    // ── Get assessment responses ──
    const { data: assessment } = await supabaseAdmin
      .from('assessments')
      .select('responses')
      .eq('id', assessment_id)
      .maybeSingle()

    // ── Get files ──
    const { data: files } = await supabaseAdmin
      .from('files')
      .select('id, file_type, asset_type, file_url, phase, status, created_at, storage_path')
      .eq('assessment_id', assessment_id)
      .order('created_at', { ascending: false })

    // ── Generate signed URLs for private bucket files ──
    const filesWithSignedUrls = await Promise.all(
      (files || []).map(async (file: any) => {
        // Use storage_path if available, otherwise extract from file_url
        let storagePath = file.storage_path

        if (!storagePath && file.file_url) {
          // Extract path from public URL pattern
          const match = file.file_url.match(/phase3-assets\/(.+)$/)
          if (match) storagePath = match[1]
        }

        if (storagePath) {
          try {
            const { data: signedData } = await supabaseAdmin.storage
              .from('phase3-assets')
              .createSignedUrl(storagePath, 3600) // 1 hour

            if (signedData?.signedUrl) {
              return { ...file, file_url: signedData.signedUrl }
            }
          } catch { }
        }

        return file
      })
    )

    return NextResponse.json({
      user_email,
      assessment: assessment?.responses || null,
      files: filesWithSignedUrls,
    })

  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
