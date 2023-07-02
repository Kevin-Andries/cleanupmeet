import { Link } from "react-router-dom";
import { Button } from "../common/Button";

export function CreateEventButton() {
  return (
    <Link to="/create-event">
      <Button color="green" className="rounded-full h-10">
        Create an event
      </Button>
    </Link>
  );
}
