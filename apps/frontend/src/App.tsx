import GroupChat from "./Chat";
import { SocketProvider } from "./context/SocketProvider";

function App() {
  return (
    <SocketProvider>
      <GroupChat />
    </SocketProvider>
  );
}

export default App;
