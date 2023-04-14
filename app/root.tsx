import { LinksFunction, LoaderArgs, json } from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import stylesheet from "~/tailwind.css"
import { isAuthenticated } from './server/auth/auth.server'
import Layout from './components/layout'

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
]

export async function loader({request}:LoaderArgs){
  const user = await isAuthenticated(request)

  return json({user})
}

export async function action () {
  return { ok: true }
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body
        className=' dark:bg-stone-950 dark:text-slate-50'
      >
       <Layout>
          <Outlet />
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
       </Layout>
      </body>
    </html>
  );
}
