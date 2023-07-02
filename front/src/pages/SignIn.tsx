import { useState, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SyncLoader } from "react-spinners";
import { useStateContext } from "../utils/stateContext/stateContext";
import { Input } from "../components/form/Input";
import { Button } from "../components/common/Button";
import { signInWithEmailAndPassword } from "../utils/api";
import { getPictureURL } from "../utils/getPictureURL";
import { ErrorMessage } from "../components/common/ErrorMessage";

export function SignIn() {
  const { dispatch } = useStateContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleEmailChange(e: ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value);
  }

  function handlePasswordChange(e: ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (loading) return;

    setLoading(true);
    const res = await signInWithEmailAndPassword(email, password);
    setLoading(false);

    if (res.status !== 200) {
      return setError("Invalid email or password");
    }

    const user = await res.json();

    const pictureURL = await getPictureURL(user.pictureId);
    user.pictureURL = pictureURL;

    dispatch({
      type: "SET_USER",
      payload: user,
    });

    navigate("/");
  }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <form onSubmit={handleSubmit} className="w-64">
        <div className="flex flex-col mb-5">
          <label
            className="font-sans block text-gray-500 font-bold mb-2"
            htmlFor="inline-email"
          >
            Email
          </label>
          <Input
            id="inline-email"
            type="text"
            placeholder="greta@thunberg.green"
            onChange={handleEmailChange}
          />
        </div>
        <div className="flex flex-col mb-6">
          <label
            className="font-sans block text-gray-500 font-bold mb-2"
            htmlFor="inline-password"
          >
            Password
          </label>
          <Input
            id="inline-password"
            type="password"
            placeholder="******"
            onChange={handlePasswordChange}
          />
          <div className="mt-2">
            {error && <ErrorMessage>{error}</ErrorMessage>}
          </div>
        </div>
        <div className="flex flex-col gap-10 justify-center">
          <Button color="purple" type="submit">
            {loading ? (
              <SyncLoader color="white" size="10px" speedMultiplier={0.6} />
            ) : (
              "Sign In"
            )}
          </Button>
          <Link to="/sign-up" className="underline text-gray-500">
            Don't have an account? Sign Up
          </Link>
        </div>
      </form>
    </div>
  );
}
