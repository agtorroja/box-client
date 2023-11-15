import { ReactNode } from "react";
interface BodyProps {
  children: ReactNode;
}
export function BodyLayout({ children }: BodyProps) {
  return <div className="p-2 border h-[90vh] ">{children}</div>;
}
