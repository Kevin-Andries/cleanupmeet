import { PropsWithChildren } from "react";

export function Header({ children }: PropsWithChildren) {
  return (
    <header className="flex justify-between items-center h-16">
      {children}
    </header>
  );
}
