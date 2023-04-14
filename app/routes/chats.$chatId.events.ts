import { json, LoaderArgs } from '@remix-run/node'
import { eventStream } from '~/server/event-stream.server'
import invariant from 'tiny-invariant'
import { isAuthenticated } from '~/server/auth/auth.server'
import { chatEmitter, EVENTS } from '~/server/chat.server'
import { prisma } from '~/server/prisma.server'


export async function loader ({ request, params }: LoaderArgs) {
    const currentUser = await isAuthenticated(request)
    invariant(currentUser, 'You must be logged in to access this page')
    const userId = currentUser.id
    const hasAccess = await prisma.chat.findFirst({
        where: {
            id: params.chatsId,
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

    if (!hasAccess) {
        return new Response('Access Denied', { status: 403 })
    }
    return eventStream(request, (send) => {
        function handler (message: string) {
            send('message', message)
        }
        chatEmitter.addListener(EVENTS.NEW_MESSAGE, handler)
        return () => {
            chatEmitter.removeListener(EVENTS.NEW_MESSAGE, handler)
        }
    })
}

// export function unstable_shouldReload(){
//     // this should never reload
//     return false
// }
