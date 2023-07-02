interface ICreateUserWithEmailAndPassword {
  name: string;
  email: string;
  password: string;
}

export async function createUserWithEmailAndPassword({
  name,
  email,
  password,
}: ICreateUserWithEmailAndPassword) {
  return await fetch("/api/auth/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  }).then((res) => res.json());
}

export async function signInWithEmailAndPassword(
  email: string,
  password: string
) {
  return await fetch("/api/auth/sign-in", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
}

export async function getMe() {
  return await fetch("/api/user/me", {
    method: "GET",
    credentials: "include",
  });
}

export async function getUser(userId: string) {
  return await fetch(`/api/user/${userId}`, {
    method: "GET",
    credentials: "include",
  });
}

export async function getParticipant(
  eventId: string,
  participantUserId: string
) {
  return await fetch(`/api/event/${eventId}/participant/${participantUserId}`, {
    method: "GET",
    credentials: "include",
  });
}

export async function logOut() {
  return await fetch("/api/auth/log-out", {
    method: "GET",
    credentials: "include",
  });
}

export async function createEvent(eventForm: FormData) {
  return await fetch("/api/event", {
    method: "POST",
    credentials: "include",
    body: eventForm,
  });
}

export async function getEvent(eventIdOrSlug: string) {
  return await fetch(`/api/event/${eventIdOrSlug}`, {
    method: "GET",
    credentials: "include",
  });
}

export async function updateProfile(profileForm: FormData) {
  return await fetch("/api/user/profile", {
    method: "PUT",
    credentials: "include",
    body: profileForm,
  });
}
