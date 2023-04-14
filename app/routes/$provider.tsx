// app/routes/auth/$provider.tsx
import type { ActionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { authenticator } from '~/server/auth/auth.server'

export let loader = () => redirect('/login')

export let action = ({ request, params }: ActionArgs) => {
  const provider = params.provider as string

  return authenticator.authenticate(provider, request)
}
