import GroupChat from "./Chat";
import { AuthProvider } from "./context/Auth/AuthProvider";
import { SocketProvider } from "./context/Socket/SocketProvider";

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <GroupChat />
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
