const socket = new WebSocket("ws://localhost:3000/ws-chat");

socket.onopen = () => {
  console.log("Connected to WebSocket server");
  socket.send(
    JSON.stringify({
      event: "newMessage",
      message: {
        content: "Hello from the client!",
        sender: "Client",
      },
    })
  );
};

socket.onmessage = (event: any) => {
  const data = JSON.parse(event.data);
  console.log("Received data:", data);
  if (data.event === "newMessage") {
    console.log("New message received:", data.message);
  }
};

socket.onclose = () => {
  console.log("WebSocket connection closed");
};

socket.onerror = (error: any) => {
  console.error("WebSocket error:", error);
};
