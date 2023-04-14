import type { LoaderArgs} from '@remix-run/node';
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { prisma } from '~/server/prisma.server'

export async function loader({request, params}:LoaderArgs){
    const {username} = params
    console.log(username, 'username');

const posts = await prisma.post.findMany({
    where:{
        published:true,
        user:{
            username
        }
    },
    include:{
        user:true,
        comments:true,
        likes:true
    },
    orderBy:{
        createdAt:'desc'
    }
})

    return json({posts})
}

export default function BlogUserIndex(){
    const data = useLoaderData<typeof loader>()

    return(
        <div>
            <pre className='text-xs'>{JSON.stringify(data, null, 2)}</pre>

            </div>
    )

}