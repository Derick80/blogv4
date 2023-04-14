import { Prisma } from '@prisma/client'
import { createPasswordHash } from './auth/auth-service.server'
import { prisma } from './prisma.server'

export type UserProps = {
  id: string
  email: string
  username: string
  avatarUrl: string | null

}

const defaultUserSelect = {
  id: true,
  email: true,
  username: true,
  avatarUrl: true,
  _count: true
}

// using this for selecting just MY posts
const defaultPersonalSelect = {
  id: true,
  email: true,
  username: true,
  avatarUrl: true,
  posts: true,
  _count: true
}

export async function getUsers(): Promise<UserProps[]> {
  const users = await prisma.user.findMany({
    select: defaultUserSelect
  })
  return users
}

export async function getUserById(userId: string) {
  return await prisma.user.findUnique({
    where: {
      id: userId
    }
  })
}

export async function getUserByUserName(username: string) {
  return await prisma.user.findUnique({
    where: {
      username: username
    },
    select: defaultPersonalSelect
  })
}

export const createUser = async (
  input: Prisma.UserCreateInput & {
    password?: string
    account?: Omit<Prisma.AccountCreateInput, 'user'>
  }
) => {
  const data: Prisma.UserCreateInput = {
    email: input.email,
    username: input.username
  }

  if (input.password) {
    data.password = await createPasswordHash(input.password)
  }

  if (input.account) {
    data.accounts = {
      create: [
        {
          provider: input.account.provider,
          providerAccountId: input.account.providerAccountId,
          accessToken: input.account.accessToken,
          refreshToken: input.account.refreshToken
        }
      ]
    }
  }

  const user = await prisma.user.create({
    data,
    select: defaultUserSelect
  })

  await prisma.profile.create({
    data: {
      userId: user.id,
      bio: '',

    }
  })

  return user
}

export const getUser = async (input: Prisma.UserWhereUniqueInput) => {
  const user = await prisma.user.findUnique({
    where: input,
    select: defaultUserSelect
  })
  return user
}

export const getUserPasswordHash = async (
  input: Prisma.UserWhereUniqueInput
) => {
  const user = await prisma.user.findUnique({
    where: input
  })
  if (user) {
    return {
      user: { ...user, password: null },
      passwordHash: user.password
    }
  }
  return { user: null, passwordHash: null }
}
