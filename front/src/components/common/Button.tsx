import { PropsWithChildren } from "react";

interface IButton {
  className?: string;
  color: "red" | "green" | "blue" | "purple" | "gray";
  paddingX?: number;
  paddingY?: number;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}

export function Button({
  children,
  color,
  className,
  paddingX = 4,
  paddingY = 2,
  type,
  onClick,
}: PropsWithChildren<IButton>) {
  return (
    <button
      type={type}
      className={`shadow bg-${color}-500 hover:opacity-50 focus:shadow-outline focus:outline-none text-white font-bold py-${paddingY} px-${paddingX} rounded ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
