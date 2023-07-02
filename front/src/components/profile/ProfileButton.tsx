import { PropsWithChildren } from "react";
import { Link } from "react-router-dom";
import DefaultProfilePicture from "../../../../profile-picture.png";
import { useStateContext } from "../../utils/stateContext/stateContext";
import { DefaultUserPicture } from "../common/DefaultUserPicture";

function Wrapper({ children }: PropsWithChildren) {
  return (
    <Link to="/profile" className="h-12 w-12 rounded-full hover:opacity-50">
      {children}
    </Link>
  );
}

export function ProfileButton() {
  const { state } = useStateContext();

  if (!state.user.pictureURL) {
    return (
      <Wrapper>
        <DefaultUserPicture />
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <img
        src={state.user.pictureURL}
        alt="you"
        className="w-full h-full rounded-full"
      />
    </Wrapper>
  );
}
