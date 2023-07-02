import { AnimatePresence, motion } from "framer-motion";
import { FormEvent, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStateContext } from "../utils/stateContext/stateContext";
import { Section } from "../components/common/Section";
import { Button } from "../components/common/Button";
import { Header } from "../components/common/Header";
import { CreateEventButton } from "../components/event/CreateEventButton";
import { PageTitle } from "../components/common/PageTitle";
import { BackButton } from "../components/common/BackButton";
import { ProfileFooter } from "../components/profile/ProfileFooter";
import { getPictureURL } from "../utils/getPictureURL";
import { DefaultUserPicture } from "../components/common/DefaultUserPicture";
import TrashIcon from "/icons/trash.png";
import { updateProfile } from "../utils/api";
import { TrashButton } from "../components/common/TrashButton";

export function EditProfile() {
  const { state, dispatch } = useStateContext();
  const user = state.user;
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSelectPictureTooltip, setShowSelectPictureTooltip] =
    useState(false);
  const [updatedUser, setUpdatedUser] = useState<any>({
    name: user.name,
    description: user.description,
  });
  const pictureInputRef = useRef(null);

  function handleSelectPicture() {
    if (isUpdating) return;

    // @ts-ignore
    pictureInputRef.current.click();
  }

  function handleChange(e: any) {
    setUpdatedUser((prev: any) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  function handleDeletePicture() {
    if (isUpdating) return;

    setUpdatedUser((prev: any) => ({
      ...prev,
      deletePicture: true,
      picture: null,
    }));
  }

  function handleChangePicture(e: any) {
    const picture = e.target.files[0];

    if (picture) {
      setUpdatedUser((prev: any) => ({
        ...prev,
        deletePicture: false,
        picture,
      }));
    }
  }

  function toggleSelectPictureTooltip() {
    setShowSelectPictureTooltip(!showSelectPictureTooltip);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isUpdating) return;
    setIsUpdating(true);

    const profileFormData = new FormData();

    profileFormData.append("name", updatedUser.name);
    profileFormData.append("description", updatedUser.description);
    profileFormData.append("picture", updatedUser.picture);

    if (updatedUser.deletePicture) {
      profileFormData.append("deletePicture", "true");
    }

    const res = await updateProfile(profileFormData);

    if (res.status === 200) {
      const updatedUser = await res.json();
      dispatch({ type: "UPDATE_USER", payload: updatedUser });
      return navigate("/profile");
    } else {
      console.log(await res.json());
    }

    setIsUpdating(false);
  }

  return (
    <>
      <Header>
        <CreateEventButton />
        <PageTitle>Profile</PageTitle>
        <BackButton to="/" />
      </Header>
      <main className={`mt-7 ${isUpdating ? "opacity-50 cursor-wait" : ""}`}>
        <form onSubmit={handleSubmit}>
          <div className="flex justify-end mb-3 gap-2">
            {!isUpdating && (
              <Link to="/profile">
                <Button type="button" color="red" className="rounded-full">
                  Cancel
                </Button>
              </Link>
            )}
            <Button type="submit" color="blue" className="rounded-full">
              {isUpdating ? "Saving..." : "Save"}
            </Button>
          </div>
          <Section className="flex flex-col items-center">
            <div className="w-full h-5"></div>
            <div className="relative">
              {(!updatedUser.picture && !user.pictureURL) ||
              updatedUser.deletePicture ? (
                <div
                  className="h-36 w-36 rounded-full cursor-pointer hover:blur-sm transition duration-2 mb-5"
                  onClick={handleSelectPicture}
                  onMouseEnter={toggleSelectPictureTooltip}
                  onMouseLeave={toggleSelectPictureTooltip}
                >
                  <DefaultUserPicture textSize="text-5xl" />
                </div>
              ) : (
                <img
                  src={
                    updatedUser.picture
                      ? URL.createObjectURL(updatedUser.picture)
                      : user.pictureURL
                  }
                  alt="you"
                  className="h-36 w-36 rounded-full cursor-pointer hover:blur-sm transition duration-2 object-cover mb-5"
                  onClick={handleSelectPicture}
                  onMouseEnter={toggleSelectPictureTooltip}
                  onMouseLeave={toggleSelectPictureTooltip}
                />
              )}
              {(user.pictureURL || updatedUser.picture) && (
                <TrashButton
                  className="top-0 -right-5"
                  onClick={handleDeletePicture}
                />
              )}
              <AnimatePresence>
                {showSelectPictureTooltip && (
                  <motion.p
                    className="absolute top-5 bg-gray-200 pointer-events-none p-5 rounded text-gray-700 text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.8, transition: { duration: 0.2 } }}
                    exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  >
                    Click to select a new profile picture
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
            <input
              type="file"
              ref={pictureInputRef}
              className="hidden"
              onChange={handleChangePicture}
            />
            <div className="flex flex-col gap-3 w-3/4 mt-2">
              <input
                className="
            text-2xl
            font-bold
            form-control
            block
            w-full
            px-3
            py-1.5
            text-gray-700
            bg-white bg-clip-padding
            border-2 border-solid border-gray-300
            rounded
            transition
            ease-in-out
            m-0
            focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                type="text"
                value={updatedUser.name}
                name="name"
                onChange={handleChange}
              />
              <textarea
                className="
            form-control
            block
            w-full
            px-3
            py-1.5
            text-base
            text-gray-700
            bg-white bg-clip-padding
            border-2 border-solid border-gray-300
            rounded
            transition
            ease-in-out
            m-0
            focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                style={{
                  minHeight: "150px",
                }}
                value={updatedUser.description}
                name="description"
                onChange={handleChange}
              />
            </div>
            <Button type="submit" color="blue" className="rounded-full mt-5">
              {isUpdating ? "Saving..." : "Save"}
            </Button>
          </Section>
        </form>
      </main>
      <ProfileFooter />
    </>
  );
}
