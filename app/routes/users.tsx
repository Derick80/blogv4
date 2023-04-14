import { LoaderArgs, json } from '@remix-run/node'
import { Link, Outlet, useLoaderData } from '@remix-run/react'
import { ColBox, RowBox } from '~/components/boxes'
import Button from '~/components/button'
import { prisma } from '~/server/prisma.server'

export async function loader({request}:LoaderArgs){

    const users = await prisma.user.findMany({
        select:{
            id:true,
            username:true,
            email:true,
            avatarUrl:true,
            _count:{
                select:{
                    posts:true,
                    comments:true,
                    likes:true
                }
            }
        }
    })

    if(!users){
        return {json:{message:'No users found'}}
    }

    return json({users})
}

type UserLoaderData = {
    users: {
        id: string
        username: string
        email: string
        avatarUrl: string
    }[]
}
export default function UsersIndex(){
    const data = useLoaderData<UserLoaderData>()

    return (
        <div
            className='flex flex-col gap-2 md:gap-4 items-center'
        >
            <h1 className='text-2xl md:text-3xl font-bold'>Users</h1>
            <ul
            className='flex flex-col gap-1 md:gap-2 items-center w-full'
            >
                {data.users.map(user=>(
                    <li
                        className='border-2 w-full p-1 md:p-2 rounded-lg flex flex-col gap-1 md:gap-2 justify-between'
                    key={user.id}>
                       <RowBox>
                            <img
                                className='rounded-full w-10 h-10'
                                src={ user.avatarUrl }
                                alt={ user.username }
                            />
                       <h3 className='text-xl font-bold'>{user.username}</h3>


                       </RowBox>
                        <p>{user.email}</p>
                       <RowBox >
                        <Button
                        size='small'
                        variant='primary_filled'
                        >

                                <Link to={ `/blog/${user.username}` }> <p
                                    className='text-xs'
                                >Posts: { user._count.posts }</p></Link>

                        </Button>
                            <Link to={ `/users/${user.username}` }>View User</Link>
                       </RowBox>

                    </li>
                ))}
            </ul>
<Outlet />
            </div>
    )
}