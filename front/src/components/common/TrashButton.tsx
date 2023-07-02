import { Button } from "./Button";
import TrashIcon from "../../../public/icons/trash.png";

interface ITrashButton {
  className?: string;
  onClick: () => void;
}

export function TrashButton({ className, onClick }: ITrashButton) {
  return (
    <Button
      type="button"
      color="red"
      className={
        "absolute rounded-full h-8 w-8 flex justify-center items-center " +
        className
      }
      paddingX={2}
      onClick={onClick}
    >
      <img src={TrashIcon} alt="delete" />
    </Button>
  );
}
