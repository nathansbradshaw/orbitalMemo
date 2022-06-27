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
// console.log(process.env.PUSHER_APP_KEY);

export const loader: LoaderFunction = async ({}) => {
  const appkey = process.env.PUSHER_APP_KEY;
  const cluster = process.env.PUSHER_CLUSTER;
  const pusher = new Pusher(appkey, {
    cluster: cluster,
  });
  return json({ appkey, cluster, pusher });
};

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
