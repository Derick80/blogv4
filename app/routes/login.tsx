import { DiscordLogoIcon, GitHubLogoIcon } from '@radix-ui/react-icons'
import type { ActionFunction, LoaderArgs, MetaFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { Link } from '@remix-run/react'
import { badRequest, serverError } from 'remix-utils'
import { AuthForm } from '~/components/auth/auth-form'
import { SocialLoginForm } from '~/components/auth/social-login-form'
import { RowBox } from '~/components/boxes'
import Button from '~/components/button'
import Divider from '~/components/divider'
import { isAuthenticated, authenticator } from '~/server/auth/auth.server'

type ActionData = {
  formError?: string
  fieldErrors?: {
    email: string | undefined
    password: string | undefined
    firstName?: string | undefined
    lastName?: string | undefined
  }
  fields?: {
    action: string
    email: string
    password: string
    firstName?: string
    lastName?: string
  }
}

export async function loader(args: LoaderArgs) {
  return (await isAuthenticated(args.request)) ? redirect('/') : null
}

export const action: ActionFunction = async ({ request }) => {
  try {
    return await authenticator.authenticate('login', request, {
      successRedirect: '/'
    })
  } catch (error) {
    if (error instanceof Response) return error
    if (error instanceof Error)
      return badRequest({ message: `${error.message} +login error` })
    return serverError(error)
  }
}
export default function Login() {
  return (
    <div className='flex flex-col gap-1 items-center'>
      <h1
        className='
        text-2xl font-bold'
      >
        Login
      </h1>
      <AuthForm authType='login' />
      <h1 className='text-2xl font-bold'>Social Media Login</h1>
      <RowBox>
        <SocialLoginForm provider='discord'>
          <Button
            variant='primary_filled'
            size='small'
          >
            Discord
          </Button>
        </SocialLoginForm>

        <SocialLoginForm provider='google'>
          <Button
            variant='primary_filled'
            size='small'
          >
            Google
          </Button>
        </SocialLoginForm>
      </RowBox>

<Divider
  variant='horizontal'
/>

      <h3 className='text-xl font-bold'>Don't have an account?</h3>

      <Link to='/register'>
        <Button
          variant='primary_filled'
          size='small'
        >
          Register
        </Button>
      </Link>
    </div>
  )
}
