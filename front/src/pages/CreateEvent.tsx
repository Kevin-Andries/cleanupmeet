import { BackButton } from "../components/common/BackButton";
import { Header } from "../components/common/Header";
import { useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import { useForm } from "react-hook-form";
import { PageTitle } from "../components/common/PageTitle";
import { parseDate } from "../utils/parseDate";
import { Input } from "../components/common/Input";
import { Label } from "../components/common/Label";
import { createEvent } from "../utils/api";
import { useStateContext } from "../utils/stateContext/stateContext";
import { ErrorMessage } from "../components/common/ErrorMessage";
import { TrashButton } from "../components/common/TrashButton";

export function CreateEvent() {
  const { dispatch } = useStateContext();
  const [picture, setPicture] = useState(null);
  const [date, setDate] = useState<Date>();
  const [dateMissing, setDateMissing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const pictureInputRef = useRef(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  function handleSelectPicture() {
    if (isLoading) return;

    // @ts-ignore
    pictureInputRef.current.click();
  }

  function handleChangePicture(e: any) {
    if (isLoading) return;
    const picture = e.target.files[0];

    if (picture) {
      setPicture(picture);
    }
  }

  function handleDeletePicture() {
    if (isLoading) return;

    setPicture(null);
  }

  async function onSubmit(data: any) {
    if (isLoading) return;
    if (!date) {
      return setDateMissing(true);
    }
    setIsLoading(true);
    setDateMissing(false);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append(
      "date",
      `${date?.getFullYear()}-0${date?.getMonth()! + 1}-${date?.getDate()}`
    );
    formData.append("address", data.address);
    formData.append("city", data.city);
    formData.append("description", data.description);
    if (picture) {
      formData.append("picture", picture);
    }

    const res = await createEvent(formData);

    if (res.status === 201) {
      const createdEvent = await res.json();
      dispatch({ type: "CREATE_EVENT", payload: createdEvent });
    } else {
      console.log(await res.json());
    }

    setIsLoading(false);
  }

  return (
    <>
      <Header>
        <PageTitle>Create an event</PageTitle>
        <BackButton to="/" />
      </Header>
      <main className="pb-10 pt-10">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={`flex flex-col gap-2 p-10 bg-indigo-50 rounded-xl$ ${
            isLoading ? "opacity-50 cursor-wait" : ""
          }`}
        >
          <Label htmlFor="name">Name</Label>
          <Input type="text" id="name" register={register} />
          {errors.name && <ErrorMessage>Name is required</ErrorMessage>}
          <Label htmlFor="date">Date</Label>
          <div className="flex justify-center">
            <DayPicker
              id="date"
              mode="single"
              selected={date}
              onSelect={setDate}
              fromDate={new Date()}
              modifiersClassNames={{
                selected: "bg-indigo-700 text-white",
              }}
              footer={
                date && (
                  <p className="text-indigo-600 font-bold mt-2">
                    {parseDate(date.toString())}
                  </p>
                )
              }
            />
          </div>
          {dateMissing && !date && (
            <ErrorMessage>A date is required</ErrorMessage>
          )}
          <Label htmlFor="address">Address</Label>
          <Input type="text" id="address" register={register} />
          {errors.address && <ErrorMessage>Address is required</ErrorMessage>}
          <Label htmlFor="city">City</Label>
          <Input type="text" id="city" register={register} />
          {errors.city && <ErrorMessage>City is required</ErrorMessage>}
          <Label htmlFor="description">Description</Label>
          <Input type="text" id="description" register={register} />
          {errors.description && (
            <ErrorMessage>A short description is required</ErrorMessage>
          )}
          <Label htmlFor="picture">Picture (optional)</Label>
          <input
            type="file"
            id="picture"
            ref={pictureInputRef}
            onChange={handleChangePicture}
            className="hidden"
          />
          <div className="relative">
            {picture ? (
              <img
                src={URL.createObjectURL(picture)}
                onClick={handleSelectPicture}
                className="rounded object-contain cursor-pointer"
                style={{
                  height: "100px",
                  width: "150px",
                }}
              />
            ) : (
              <button
                type="button"
                className="w-full h-20 bg-green-200 rounded"
                onClick={handleSelectPicture}
              >
                +
              </button>
            )}
            {picture && (
              <TrashButton
                className="top-0 -left-2"
                onClick={handleDeletePicture}
              />
            )}
          </div>
          <Input
            type="submit"
            value="Create event!"
            className="mt-5 bg-blue-500 border-none rounded text-white cursor-pointer p-3"
          />
        </form>
      </main>
      <footer></footer>
    </>
  );
}
