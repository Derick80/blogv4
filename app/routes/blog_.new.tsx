import { faker } from '@faker-js/faker'
import { ActionArgs, json, redirect } from '@remix-run/node'
import { Form, useActionData } from '@remix-run/react'
import React from 'react'
import { z } from 'zod'
import Button from '~/components/button'
import TipTap from '~/components/tip-tap'
import { isAuthenticated } from '~/server/auth/auth.server'
import { prisma } from '~/server/prisma.server'
import { validateAction } from '~/utilities/utilities'

export const schema = z.object({
    title: z.string().min(1).max(100),
    body: z.string().min(1).max(10000)

})

type ActionInput = z.infer<typeof schema>
export async function action({request}:ActionArgs){
const user = await isAuthenticated(request)

if(!user){
    return redirect('/login')
}

const { formData, errors} = await validateAction({request,schema})
if(errors){
    return json({errors}, {status:400})
}
const {title,body} = formData as ActionInput

await prisma.post.create({
    data:{
        title,
        content:body,
        imageUrl: faker.image.imageUrl(

            1280, 720, 'dog', true
        ),
        user:{
            connect:{
                id:user.id
            }
    }
    }
})


    return redirect('/blog')
}


export default function NewPostRoute(){
    const actionData = useActionData<typeof action>() as {errors?:{[key:string]:string}}

       return(
        <div
            className='flex flex-col gap-2 md:gap-4 items-center w-full h-fit'
        >
            <h1>New Post</h1>
            <Form
                className='form-base rounded-lg '
            method="post">
                <label htmlFor="title">Title</label>
                <input type="text" name="title" id="title" />
                { actionData?.errors?.title && (
                    <p id='title-error' role='alert' className='text-red-500'>
                        { actionData?.errors?.title }
                    </p>
                ) }
                <label htmlFor="body">Content</label>
                <TipTap  />

                { actionData?.errors?.body && (
                    <p id='body-error' role='alert' className='text-red-500'>
                        { actionData?.errors?.body }
                    </p>
                ) }
            <input type='hidden' name='imageUrl' id='imageUrl' />
                { actionData?.errors?.imageUrl && (
                    <p id='imageUrl-error' role='alert' className='text-red-500'>
                        { actionData?.errors?.imageUrl }
                    </p>
                ) }
                <Button
                variant='primary_filled'
                size='small'
                type="submit">Submit</Button>
            </Form>
        </div>
    )
}