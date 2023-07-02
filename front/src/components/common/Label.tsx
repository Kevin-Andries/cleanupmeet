import { PropsWithChildren } from "react";

interface ILabel {
  htmlFor: string;
}

export function Label({ children, htmlFor }: PropsWithChildren<ILabel>) {
  return (
    <label htmlFor={htmlFor} className="font-bold mt-5">
      {children}
    </label>
  );
}
