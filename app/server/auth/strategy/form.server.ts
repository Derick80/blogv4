import { FormStrategy } from 'remix-auth-form'
import invariant from 'tiny-invariant'

import bcrypt from 'bcryptjs'
import { getUser, createUser, getUserPasswordHash } from '~/server/user.server'
import { AuthInput } from '~/utilities/types'


export const registerStrategy = new FormStrategy(async ({ form }) => {
  const email = form.get('email')
  const username = form.get('username')
  const password = form.get('password')
  invariant(typeof email === 'string', 'Email is not a string')
  invariant(typeof username === 'string', 'Username is not a string')

  const existingUser = await getUser({ email })
  if (existingUser) {
    throw new Error('User already exists')
  }
  const user = await createUser({ email, password, username,  } as AuthInput)
  return user.id
})

export const loginStrategy = new FormStrategy(async ({ form }) => {
  const email = form.get('email')
  const password = form.get('password')

  invariant(typeof email === 'string', 'Email is not a string')
  invariant(typeof password === 'string', 'Password is not a string')
  const { user, passwordHash } = await getUserPasswordHash({ email })
  if (
    !user ||
    !passwordHash ||
    (passwordHash && !(await bcrypt.compare(password, passwordHash)))
  ) {
    throw new Error('Invalid email or password')
  }
  return user.id
})
