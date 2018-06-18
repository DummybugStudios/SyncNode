const websocket = require('ws');
const express = require('express');

const HTTP_PORT = 1230;
const WS_PORT   = 1231;

const httpServer = express();
const wsServer  = new websocket.Server({
    port: WS_PORT,
    clientTracking: true
});


var songQueue = [];

function broadcast(message){
    for (var it = wsServer.clients.values(); client = null; client=it.next().value){
        client.send(message);
    }
};

function playMusic(message){
    songQueue.push(message['url'])
    broadcast(message)
}
/*
Message has to contain url of the music
to be played (url)
{
    action: auth/play/pause/resume/skip
}
auth needs a value called "username"
play needs a value called "url" which is the url to play
*/
function handleIncomingMessage(rawMessage){
    var message = JSON.parse(rawMessage);
    if (message['type'] === "play")
        playMusic(message);
}

wsServer.on('connection', function(client, request){
    client.on("message", handleIncomingMessage);
    console.log("A new person has joined");
});

wsServer.on("listening", () => console.log("websocket server listening on port "+ WS_PORT))
httpServer.listen(HTTP_PORT, () => console.log("http server listening on port "+HTTP_PORT))