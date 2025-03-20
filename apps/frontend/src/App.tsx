import GroupChat from "./Chat";
import { AuthProvider } from "./context/Auth/AuthProvider";
import { SocketProvider } from "./context/Socket/SocketProvider";
import { ThemeProvider } from "./context/ThemeProvider";

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <ThemeProvider defaultTheme="light" storageKey="chat-theme">
          <GroupChat />
        </ThemeProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
