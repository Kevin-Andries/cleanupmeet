import { Link } from "react-router-dom";

interface IBackButton {
  to: string;
}

export function BackButton({ to }: IBackButton) {
  return (
    <Link to={to}>
      <button className="bg-gray-200 hover:opacity-50 rounded-full h-8 w-8">
        &larr;
      </button>
    </Link>
  );
}
