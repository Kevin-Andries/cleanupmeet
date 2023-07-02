import { LogOutButton } from "../common/LogOutButton";

export function ProfileFooter() {
  return (
    <footer
      className="flex justify-end border-solid border-t border-gray-200 pt-10 pb-10"
      style={{ marginBottom: "100px" }}
    >
      <LogOutButton />
    </footer>
  );
}
