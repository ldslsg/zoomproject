import http from "http";
import express from "express";
import path from "path";
import {Server as SocketIOServer} from "socket.io";


const app = express()


app.set('view engine', "pug")
app.set("views", path.join(__dirname, "/views"));
app.use("/public", express.static(path.join(__dirname, "/public")));
app.get("/",(req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const httpServer = http.createServer(app);
const io = new SocketIOServer(httpServer);


httpServer.listen(3000, () => {
    console.log('Listening on http://localhost:3000');
});

io.on('connection', (socket) => {
    socket.onAny((event) => {
        console.log(`Socket Event: ${event}`);
    });
    socket.on("enter_room", (roomName, done) => {
        socket.join(roomName);
        done();
        socket.to(roomName).emit("Welcome", socket.id);
    });

    socket.on('disconnecting', () => {
        socket.rooms.forEach(room => socket.to(room).emit("bye", socket.id));
        console.log('User disconnected');
    });

    socket.on('new_message', (msg, room, done) => {
        socket.to(room).emit("new_message", `${socket.id}: ${msg}`);
        done();
    });

    socket.on('nickname', (nickname) => {
        socket.nickname = nickname;
        console.log(`User set nickname to: ${nickname}`);
    });
});



