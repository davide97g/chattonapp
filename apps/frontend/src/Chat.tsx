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
import { Separator } from "./components/ui/separator";

import { useAuth } from "./context/Auth/useAuth";
import { useSocket } from "./context/Socket/useSocket";
import { clearChatHistory, sendMessage } from "./services/api";
import {
  commonEmojis,
  formatTime,
  getInitials,
  getUserColor,
  isEmojiOnly,
} from "./services/utils";

export default function GroupChat() {
  const { token, user, logout } = useAuth();
  const { messages, setMessages, onUserTyping, typingUsernameList } =
    useSocket();
  const [input, setInput] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
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
    if (token && user?.username)
      sendMessage({
        message: input,
        sender: user.username,
        token,
      }).finally(() => setInput(""));
  };

  // Clear chat history
  const clearChat = () => {
    const confirmClear = window.confirm(
      "Are you sure you want to clear the chat history?"
    );
    if (confirmClear) {
      if (token) clearChatHistory({ token });
    }
  };

  const lastMessageRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1, rootMargin: "-50px" } // Adjust threshold for sensitivity
    );

    if (lastMessageRef.current) {
      observer.observe(lastMessageRef.current);
    }

    return () => {
      if (lastMessageRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(lastMessageRef.current);
      }
    };
  }, [lastMessageRef]);

  useEffect(() => {
    const hasUnreadMessages = messages.some((m) => !m.read);

    if (isVisible && hasUnreadMessages) {
      console.log("Last message is visible");
    }
  }, [isVisible, messages, setMessages, token]);

  const renderMessageContent = (content: string) => {
    const isOnlyEmojis = isEmojiOnly(content);

    if (isOnlyEmojis) {
      return <div className="text-3xl md:text-4xl">{content}</div>;
    }

    return <div>{content}</div>;
  };

  // Handle emoji selection
  const handleEmojiClick = (emoji: string) => {
    setInput((prev) => prev + emoji);
    // Focus back on input after emoji selection
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <Card className="w-full max-w-3xl">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle>Group Chat</CardTitle>
              <div className="flex items-center space-x-4">
                <Button size="sm" onClick={clearChat}>
                  Clear Chat
                </Button>
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className={getUserColor(user?.username)}>
                      {getInitials(user?.username)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{user?.username}</span>
                  <Button variant="destructive" size="sm" onClick={logout}>
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[60vh]" ref={scrollAreaRef}>
              <div className="p-4 space-y-4">
                {messages
                  .filter((message) => message.content.trim() !== "")
                  .map((message, index) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender === user?.username
                          ? "justify-end"
                          : "justify-start"
                      } ${message.sender === "System" ? "justify-center" : ""}`}
                      id={`message-${index}`}
                    >
                      {message.sender === "System" ? (
                        <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          {message.content}
                        </div>
                      ) : (
                        <div className="flex items-start max-w-[80%] space-x-2">
                          {message.sender !== user?.username && (
                            <Avatar className="h-8 w-8 mt-1">
                              <AvatarFallback
                                className={getUserColor(message.sender)}
                              >
                                {getInitials(message.sender)}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div>
                            {message.sender !== user?.username && (
                              <div className="text-xs text-gray-500 mb-1">
                                {message.sender}
                              </div>
                            )}
                            <div className="flex items-end space-x-1">
                              <div
                                className={`p-3 rounded-lg ${
                                  message.sender === user?.username
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-gray-200 text-gray-800"
                                }`}
                              >
                                {renderMessageContent(message.content)}
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
                {/* Typing indicators */}
                {typingUsernameList.length > 0 && (
                  <div className="flex items-start space-x-2 animate-fade-in">
                    {typingUsernameList.length === 1 ? (
                      <>
                        <Avatar className="h-8 w-8 mt-1">
                          <AvatarFallback
                            className={getUserColor(typingUsernameList[0])}
                          >
                            {getInitials(typingUsernameList[0])}
                          </AvatarFallback>
                        </Avatar>
                        <div className="bg-gray-100 px-4 py-2 rounded-lg flex items-center space-x-1">
                          <span className="text-sm text-gray-500">
                            {typingUsernameList[0]} is typing
                          </span>
                          <span className="flex space-x-1">
                            <span className="typing-dot bg-gray-400"></span>
                            <span className="typing-dot bg-gray-400 animation-delay-200"></span>
                            <span className="typing-dot bg-gray-400 animation-delay-400"></span>
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="bg-gray-100 px-4 py-2 rounded-lg flex items-center space-x-1">
                        <span className="text-sm text-gray-500">
                          {typingUsernameList.length} people are typing
                        </span>
                        <span className="flex space-x-1">
                          <span className="typing-dot bg-gray-400"></span>
                          <span className="typing-dot bg-gray-400 animation-delay-200"></span>
                          <span className="typing-dot bg-gray-400 animation-delay-400"></span>
                        </span>
                      </div>
                    )}
                  </div>
                )}
                <div id="bottom" ref={lastMessageRef}></div>
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="border-t p-3">
            <div className="flex w-full space-x-2 flex-col">
              <div className="flex w-full space-x-2">
                <Input
                  value={input}
                  ref={inputRef}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-grow"
                  onKeyDown={(e) => {
                    console.info(e.key);
                    if (user?.username) onUserTyping(user?.username);
                    if (e.key === "Enter") {
                      handleSendMessage();
                    }
                  }}
                />
                <Button color="black" onClick={handleSendMessage}>
                  Send
                </Button>
              </div>
              <div className="w-full">
                <Separator className="my-2" />
                <div className="text-xs text-gray-500 mb-2">Quick Emoji</div>
                <div className="w-full overflow-x-auto">
                  <div className="flex space-x-2 pb-2">
                    {commonEmojis.map((emoji, index) => (
                      <button
                        key={index}
                        onClick={() => handleEmojiClick(emoji)}
                        className="text-2xl hover:bg-gray-100 p-2 rounded-full transition-colors"
                        aria-label={`Emoji ${emoji}`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
      {/* CSS for typing animation */}
      <style>{`
        @keyframes typingAnimation {
          0% {
            opacity: 0.3;
            transform: translateY(0px);
          }
          50% {
            opacity: 1;
            transform: translateY(-2px);
          }
          100% {
            opacity: 0.3;
            transform: translateY(0px);
          }
        }

        .typing-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          display: inline-block;
          animation: typingAnimation 1s infinite ease-in-out;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </>
  );
}
