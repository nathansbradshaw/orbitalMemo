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
} from "@remix-run/react";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Orbital Memo",
  viewport: "width=device-width,initial-scale=1",
});

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export type IContextType = {
  pusher: Pusher | null;
};
const pusher: Pusher = new Pusher("68236b4a0d5f637fabeb", { cluster: "us2" });
const context: IContextType = { pusher };

export default function App() {
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
