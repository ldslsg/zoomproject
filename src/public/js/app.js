const ul = document.querySelector("ul");
const nickform = document.querySelector("#nick");
const messageform = document.querySelector("#message");

const socket = new WebSocket(`wss://${window.location.host}`);

function makeMessage(type, payload) {
    const msg = { type, payload};
    return JSON.stringify(msg);
}

function handleOpen() {
    console.log("Connected to Server");
}
socket.addEventListener("open", handleOpen);

socket.addEventListener("message", (message) => {
    if (message.data instanceof Blob) {
        const reader = new FileReader();
        reader.onload = function() {
            const li = document.createElement("li");
            li.innerText = reader.result;
            ul.append(li);
        };
        reader.readAsText(message.data);
    } else {
        const li = document.createElement("li");
        li.innerText = message.data;
        ul.append(li);
    }
});

socket.addEventListener("close", () => {
    console.log("Disconnected from the Browser");
});

function handleSubmit(event){
    event.preventDefault();
    const input = messageform.querySelector("input");
    socket.send(makeMessage("new_message", input.value));
    const li = document.createElement("li");
    li.innerText = `You: ${input.value}`;
    messageList.append(li);
    input.value = "";
}

function handleNickSubmit(event){
    event.preventDefault();
    const input = nickform.querySelector("input");
    socket.send(makeMessage("nickname", input.value));
    input.value="";
}

messageform.addEventListener("submit", handleSubmit);
nickform.addEventListener("submit", handleNickSubmit);

