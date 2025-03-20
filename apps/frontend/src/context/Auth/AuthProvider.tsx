import { Login } from "@/components/custom/Login";
import { loginUser } from "@/services/api";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./auth.context";
import { extractInfoFromToken } from "./utils";

export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("chattonapp-token")
  );

  const user = useMemo(() => extractInfoFromToken(token), [token]);

  const login = ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    loginUser({
      username,
      password,
    }).then((res) => {
      const { token } = res;
      setToken(token);
      localStorage.setItem("chattonapp-token", token);
    });
  };

  const logout = useCallback(() => {
    setToken(null);
    localStorage.removeItem("chattonapp-token");
    window.location.reload();
  }, []);

  useEffect(() => {
    const tokenInfo = extractInfoFromToken(token);
    if (tokenInfo) {
      const now = Date.now().valueOf() / 1000;
      if (now >= tokenInfo.exp) {
        logout();
      }
    }
  }, [token, logout]);

  const value = useMemo(
    () => ({
      token,
      user,
      login,
      logout,
    }),
    [logout, token, user]
  );

  return (
    <AuthContext.Provider value={value}>
      {token ? children : <Login />}
    </AuthContext.Provider>
  );
}
