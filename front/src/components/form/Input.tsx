import { ChangeEvent } from "react";

interface IInput {
  className?: string;
  id: string;
  type: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function Input({ className, id, type, placeholder, onChange }: IInput) {
  return (
    <input
      onChange={onChange}
      id={id}
      type={type}
      placeholder={placeholder}
      className={`bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 ${className}`}
    />
  );
}
