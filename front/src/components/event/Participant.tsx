import { useEffect, useState } from "react";
import { getParticipant } from "../../utils/api";

export function Participant({
  eventId,
  participant,
}: {
  eventId: string;
  participant: any;
}) {
  const [participantData, setParticipantData] = useState<any>({});

  useEffect(() => {
    (async () => {
      const res = await getParticipant(eventId, participant.userId);

      if (res.status === 200) {
        const user = await res.json();
        setParticipantData(user);
      }
    })();
  }, [participant.userId]);

  console.log("here", participantData);

  return (
    <button
      onClick={() => {
        // TODO: redirect to profile
      }}
      className="hover:-translate-y-2 transition-all duration-300 ease-in-out rounded-full bg-red-100"
      style={{
        marginLeft: "-15px",
      }}
    >
      <img
        src={participantData.pictureURL}
        alt="profile-picture"
        style={{ height: "50px", width: "50px" }}
      />
    </button>
  );
}
