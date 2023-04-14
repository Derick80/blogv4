import { LoaderArgs, json } from '@remix-run/node'
import { isAuthenticated } from '~/server/auth/auth.server'
import { prisma } from '~/server/prisma.server'

export async function loader({request}:LoaderArgs){
    const user = await isAuthenticated(request)
    if(!user){
        throw new Error("You must be logged in to view this page");

    }

    const drafts = await prisma.post.findMany({
        where:{
            published:false,
            user:{
                id:user.id
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

    return json({drafts})
}


export function Error_Boundary({error}:{error:Error}){
    return(
        <div
        className='bg-red'
        >

            <h1
                className='text-white text-3xl'
            >{error.message}</h1>
        </div>
    )
}