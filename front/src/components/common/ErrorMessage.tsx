import { PropsWithChildren } from "react";

export function ErrorMessage({ children }: PropsWithChildren) {
  return <p className="text-red-500 text-sm">{children}</p>;
}
