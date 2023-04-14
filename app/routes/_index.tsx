import { LoaderArgs, V2_MetaFunction, json } from "@remix-run/node"
import { Form, Link, useLoaderData } from '@remix-run/react'
import Button from '~/components/button'
import { prisma } from '~/server/prisma.server'
import { useOptionalUser } from '~/utilities/utilities'

export const meta: V2_MetaFunction = () => {
  return [{ title: "Derick's Blog V3" }]
}

export async function loader({request}:LoaderArgs){
  const heropost = await prisma.post.findMany({
    where: {
      published: true,

  },
  include:{
    user:{
      select:{
        username: true,
        avatarUrl: true,
    }},
    comments: true,
    likes: true,

  },
  take: 1,
  orderBy: {
    createdAt: 'desc'
  }
  })

return json({heropost})
}
export default function Index () {
  const { heropost } = useLoaderData<typeof loader>()
  const user = useOptionalUser()
  return (
    <div
    className='flex flex-col gap-1 items-center'

    >
      <h1>Welcome to Remix</h1>
      <div className='flex flex-col gap-1 items-center'>
        <h1>Hero Post</h1>
        {heropost.map((post) => (
          <div
          className='flex flex-col gap-1 items-center'
          key={post.id}>
            <h1>{post.title}</h1>
            <h1>{post.content}</h1>
            <h1>{post.user.username}</h1>
            { post.user.avatarUrl && <img

              className='w-10 h-10 rounded-full'
              src={ post.user.avatarUrl }
              alt={ post.user.username }
            /> }
<h1>{post.comments.length}</h1>
            <h1>{post.likes.length}</h1>
          </div>
        ))}
      </div>
      <ul
      className='flex flex-row gap-1'
      >
        <li>
          <Button variant='primary_filled' size='small'>
            <Link to='/blog'>Blog</Link>
          </Button>
        </li>
        <li>
          <Button variant='primary_filled' size='small'>
          <Link to='/users'>Users</Link>
          </Button>
        </li>

        {!user && (<>
          <li>
           <Button variant='success_filled' size='small'>
              <Link to='/login'>Login</Link>
            </Button>
            </li>
            </>)}
        { user && (<>
          <li>Welcome Back, { user.username }</li>
          <li>

            <Form method="post" action="/logout">
              <Button
              size='small'
                variant='danger'
              type="submit">Logout</Button>
            </Form>

          </li>


        </>)
        }
      </ul>


    </div>
  )
}
