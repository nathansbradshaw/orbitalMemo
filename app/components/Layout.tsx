import { LoaderFunction, redirect } from "@remix-run/node";
import { getUser } from "~/utils/auth.server";
import { backgroundColorMap } from "~/utils/constants";
import Header from "./Header";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`w-full font-mono ${backgroundColorMap.PRIMARY_GRADIAN}`}>
      <Header />
      {children}
    </div>
  );
}
