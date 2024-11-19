import express from "express";
import { createServer } from "http";
import path from "path";
import { Server } from "socket.io";
import { fileURLToPath } from "url";

const app = express();
const server = createServer(app);
const io = new Server(server);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  socket.on("send-Location", (data) => {
    console.log("Location received", data.latitude, data.longitude);
    io.emit("receive-Location", { id: socket.id, ...data }); // send the location to all connected clients including the sender itself and the sender's id is also sent
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    io.emit("user-disconnected", socket.id);
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
