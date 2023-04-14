import { HomeIcon } from '@radix-ui/react-icons'
import { ColBox, RowBox } from './boxes'
import { Form } from '@remix-run/react'
import Button from './button'
import { useOptionalUser } from '~/utilities/utilities'

export default function Layout({ children }: { children: React.ReactNode}){

    return(
        <div className='flex flex-col h-screen'>
            <NavigationBar />
           <div className='flex flex-row h-full flex-grow p-2'>
           <LeftNavigationBar />
             <Main>
                {children}
             </Main>

            <RightNavigationBar />
                </div>


            <Footer />
            </div>
    )
}

function NavigationBar(){
    const user = useOptionalUser()
    return(
        <div className='flex flex-row justify-around items-center w-full md:w-4/6 mx-auto h-16 p-1 md:p-2'>
            <h1 className='text-2xl font-bold'>Vanished</h1>
          <RowBox
            className='flex-wrap'
          >
                <HomeIcon />
                <HomeIcon /><HomeIcon />
                <HomeIcon />
                <HomeIcon />
                <HomeIcon /><HomeIcon />
                <HomeIcon />
                <HomeIcon />
                <HomeIcon />

          </RowBox>
            <RowBox>
                { user && (<img
                                className='rounded-full w-10 h-10'
                                src={ user.avatarUrl }
                                alt={ user.username }
                            />
                    ) }
            <Form className='base-form'
                method='POST' action='/logout'
            >

                <Button variant='danger_filled' size='base'>
                    Logout
                </Button>
            </Form>
            </RowBox>
            </div>
    )
}

function LeftNavigationBar(){
    return(
        <div className='flex flex-col w-1/6 p-2 items-center'>
          <ColBox>
                <HomeIcon />
                <HomeIcon />
                <HomeIcon />
          </ColBox>
          <ColBox>
                <HomeIcon />
                <HomeIcon />
                <HomeIcon />
          </ColBox>
          <ColBox>
                <HomeIcon />
                <HomeIcon />
                <HomeIcon />
          </ColBox>

            </div>
    )
}
function RightNavigationBar(){
    return(
        <div className='flex flex-col w-1/6 p-2'>
            <ColBox>
                <HomeIcon />
                <HomeIcon />
                <HomeIcon />
            </ColBox>
            <ColBox>
                <HomeIcon />
                <HomeIcon />
                <HomeIcon />
            </ColBox>
            <ColBox>
                <HomeIcon />
                <HomeIcon />
                <HomeIcon />
            </ColBox>
            </div>
    )
}

function Main({children}: {children: React.ReactNode}){
    return(
        <div className='flex flex-col w-4/6  p-2'>
            {children}
            </div>
    )
}

function Footer(){
    return(
        <div className='flex flex-row items-center  h-16'>
           <p
              className='text-xs mx-auto'>
                Copyright { new Date().getFullYear() }
              </p>
           <p
              className='text-xs mx-auto'>
                Copyright { new Date().getFullYear() }
              </p>
           <p
              className='text-xs mx-auto'>
                Copyright { new Date().getFullYear() }
              </p>
            </div>
    )
}