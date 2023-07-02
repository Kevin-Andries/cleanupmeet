import { useEffect } from "react";
import { Link } from "react-router-dom";
import { parseDate } from "../../utils/parseDate";
import { Button } from "./Button";

export function EventCard({
  event: { id, name, address, description, date, pictures },
  participantType,
}: any) {
  useEffect(() => {}, []);

  const mainPicture = pictures.find((pic: any) => pic.isMainPicture);

  return (
    <div className="bg-green-100 p-4 rounded mb-8">
      <h5 className="mb-2 text-sm text-red-600 font-bold">
        {participantType.charAt(0) + participantType.slice(1).toLowerCase()}
      </h5>
      <div className="flex justify-between items-center">
        <h4 className="font-bold">{name}</h4>
        <p className="bg-green-50 py-2 px-4 rounded-full font-bold text-xs">
          {parseDate(date)}
        </p>
      </div>
      <p className="text-gray-600">{address}</p>
      <p className="mt-6">{description}</p>
      <img
        src={mainPicture.url}
        alt="event-picture"
        className="mt-5 object-contain"
        style={{ height: "100px", width: "150px" }}
      />
      <div className="flex justify-end mt-4">
        <Link to={`/event/${id}`}>
          <Button color="purple" className="rounded-full text-sm py-1 px-4">
            See event &rarr;
          </Button>
        </Link>
      </div>
    </div>
  );
}
