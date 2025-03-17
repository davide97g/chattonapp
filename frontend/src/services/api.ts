import { Message } from "@/types";

const BASE_URL = "http://localhost:3000";

export async function readMessages() {
  return fetch(`${BASE_URL}/chat/messages`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json() as Promise<Message[]>);
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
  return (await res.json()) as Message;
}

export async function readMessage(id: number, user: string) {
  return fetch(`${BASE_URL}/chat/message/${id}/?user=${user}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json() as Promise<Message>);
}
