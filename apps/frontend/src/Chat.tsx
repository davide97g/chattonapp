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

import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./components/ui/dialog";
import { Label } from "./components/ui/label";
import { useSocket } from "./context/SocketProvider";
import { clearChatHistory, sendMessage } from "./services/api";
import {
  formatTime,
  generateUsername,
  getInitials,
  getUserColor,
} from "./services/utils";

export default function GroupChat() {
  // State for username modal
  const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [usernameSuggestion, setUsernameSuggestion] = useState("");
  const [usernameError, setUsernameError] = useState("");
  // Get or create username from localStorage
  const [username, setUsername] = useState<string>("");
  const { messages } = useSocket();
  const [input, setInput] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const usernameInputRef = useRef<HTMLInputElement>(null);

  // Check for username on initial load
  useEffect(() => {
    const storedUsername = localStorage.getItem("chat-username");

    if (!storedUsername) {
      // Generate a username suggestion
      const suggestion = generateUsername();
      setUsernameSuggestion(suggestion);
      setUsernameInput(suggestion);
      setIsUsernameModalOpen(true);
    } else {
      setUsername(storedUsername);
    }
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

  // Handle sending a new message
  const handleSendMessage = () => {
    if (input.trim() === "") return;
    sendMessage({
      message: input,
      sender: username,
    }).finally(() => setInput(""));
  };

  // Clear chat history
  const clearChat = () => {
    const confirmClear = window.confirm(
      "Are you sure you want to clear the chat history?"
    );
    if (confirmClear) {
      clearChatHistory();
    }
  };

  // Handle username submission
  const handleUsernameSubmit = () => {
    if (!usernameInput.trim()) {
      setUsernameError("Please enter a username");
      return;
    }

    setUsernameError("");
    const newUsername = usernameInput.trim();
    localStorage.setItem("chat-username", newUsername);
    setUsername(newUsername);
    setIsUsernameModalOpen(false);
    // Announce joining the chat
    sendMessage({
      message: `${newUsername} has joined the chat`,
      sender: "System",
    });
  };

  return (
    <>
      {/* Username Modal */}
      <Dialog
        open={isUsernameModalOpen}
        onOpenChange={(open) => {
          // Prevent closing the dialog if no username is set
          if (!open && !username) {
            return;
          }
          setIsUsernameModalOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enter your username</DialogTitle>
            <DialogDescription>
              Choose a username to identify yourself in the chat.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <div className="col-span-3">
                <Input
                  id="username"
                  ref={usernameInputRef}
                  value={usernameInput}
                  onChange={(e) => {
                    setUsernameInput(e.target.value);
                    setUsernameError("");
                  }}
                  placeholder={usernameSuggestion}
                  className={usernameError ? "border-red-500" : ""}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUsernameSubmit();
                    }
                  }}
                />
                {usernameError && (
                  <p className="text-red-500 text-sm mt-1">{usernameError}</p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleUsernameSubmit}>
              Join Chat
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
              <Button
                variant="outline"
                color="black"
                onClick={handleSendMessage}
              >
                Send
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
