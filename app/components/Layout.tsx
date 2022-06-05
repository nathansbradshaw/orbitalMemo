import { backgroundColorMap } from "~/utils/constants";
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={` h-screen w-full font-mono ${backgroundColorMap.PRIMARY_GRADIAN}`}
    >
      {children}
    </div>
  );
}
