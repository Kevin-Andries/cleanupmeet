import { Action, IState } from "./types";

export function reducer(state: IState, { type, payload }: Action) {
  switch (type) {
    case "SET_USER":
      return {
        ...state,
        loading: false,
        isLoggedIn: !!payload,
        user: payload,
      };
    case "UPDATE_USER":
      return {
        ...state,
        user: {
          ...state.user,
          ...payload,
        },
      };
    case "CREATE_EVENT": {
      return {
        ...state,
        user: {
          ...state.user,
          participationInEvents: [
            ...state.user.participationInEvents,
            {
              type: "ORGANIZER",
              joinedAt: payload.createdAt,
              accompanyingPeople: 0,
              event: payload,
            },
          ],
          createdEvents: [...state.user.createdEvents, payload.id],
        },
      };
    }
    case "LOG_OUT":
      return {
        ...state,
        loading: false,
        isLoggedIn: false,
        user: null,
      };
    default:
      return state;
  }
}
