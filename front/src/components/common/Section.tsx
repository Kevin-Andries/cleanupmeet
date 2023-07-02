import { PropsWithChildren } from "react";

interface ISection {
  className?: string;
}

export function Section({ className, children }: PropsWithChildren<ISection>) {
  return (
    <section
      className={`border-solid border-t border-gray-200 pt-5 pb-5 ${className}`}
    >
      {children}
    </section>
  );
}
