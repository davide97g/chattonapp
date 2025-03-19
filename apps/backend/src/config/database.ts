import { IMessage, IUser, IUserChat } from "@chattonapp/types";
import { readdirSync, readFileSync, writeFile } from "fs";

const DATA_PATH = "../../data";

// if the data folder does not exist, create it
if (!readdirSync("..").includes("data")) {
  writeFile(DATA_PATH, "", () => {});
}

// if the users file does not exist, create it
if (!readdirSync(DATA_PATH).includes("users.json")) {
  writeFile(`${DATA_PATH}/users.json`, JSON.stringify({ users: [] }), () => {});
}
// if the chat file does not exist, create it
if (!readdirSync(DATA_PATH).includes("chat.json")) {
  writeFile(
    `${DATA_PATH}/chat.json`,
    JSON.stringify({ messages: [], users: [] }),
    () => {},
  );
}

// *** DATA ***

export const users: IUser[] = JSON.parse(
  readFileSync(`${DATA_PATH}/users.json`, "utf-8"),
).users;
export const chat: { messages: IMessage[]; users: IUserChat[] } = JSON.parse(
  readFileSync(`${DATA_PATH}/chat.json`, "utf-8"),
);

// *** FUNCTIONS ***

export function updateUsersFile({ users }: { users: IUser[] }) {
  writeFile(DATA_PATH, JSON.stringify({ users }), () => {});
}

export function updateChatMessagesFile({
  chat,
}: {
  chat: { messages: IMessage[]; users: IUserChat[] };
}) {
  writeFile(DATA_PATH, JSON.stringify(chat), () => {});
}
