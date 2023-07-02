import { useStateContext } from "../../utils/stateContext/stateContext";

export function DefaultUserPicture({ textSize = "" }) {
  const { state } = useStateContext();

  return (
    <p
      className={`w-full h-full rounded-full bg-green-200 flex justify-center items-center font-bold ${textSize}`}
    >
      {state.user.name[0].toUpperCase()}
    </p>
  );
}
