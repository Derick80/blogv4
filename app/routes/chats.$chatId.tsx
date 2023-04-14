import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import {
    Outlet,
        useFetcher,
    useLoaderData,
    useParams,

} from '@remix-run/react'
import { useEffect, useRef } from 'react'
import invariant from 'tiny-invariant'
import Button from '~/components/button'
import { isAuthenticated } from '~/server/auth/auth.server'
import { chatEmitter, EVENTS } from '~/server/chat.server'
import { prisma } from '~/server/prisma.server'
import { useEventSource, useRevalidator } from '~/utilities/utilities'
import { UserPlaceHolder } from '~/utilities/icon-transforms'

export async function loader ({ request, params }: LoaderArgs) {
    invariant(params.chatId, 'chatId is required')
    const user = await isAuthenticated(request)
    invariant(user, 'User is not authenticated')
    const userId = user.id
    const chat = await prisma.chat.findFirst({
        where: {
            id: params.chatId,
            users: {
                some: {
                    id: userId
                }
            }
        },
        select: {
            id: true,
            users: {
                select: {
                    id: true,
                    username: true,
                    avatarUrl: true
                }
            },
            messages: {
                select: {
                    id: true,
                    content: true,
                    userId: true
                }
            }
        }
    })

    if (!chat) {
        throw new Response('Chat not found', { status: 404 })
    }
    return json({ chat })
}

export async function action ({ request, params }: ActionArgs) {
    const user = await isAuthenticated(request)
    invariant(user, 'User is not authenticated')
    invariant(params.chatId, 'chatId is required')
    const userId = user.id
    const formData = await request.formData()
    const { action, content } = Object.fromEntries(formData)
    invariant(typeof content === 'string', 'content invalid')
    switch (action) {
        case 'send-message': {
            await prisma.message.create({
                data: {
                    content,
                    userId,
                    chatId: params.chatId
                },
                select: {
                    id: true
                }
            })
            chatEmitter.emit(EVENTS.NEW_MESSAGE, Date.now())
            return json({ success: true })
        }
        default: {
            throw new Error(`Unexpected action: ${action}`)
        }
    }
}
export default function ChatRoute () {
    const { chatId } = useParams()
console.log('chatId', chatId);

    const data = useLoaderData<typeof loader>()
    const messageFetcher = useFetcher<typeof action>()
    const chatUpdateData = useEventSource(`/chats/${chatId}/events`)
    const revalidator = useRevalidator()
    const mounted = useRef(false)

    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true
            return
        }
        revalidator.revalidate()
    }, [chatUpdateData, revalidator])

    return (
        <div>
            <h1>Chat</h1>

            <div className='flex flex-col gap-2'>
                { data.chat.messages.map((message) => {
                    const sender = data.chat.users.find(
                        (user) => user.id === message.userId
                    )
                    return (
                        <div key={ message.id } className='flex flex-row gap-2'>
                            <img
                                src={ sender?.avatarUrl ??  '' }
                                alt={ ''}
                                className='h-8 w-8 rounded-full'
                            />
                            <div className='flex flex-col'>
                                <div className='flex flex-row'>
                                    <div className='font-bold'>{ sender?.username }</div>
                                </div>
                                <div>{ message.content }</div>
                            </div>
                        </div>
                    )
                }) }
            </div>
            <hr />
            <messageFetcher.Form
                method='post'
                onSubmit={ (event) => {
                    const form = event.currentTarget
                    requestAnimationFrame(() => {
                        form.reset()
                    })
                } }
            >
                <input type='text' name='content' className='text-black' />
                <Button
                    variant='primary_filled'
                type='submit' name='action' value='send-message'>
                    Send
                </Button>
            </messageFetcher.Form>
            <Outlet />
        </div>
    )
}


