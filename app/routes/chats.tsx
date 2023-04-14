import { LoaderArgs, json } from '@remix-run/node'
import { useLoaderData, Outlet } from '@remix-run/react'
import invariant from 'tiny-invariant'
import { isAuthenticated } from '~/server/auth/auth.server'
import { prisma } from '~/server/prisma.server'


export async function loader ({ request }: LoaderArgs) {
    const user = await isAuthenticated(request)
    invariant(user, 'User is not authenticated')
    const userId = user.id
    const chats = await prisma.chat.findMany({
        where: {
            users: {
                some: {
                    id: userId
                }
            }
        },
        select: {
            id: true
        }
    })

    return json({ chats })
}

export default function ChatsRoute () {
    const data = useLoaderData<typeof loader>()
    return (
        <>
            <h1>Chats</h1>
{data.chats.map(chat => (
                <div key={chat.id}>
                    <Outlet
                        context={`/chats/${chat.id}`}
                     />

                </div>

            ))}
            <hr />
            <Outlet />
        </>
    )
}
