import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')

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

  return NextResponse.redirect(url.origin)
}
