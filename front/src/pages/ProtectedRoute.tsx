import { PropsWithChildren, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../utils/stateContext/stateContext";

export function ProtectedRoute({ children }: PropsWithChildren) {
  const { state } = useStateContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (state.isLoggedIn) {
      navigate("/");
    }
  });

  if (state.isLoggedIn) return <></>;

  return <>{children}</>;
}
