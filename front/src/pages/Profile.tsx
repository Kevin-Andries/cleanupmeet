import { BackButton } from "../components/common/BackButton";
import { Header } from "../components/common/Header";
import { PageTitle } from "../components/common/PageTitle";
import { CreateEventButton } from "../components/event/CreateEventButton";
import { ProfileFooter } from "../components/profile/ProfileFooter";
import { Link } from "react-router-dom";
import { Section } from "../components/common/Section";
import { parseDate } from "../utils/parseDate";
import { useStateContext } from "../utils/stateContext/stateContext";
import { Button } from "../components/common/Button";
import { EventSection } from "../components/profile/EventSection";
import { DefaultUserPicture } from "../components/common/DefaultUserPicture";
import { LightGreyText } from "../components/common/LightGreyText";

export function Profile() {
  const { state } = useStateContext();
  const user = state.user;

  function renderDescription() {
    if (user.description) return <p>{user.description}</p>;

    return (
      <LightGreyText size="text-md">
        You haven't set a description yet
      </LightGreyText>
    );
  }

  function renderProfilePicture() {
    if (user.pictureURL) {
      return (
        <img
          src={user.pictureURL}
          alt="you"
          className="h-36 w-36 rounded-full mb-5"
        />
      );
    }

    return (
      <div className="h-36 w-36 rounded-full mb-5">
        <DefaultUserPicture textSize="text-5xl" />
      </div>
    );
  }

  return (
    <>
      <Header>
        <CreateEventButton />
        <PageTitle>Profile</PageTitle>
        <BackButton to="/" />
      </Header>
      <main>
        <div className="flex justify-end mb-3">
          <Link to="/profile/edit">
            <Button color="gray" className="rounded-full">
              Edit
            </Button>
          </Link>
        </div>
        <Section className="flex flex-col items-center">
          <div className="w-full h-5 flex justify-between items-center">
            <p className="text-md">
              Helped to collect {user.trashCollectedInKg || 0}kg of trashes
            </p>
            <p className="text-right text-xs text-gray-300">
              Member since{" "}
              {parseDate(user.createdAt, {
                year: true,
                month: true,
                day: false,
              })}
            </p>
          </div>
          {renderProfilePicture()}
          <div className="flex flex-col items-center gap-1 mb-3">
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <h4 className="text-xs text-gray-400">
              {user.username && `@${user.username}`}
            </h4>
          </div>
          {renderDescription()}
        </Section>
        <Section>
          <EventSection />
        </Section>
      </main>
      <ProfileFooter />
    </>
  );
}
