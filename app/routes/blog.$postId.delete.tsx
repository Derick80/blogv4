import { ActionArgs, json } from '@remix-run/node'
import { isAuthenticated } from '~/server/auth/auth.server'
import { prisma } from '~/server/prisma.server'

export async function action({request, params}:ActionArgs){
    const user = await isAuthenticated(request)
    if(!user){
        throw new Error("You must be logged in to delete this this page");
    }

    const postId = params.postId
    if(!postId){
        throw new Error("No post id provided");
    }

    await prisma.post.delete({
        where:{
            id:postId
        }

    })

    return json({message:'Post deleted successfully'})

}