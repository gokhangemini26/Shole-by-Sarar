import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const nextParam = url.searchParams.get('next')
  // Only same-site relative paths (guard against open-redirect).
  const safeNext =
    nextParam && nextParam.startsWith('/') && !nextParam.startsWith('//')
      ? nextParam
      : '/'

  const supabase = await createClient()

  if (code) {
    const { data, error } =
      await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      return NextResponse.redirect(`${url.origin}/login`)
    }

    const user = data.user

    if (user) {
      await supabase.from('profiles').upsert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name,
        avatar_url: user.user_metadata?.avatar_url,
        updated_at: new Date().toISOString(),
      })
    }
  }

  const redirectUrl = new URL(safeNext, url.origin)
  redirectUrl.searchParams.set('login_success', 'true')
  return NextResponse.redirect(redirectUrl.toString())
}
