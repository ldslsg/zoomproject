import http from "http";
import {WebSocketServer} from "ws";
import express from "express";
import path from "path";
import WebSocket from "ws";

const app = express();

app.set('view engine', "pug")
app.set("views", path.join(__dirname, "/views"));
app.use("/public", express.static(path.join(__dirname, "/public")));
app.get("/",(req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log('Listening on http://localhost:3000');

const server = http.createServer(app);
const wss = new WebSocketServer({server});

function onSocketClose() {
    console.log("Disconnected from the Browser");
}

const sockets = [];

wss.on("connection", (socket) => {
    socket["nickname"] = "Anon";
    console.log("Connected to Browser");
    socket.on("close", onSocketClose);
    socket.on("message", (msg) => {
        const parsed = JSON.parse(msg);
        switch(parsed.type){
            case "new_message":
                wss.clients.forEach(client => {if(client.readyState === WebSocket.OPEN) {client.send(`${socket.nickname}: ${parsed.payload}`);}});
                break;
            case "nickname":
                socket["nickname"] = parsed.payload;
                break;
        }     
    });
});

server.listen(3000, handleListen);