import { IMessage } from "@chattonapp/types";

const BASE_URL = import.meta.env.VITE_SERVER_URL;

export async function readMessages() {
  return fetch(`${BASE_URL}/chat/messages`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json() as Promise<IMessage[]>);
}

export async function sendMessage({
  message,
  sender,
}: {
  message: string;
  sender: string;
}) {
  const res = await fetch(`${BASE_URL}/chat/message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: message, sender }),
  });
  return (await res.json()) as IMessage;
}

export async function readMessage(id: number, user: string) {
  return fetch(`${BASE_URL}/chat/message/${id}/?user=${user}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json() as Promise<IMessage>);
}

export async function clearChatHistory() {
  return fetch(`${BASE_URL}/chat/clear`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json() as Promise<{ success: boolean }>);
}
