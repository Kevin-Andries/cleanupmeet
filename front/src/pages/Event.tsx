import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BackButton } from "../components/common/BackButton";
import { Header } from "../components/common/Header";
import { PageTitle } from "../components/common/PageTitle";
import { Section } from "../components/common/Section";
import { Participant } from "../components/event/Participant";
import { ProfileButton } from "../components/profile/ProfileButton";
import { getEvent } from "../utils/api";
import { parseDate } from "../utils/parseDate";

export function Event() {
  const { eventIdOrSlug } = useParams();
  const [event, setEvent] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const mainPicture = event?.pictures.find((pic: any) => pic.isMainPicture);

  console.log(event);

  useEffect(() => {
    (async () => {
      if (!eventIdOrSlug) return;

      const res = await getEvent(eventIdOrSlug);

      if (res.status !== 200) {
        setError(true);
      } else {
        setEvent(await res.json());
      }

      setLoading(false);
    })();
  }, []);

  // useEffect(() => {
  //   if (!event) return;

  //   // fetch participants
  //   // fetch comments
  // }, [event]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Event not found</div>;

  if (event) {
    return (
      <>
        <Header>
          <BackButton to="/" />
          <PageTitle>Event</PageTitle>
          <ProfileButton />
        </Header>
        <main>
          <section className="flex flex-col items-center justify-center gap-2 mb-5">
            <img
              src={mainPicture.url}
              alt="event-picture"
              className="rounded"
            />
            <h2 className="mt-4 text-xl font-bold text-indigo-700">
              {event.name}
            </h2>
            <h3 className="text-gray-600 text-md">{parseDate(event.date)}</h3>
            <h4 className="text-gray-500 text-sm">
              {event.address}, {event.city}
            </h4>
          </section>
          <Section>
            <h2>
              {event.participants.length} participant
              {event.participants.length > 1 ? "s" : ""}! 🥳
            </h2>
            <div className="mt-4">
              {event.participants.map((participant: any) => (
                <Participant eventId={event.id} participant={participant} />
              ))}
            </div>
          </Section>
          <Section>comments</Section>
        </main>
      </>
    );
  }

  return <div>Event not found</div>;
}
