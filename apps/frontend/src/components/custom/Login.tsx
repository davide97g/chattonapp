import { useAuth } from "@/context/Auth/useAuth";
import { registerUser } from "@/services/api";
import { useRef, useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export function Login() {
  const { token, login } = useAuth();

  // State for username modal
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState<string>("");

  const usernameInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  if (token) return null;

  const handleUserRegistration = () => {
    registerUser({
      username: usernameInput,
      password: passwordInput,
    });
  };

  const handleLogin = () => {
    // Handle user login
    login({
      username: usernameInput,
      password: passwordInput,
    });
  };

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        // Prevent closing the dialog if no username is set
        if (!open && !usernameInput) {
          return;
        }
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
                }}
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              Password
            </Label>
            <div className="col-span-3">
              <Input
                id="password"
                type="password"
                ref={passwordInputRef}
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                }}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleUserRegistration}
            variant="secondary"
            disabled={!usernameInput || !passwordInput}
          >
            Register
          </Button>
          <Button
            onClick={handleLogin}
            disabled={!usernameInput || !passwordInput}
          >
            Login
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
