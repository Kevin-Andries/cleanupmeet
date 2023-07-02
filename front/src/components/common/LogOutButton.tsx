import { useNavigate } from "react-router-dom";
import { logOut } from "../../utils/api";
import { useStateContext } from "../../utils/stateContext/stateContext";
import { Button } from "./Button";

export function LogOutButton() {
  const { dispatch } = useStateContext();
  const navigate = useNavigate();

  const handleLogOut = async () => {
    await logOut();
    dispatch({ type: "LOG_OUT" });
    navigate("/");
  };

  return (
    <Button
      onClick={handleLogOut}
      color="red"
      className="rounded-full text-xs py-2 px-2"
    >
      Log out
    </Button>
  );
}
