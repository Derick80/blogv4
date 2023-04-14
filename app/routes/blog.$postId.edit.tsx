import { LoaderArgs, json } from '@remix-run/node'
import { isAuthenticated } from '~/server/auth/auth.server'
import { prisma } from '~/server/prisma.server'

export async function loader({request, params}:LoaderArgs){
   const user = await isAuthenticated(request)
    if(!user){
        throw new Error("You must be logged in to view this page");
    }

    const postId = params.postId
    if(!postId){
        throw new Error("No post id provided");
    }

    const post  = await prisma.post.findUnique({
        where:{
            id:postId
        },
        include:{
            user:true,
            comments:true,
            likes:true
        }}
    )

    if(!post){
        throw new Error("No post found");
    }

    return json({post})



}