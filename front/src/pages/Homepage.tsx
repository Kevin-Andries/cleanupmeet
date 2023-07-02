import { Header } from "../components/common/Header";
import { PageTitle } from "../components/common/PageTitle";
import { CreateEventButton } from "../components/event/CreateEventButton";
import { ProfileButton } from "../components/profile/ProfileButton";

export function Homepage() {
  return (
    <>
      <Header>
        <CreateEventButton />
        <PageTitle>Homepage</PageTitle>
        <ProfileButton />
      </Header>
      <main></main>
      <footer></footer>
    </>
  );
}
