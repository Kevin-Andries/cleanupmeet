import { PropsWithChildren } from "react";

export function PageTitle({ children }: PropsWithChildren) {
  return <h2 className="font-bold">{children}</h2>;
}
