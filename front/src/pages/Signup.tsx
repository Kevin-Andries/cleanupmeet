import { useState, ChangeEvent, FormEvent } from "react";
import { createUserWithEmailAndPassword } from "../utils/api";
import { Link, useNavigate } from "react-router-dom";
import { SyncLoader } from "react-spinners";
import { useStateContext } from "../utils/stateContext/stateContext";
import { Input } from "../components/form/Input";
import { Button } from "../components/common/Button";
import { ErrorMessage } from "../components/common/ErrorMessage";

export function SignUp() {
  const { dispatch } = useStateContext();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleNameChange(e: ChangeEvent<HTMLInputElement>) {
    setName(e.target.value);
  }

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
    const res = await createUserWithEmailAndPassword({ name, email, password });
    setLoading(false);

    if (res.errorMessage) {
      return setError(res.errorMessage);
    }

    console.log("created user", res);

    dispatch({ type: "SET_USER", payload: res });
    navigate("/");
  }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <form onSubmit={handleSubmit} className="w-64">
        <div className="flex flex-col mb-5">
          <label
            className="font-sans block text-gray-500 font-bold mb-2"
            htmlFor="inline-full-name"
          >
            Name
          </label>
          <Input
            id="inline-full-name"
            type="text"
            placeholder="Greta"
            onChange={handleNameChange}
          />
        </div>
        <div className="flex flex-col mb-6">
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
              "Sign Up"
            )}
          </Button>
          <Link to="/sign-in" className="underline text-gray-500">
            Already have an account? Sign In
          </Link>
        </div>
      </form>
    </div>
  );
}
