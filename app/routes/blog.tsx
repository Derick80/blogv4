import type { LoaderArgs, V2_MetaFunction} from '@remix-run/node';
import { json } from '@remix-run/node'
import { Link, NavLink, Outlet, useFetcher, useLoaderData } from '@remix-run/react'
import { RowBox } from '~/components/boxes'
import Button from '~/components/button'
import { prisma } from '~/server/prisma.server'
import { useOptionalUser } from '~/utilities/utilities'
export const meta: V2_MetaFunction = () => {
    return [{ title: "Derick's Blog Home" }]
}
export async function loader({ request }: LoaderArgs) {
    const posts = await prisma.post.findMany({
        where: {
            published: true,
        },
        include: {
            user: true,
            comments: true,
            likes: true,

        },
        orderBy:{
            createdAt:'desc'
        }
    })
  return json({ posts })
}

export default function Index() {
    const user = useOptionalUser()
    const currentUser = user?.id
    const { posts } = useLoaderData<typeof loader>()
    return (
        <div
        className='flex flex-col gap-1 items-center overflow-y-auto h-full scrollbar-hide'
        >
            <h1>Welcome to the blog</h1>
            <BlogMenu />
            <Outlet />
            <ul
            className='flex flex-col gap-1 items-center md:gap-2'
            >
                {posts.map((post) => (
                    <li key={post.id}
                        className='border-2 p-1 md:p-2 rounded-md w-full'
                    >
                        <h1
                        className='text-2xl font-bold'
                        >{post.title}</h1>
                       <div className='text-base'
                       dangerouslySetInnerHTML={
                            {__html:post.content}

                       }
                          />

                       <div className='flex flex-row gap-1 justify-between'>

                            <RowBox>
                                <p className='text-xs'>Comments: { post.comments?.length > 0 ? post.comments.length : 0 }
                                </p>
                                <p className='text-xs'>Likes: { post.likes?.length > 0 ? post.likes.length : 0 }
                                </p>
                            </RowBox>
                            <p className='text-xs'>Written by,
                            <Link to={`/users/${post.user.username}`}>
                                    { post.user.username }
                                </Link>
                            </p>
                            </div>
                           {currentUser === post.user.id && <BlogAdminMenu id={post.id}  />}
                    </li>
                ))}
            </ul>
        </div>
    )
}

function BlogAdminMenu({id}:{id:string}){
const deleteFetcher = useFetcher()
    return (
        <div
        className='flex flex-row gap-1 items-center md:gap-2'
        >
            <Button
            size='base'
            variant="primary_filled"
            >
                <NavLink to={`${id}/edit`}>Edit</NavLink>

            </Button>
            <deleteFetcher.Form  method='delete' action={`${id}/delete`}>

            <Button
            size='base'
            variant='danger_filled'
            >
                Delete
                </Button>
            </deleteFetcher.Form>
        </div>
    )
}
function BlogMenu() {
    return (
        <div
        className='flex flex-row gap-1 items-center md:gap-2'
        >
            <Button
            size='base'
            variant="primary_filled"
            >
                <Link to='/blog/new'>New Post</Link>

            </Button>
            <Button
            size='base'
            variant="primary_filled"
            >
                <Link to='/blog/drafts'>Drafts</Link>

            </Button>
        </div>
    )
}