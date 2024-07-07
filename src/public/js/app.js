const socket = io();

const welcome = document.getElementById("welcome")
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

function addMessage(message){
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = message;
    ul.appendChild(li);
}

function handleMessageSubmit(event){
    event.preventDefault();
    const input = room.querySelector("input");
    const message = input.value;
    socket.emit("new_message", message, roomName, () => {addMessage(`You: ${message}`);
        input.value=""});
}

function showRoom() {
    if (!room) {
        console.error("Room element not found in the DOM.");
        return;
    }

    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    if (h3) {
        h3.innerText = `Room ${roomName}`;
    } else {
        console.error("h3 element not found in the room.");
    }
    const messageForm = room.querySelector("form");
    messageForm.addEventListener("submit", handleMessageSubmit);
}

function handleRoomSubmit(event){
    event.preventDefault();
    const input = form.querySelector("input");
    roomName = input.value;
    socket.emit("enter_room", roomName, showRoom);
    input.value = "";
}
form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (user) => {
    addMessage(`${user} joined the room!`);
});

socket.on("bye", (user) => {
    addMessage(`${user}Someone left ㅠㅠ`);
});

socket.on("new_message", addMessage);