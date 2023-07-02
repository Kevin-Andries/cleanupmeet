import { useStateContext } from "../../utils/stateContext/stateContext";
import { EventCard } from "../common/EventCard";
import { LightGreyText } from "../common/LightGreyText";

export function EventSection() {
  const { state } = useStateContext();
  const user = state.user;

  if (user.participationInEvents.length === 0) {
    return <LightGreyText size="text-md">No events yet</LightGreyText>;
  }

  return (
    <div>
      <h4 className="font-bold text-indigo-800">{`${user.name} is saving the planet!`}</h4>
      <h4 className="text-indigo-800 text-center mt-5">Upcoming events</h4>
      <div className="mt-5">
        {user.participationInEvents.map((participation: any) => {
          const event = participation.event;

          return (
            <EventCard
              key={event.id}
              event={event}
              participantType={participation.type}
            />
          );
        })}
      </div>
    </div>
  );
}
