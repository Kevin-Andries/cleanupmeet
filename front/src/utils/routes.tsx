import { Homepage } from "../pages/Homepage";
import { PrivateRoute } from "../pages/PrivateRoute";
import { ProtectedRoute } from "../pages/ProtectedRoute";
import { SignUp } from "../pages/SignUp";
import { SignIn } from "../pages/SignIn";
import { Profile } from "../pages/Profile";
import { Event } from "../pages/Event";
import { EditProfile } from "../pages/EditProfile";
import { CreateEvent } from "../pages/CreateEvent";

export const routes = [
  {
    path: "/",
    element: (
      <PrivateRoute>
        <Homepage />
      </PrivateRoute>
    ),
  },
  {
    path: "/sign-up",
    element: (
      <ProtectedRoute>
        <SignUp />
      </ProtectedRoute>
    ),
  },
  {
    path: "/sign-in",
    element: (
      <ProtectedRoute>
        <SignIn />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <PrivateRoute>
        <Profile />
      </PrivateRoute>
    ),
  },
  {
    path: "/profile/edit",
    element: (
      <PrivateRoute>
        <EditProfile />
      </PrivateRoute>
    ),
  },
  {
    path: "/event/:eventIdOrSlug",
    element: <Event />,
  },
  {
    path: "/create-event",
    element: (
      <PrivateRoute>
        <CreateEvent />
      </PrivateRoute>
    ),
  },
];
