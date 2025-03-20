import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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

import { TouchEvent } from "react";

import { IMessage } from "@chattonapp/types";
import { Copy, MoreHorizontal, Reply, SendIcon, Trash } from "lucide-react";
import { UserPreferencesModal } from "./components/custom/Profile";
import { Button } from "./components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";
import { useAuth } from "./context/Auth/useAuth";
import { useSocket } from "./context/Socket/useSocket";
import { sendMessage } from "./services/api";
import {
  commonEmojis,
  formatTime,
  getInitials,
  getUserColor,
  isEmojiOnly,
  truncateText,
} from "./services/utils";

export default function GroupChat() {
  const { token, user } = useAuth();
  const {
    messages,
    setMessages,
    onUserTyping,
    typingUsernameList: typingIndicators,
  } = useSocket();
  const [input, setInput] = useState("");

  // Reply state
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

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
        replyTo: replyingTo ?? undefined,
        token,
      }).finally(() => {
        setInput("");
        setReplyingTo(null);
      });
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

  // Handle reply to message
  const handleReply = (messageId: string) => {
    setReplyingTo(messageId);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Handle copy message
  const handleCopyMessage = (content: string) => {
    navigator.clipboard
      .writeText(content)
      .then(() => {
        // Could show a toast notification here
        console.log("Message copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy message: ", err);
      });
  };

  // Handle delete message (only for user's own messages)
  const handleDeleteMessage = (messageId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this message?"
    );
    if (confirmDelete) {
      const updatedMessages = messages.filter((msg) => msg.id !== messageId);
      // Also update any replies to this message
      updatedMessages.forEach((msg) => {
        if (msg.replyTo === messageId) {
          msg.replyTo = undefined;
        }
      });
      setMessages(updatedMessages);
    }
  };

  // Find a message by ID
  const findMessageById = (id: string): IMessage | undefined => {
    return messages.find((msg) => msg.id === id);
  };

  // Handle touch start for swipe detection
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    setTouchStartX(e.touches[0].clientX);
  };

  // Handle touch end for swipe detection
  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>, messageId: string) => {
    if (touchStartX === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartX;

    // If swiped right more than 50px, trigger reply
    if (deltaX > 50) {
      handleReply(messageId);
    }

    setTouchStartX(null);
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <Card className="w-full max-w-3xl gap-0">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle>Chattonapp</CardTitle>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <UserPreferencesModal />
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
                    className={`flex ${message.sender === user?.username ? "justify-end" : "justify-start"}`}
                    style={{
                      ...(message.sender === "System" && {
                        justifyContent: "center",
                      }),
                    }}
                  >
                    {message.sender === "System" ? (
                      <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {message.content}
                      </div>
                    ) : (
                      <div
                        className="flex items-start max-w-[80%] space-x-2 group"
                        onTouchStart={handleTouchStart}
                        onTouchEnd={(e) => handleTouchEnd(e, message.id)}
                      >
                        {message.sender !== user?.username && (
                          <Avatar className="h-8 w-8 mt-1">
                            <AvatarFallback
                              className={getUserColor(message.sender)}
                            >
                              {getInitials(message.sender)}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="relative">
                          {message.sender !== user?.username && (
                            <div className="text-xs text-gray-500 mb-1">
                              {message.sender}
                            </div>
                          )}

                          {/* Reply indicator */}
                          {message.replyTo && (
                            <div className="bg-gray-100 rounded p-2 mb-1 text-xs text-gray-600 border-l-2 border-gray-300">
                              <div className="font-medium">
                                Replying to{" "}
                                {findMessageById(message.replyTo)?.sender ||
                                  "deleted message"}
                              </div>
                              <div className="truncate">
                                {findMessageById(message.replyTo)
                                  ? truncateText(
                                      findMessageById(message.replyTo)!.content
                                    )
                                  : "This message was deleted"}
                              </div>
                            </div>
                          )}

                          <div className="flex items-end space-x-1">
                            <div
                              className={`p-3 rounded-lg relative ${
                                message.sender === user?.username
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-gray-200 text-gray-800"
                              }`}
                            >
                              {renderMessageContent(message.content)}

                              {/* Message actions on hover */}
                              <div
                                className={`absolute ${message.sender === user?.username ? "left-0 -translate-x-full" : "right-0 translate-x-full"} top-0 hidden group-hover:flex items-center space-x-1 p-1`}
                              >
                                <button
                                  onClick={() => handleReply(message.id)}
                                  className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                                  aria-label="Reply to message"
                                >
                                  <Reply
                                    className="h-4 w-4 text-gray-600"
                                    style={{
                                      ...(message.sender === user?.username && {
                                        transform: "scale(-1, 1)",
                                      }),
                                    }}
                                  />
                                </button>

                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <button className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                                      <MoreHorizontal className="h-4 w-4 text-gray-600" />
                                    </button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="center">
                                    <DropdownMenuItem
                                      onClick={() => handleReply(message.id)}
                                    >
                                      <Reply className="h-4 w-4 mr-2" />
                                      <span>Reply</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleCopyMessage(message.content)
                                      }
                                    >
                                      <Copy className="h-4 w-4 mr-2" />
                                      <span>Copy</span>
                                    </DropdownMenuItem>
                                    {message.sender === user?.username && (
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleDeleteMessage(message.id)
                                        }
                                        className="text-red-500 focus:text-red-500"
                                      >
                                        <Trash className="h-4 w-4 mr-2" />
                                        <span>Delete</span>
                                      </DropdownMenuItem>
                                    )}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
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
                {typingIndicators.length > 0 && (
                  <div className="flex items-start space-x-2 animate-fade-in">
                    {typingIndicators.length === 1 ? (
                      <>
                        <Avatar className="h-8 w-8 mt-1">
                          <AvatarFallback
                            className={getUserColor(typingIndicators[0])}
                          >
                            {getInitials(typingIndicators[0])}
                          </AvatarFallback>
                        </Avatar>
                        <div className="bg-gray-100 px-4 py-2 rounded-lg flex items-center space-x-1">
                          <span className="text-sm text-gray-500">
                            {typingIndicators[0]} is typing
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
                          {typingIndicators.length} people are typing
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
              </div>
            </ScrollArea>
          </CardContent>

          {/* Reply indicator */}
          {replyingTo && (
            <div className="px-4 py-2 bg-gray-50 border-t border-b flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Reply className="h-4 w-4 text-gray-500" />
                <div className="text-sm">
                  <span className="text-gray-500">Replying to </span>
                  <span className="font-medium">
                    {findMessageById(replyingTo)?.sender}
                  </span>
                  <span className="text-gray-500">: </span>
                  <span className="text-gray-600">
                    {findMessageById(replyingTo)
                      ? truncateText(findMessageById(replyingTo)!.content, 50)
                      : "This message was deleted"}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setReplyingTo(null)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Cancel reply"
              >
                &times;
              </button>
            </div>
          )}
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
                    if (user?.username) onUserTyping(user?.username);
                    if (e.key === "Enter") {
                      handleSendMessage();
                    }
                  }}
                />
                <Button onClick={handleSendMessage}>
                  <SendIcon />
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
          0% { opacity: 0.3; transform: translateY(0px); }
          50% { opacity: 1; transform: translateY(-2px); }
          100% { opacity: 0.3; transform: translateY(0px); }
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
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }
        
        /* Swipe hint animation */
        @keyframes swipeHint {
          0% { transform: translateX(0); }
          25% { transform: translateX(10px); }
          50% { transform: translateX(0); }
          75% { transform: translateX(10px); }
          100% { transform: translateX(0); }
        }
        
        .swipe-hint {
          animation: swipeHint 2s ease-in-out;
        }
      `}</style>
    </>
  );
}
