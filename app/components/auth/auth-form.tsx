import { Form, useActionData, useSearchParams } from '@remix-run/react'
import Button from '../button'

type Props = {
  authType: 'register' | 'login' | 'request' | 'confirm'
}

const actionMap: Record<Props['authType'], { button: string; url: string }> = {
  register: {
    url: '/register',
    button: 'Sign up'
  },
  login: {
    url: '/login',
    button: 'Log in'
  },
  request: {
    url: '/request-password-reset',
    button: 'Request password reset'
  },
  confirm: {
    url: '/confirm-password-reset',
    button: 'Confirm password'
  }
}

export const AuthForm = ({ authType }: Props) => {

  const action = useActionData()
  const [searchParams] = useSearchParams()
  const { button, url } = actionMap[authType]

  const token = searchParams.get('token')
  const redirectTo = searchParams.get('redirectTo')



  return (
    <Form
      className='form-base rounded-xl'
      method='post'
      action={url}
    >
      <input type='hidden' name='redirectTo' value={redirectTo || '/'} />
      <input type='hidden' name='token' value={token || ''} />

      {authType !== 'confirm' && (
        <>
          <label className=''>Email</label>
          <input
            className='text-base rounded-lg border p-1'
            id='email'
            name='email'
            type='email'
            placeholder='...youremail@mail.com'
          />
          <label>Username</label>
          <input
            className='text-base rounded-lg border p-1'
            id='username'
            name='username'
            type='text'
            placeholder='username'
          />
        </>
      )}
      {authType !== 'request' && (
        <>
          <label>Password</label>
          <input
            className='text-base rounded-lg border p-1'
            id='password'
            name='password'
            type='password'
            autoComplete='current-password'
            placeholder='********'
          />
        </>
      )}

      <div className='flex flex-col gap-1 items-center'>
        <Button
          variant='primary_filled'
          type='submit'>
          { button }
        </Button>
        </div>
    </Form>
  )
}
