interface ILightGreyText {
  children: string;
  size: string;
}

export function LightGreyText({ children, size }: ILightGreyText) {
  return <p className={`text-gray-400 ${size}`}>{children}</p>;
}
