import {
  createContext,
  PropsWithChildren,
  useContext,
  useReducer,
} from "react";
import { reducer } from "./reducer";
import { IState } from "./types";

const initialState: IState = {
  loading: true,
  isLoggedIn: false,
  user: null,
};
const StateContext = createContext<any>(initialState);

export function StateContextProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer<any>(reducer, initialState);

  return (
    <StateContext.Provider value={{ state, dispatch }}>
      {children}
    </StateContext.Provider>
  );
}

export const useStateContext = () => useContext(StateContext);
