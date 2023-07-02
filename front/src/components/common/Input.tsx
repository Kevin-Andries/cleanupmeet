interface IInput {
  type: string;
  id?: string;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  register?: any;
}

export function Input({
  type,
  id,
  className,
  value,
  onChange,
  register = () => {},
}: IInput) {
  return (
    <input
      className={`border-2 border-indigo-600 rounded p-2 focus:outline-none ${className}`}
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      {...register(id, { required: true })}
    />
  );
}
