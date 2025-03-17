"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IMessage } from "@chattonapp/types";
import { useEffect, useRef, useState } from "react";
import { readMessages, sendMessage } from "./services/api";
import {
  formatTime,
  generateUsername,
  getInitials,
  getUserColor,
} from "./services/utils";

export default function GroupChat() {
  // Get or create username from localStorage
  const [username, setUsername] = useState<string>("");
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [input, setInput] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  console.info("ciao");

  // Initialize username
  useEffect(() => {
    // Get username from localStorage or generate a new one
    const storedUsername = localStorage.getItem("chat-username");
    const newUsername = storedUsername || generateUsername();
    if (!storedUsername) {
      localStorage.setItem("chat-username", newUsername);
    }
    setUsername(newUsername);

    // Load messages from localStorage
    const storedMessages = localStorage.getItem("chat-messages");
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    } else {
      // Initial welcome messages if no stored messages
      const initialMessages: IMessage[] = [
        {
          id: "1",
          content: "Welcome to the group chat!",
          sender: "System",
          timestamp: Date.now() - 1000 * 60 * 5, // 5 minutes ago
        },
      ];
      setMessages(initialMessages);
      localStorage.setItem("chat-messages", JSON.stringify(initialMessages));
    }

    // Announce joining the chat
    const joinMessage: IMessage = {
      id: Date.now().toString(),
      content: `${newUsername} has joined the chat`,
      sender: "System",
      timestamp: Date.now(),
    };

    setMessages((prevMessages) => {
      const updatedMessages = [...(prevMessages ?? []), joinMessage];
      localStorage.setItem("chat-messages", JSON.stringify(updatedMessages));
      return updatedMessages;
    });
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  useEffect(() => {
    readMessages().then((data) => {
      setMessages(data);
      localStorage.setItem("chat-messages", JSON.stringify(data));
    });
  }, []);

  // Handle sending a new message
  const handleSendMessage = () => {
    if (input.trim() === "") return;

    sendMessage({
      message: input,
      sender: username,
    })
      .then((data) => {
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages, data];
          localStorage.setItem(
            "chat-messages",
            JSON.stringify(updatedMessages)
          );
          return updatedMessages;
        });
      })
      .finally(() => setInput(""));
  };

  // Clear chat history
  const clearChat = () => {
    const confirmClear = window.confirm(
      "Are you sure you want to clear the chat history?"
    );
    if (confirmClear) {
      const systemMessage: IMessage = {
        id: Date.now().toString(),
        content: "Chat history has been cleared",
        sender: "System",
        timestamp: Date.now(),
      };

      setMessages([systemMessage]);
      localStorage.setItem("chat-messages", JSON.stringify([systemMessage]));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle>Group Chat</CardTitle>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={clearChat}>
                Clear Chat
              </Button>
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className={getUserColor(username)}>
                    {getInitials(username)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{username}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[60vh]" ref={scrollAreaRef}>
            <div className="p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === username
                      ? "justify-end"
                      : "justify-start"
                  } ${message.sender === "System" ? "justify-center" : ""}`}
                >
                  {message.sender === "System" ? (
                    <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {message.content}
                    </div>
                  ) : (
                    <div className="flex items-start max-w-[80%] space-x-2">
                      {message.sender !== username && (
                        <Avatar className="h-8 w-8 mt-1">
                          <AvatarFallback
                            className={getUserColor(message.sender)}
                          >
                            {getInitials(message.sender)}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div>
                        {message.sender !== username && (
                          <div className="text-xs text-gray-500 mb-1">
                            {message.sender}
                          </div>
                        )}
                        <div className="flex items-end space-x-1">
                          <div
                            className={`p-3 rounded-lg ${
                              message.sender === username
                                ? "bg-primary text-primary-foreground"
                                : "bg-gray-200 text-gray-800"
                            }`}
                          >
                            {message.content}
                          </div>
                          <span className="text-xs text-gray-500">
                            {formatTime(message.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="border-t p-3">
          <div className="flex w-full space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
            />
            <Button variant="outline" color="black" onClick={handleSendMessage}>
              Send
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
