let io;

export function setupSocket(serverIO) {
  io = serverIO;

  io.on("connection", (socket) => {
    console.log("client", socket.id, "connected");

    socket.on("disconnect", () => {
      console.log("client", socket.id, "disconnected");
    });
  });
}

/* We expose a getter so routes/controllers can emit events */
export const getIO = () => io;
