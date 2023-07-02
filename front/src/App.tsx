import { PropsWithChildren, useEffect } from "react";
import { getMe } from "./utils/api";
import { getPictureURL } from "./utils/getPictureURL";
import { useStateContext } from "./utils/stateContext/stateContext";
import "react-day-picker/dist/style.css";

function App({ children }: PropsWithChildren) {
  const { state, dispatch } = useStateContext();

  console.log("state", state);

  useEffect(() => {
    (async () => {
      console.log("run getMe in App.tsx");
      const res = await getMe();
      let payload = null;

      if (res.status === 200) {
        const user = await res.json();
        payload = user;
      }

      dispatch({
        type: "SET_USER",
        payload,
      });
    })();
  }, []);

  if (state.loading) return <div>Loading...</div>;
  return (
    <div className="flex justify-center p-2 h-full">
      <div style={{ width: "600px" }}>{children}</div>
    </div>
  );
}

export default App;
