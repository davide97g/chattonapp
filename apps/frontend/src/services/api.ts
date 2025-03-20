import { IMessage, IUserChat } from "@chattonapp/types";

const BASE_URL = import.meta.env.VITE_SERVER_URL;

export async function getMessages({ token }: { token: string }) {
  return fetch(`${BASE_URL}/chat/messages`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json() as Promise<IMessage[]>);
}

export async function sendMessage({
  message,
  sender,
  replyTo,
  token,
}: {
  message: string;
  sender: string;
  replyTo?: string;
  token: string;
}) {
  const res = await fetch(`${BASE_URL}/chat/message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ text: message, replyTo, sender }),
  });
  return (await res.json()) as IMessage;
}

export async function getChatInfo({ token }: { token: string }) {
  return fetch(`${BASE_URL}/chat/info`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json() as Promise<{ users: IUserChat[] }>);
}

export async function updateLastReadTime({ token }: { token: string }) {
  return fetch(`${BASE_URL}/chat/lastRead`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json() as Promise<{ success: boolean }>);
}

export async function clearChatHistory({ token }: { token: string }) {
  return fetch(`${BASE_URL}/chat/clear`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json() as Promise<{ success: boolean }>);
}

// *** AUTH

export async function registerUser({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
  return res.json();
}

export async function loginUser({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
  return res.json();
}

export async function getUserInfo({ token }: { token: string }) {
  const res = await fetch(`${BASE_URL}/auth/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}
