import {
  MetaFunction,
  LinksFunction,
  json,
  LoaderFunction,
} from "@remix-run/node";
import styles from "./styles/app.css";
import Pusher from "pusher-js";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Orbital Memo",
  viewport: "width=device-width,initial-scale=1",
});

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

const pusher = new Pusher("68236b4a0d5f637fabeb", {
  cluster: "us2",
});
// console.log(PUSHER_APP_KEY);
// const test = "blah";

// const context = { pusher };
// const context = { test };
export default function App() {
  const pusher = useLoaderData();
  const context = { pusher };
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet context={context} />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
