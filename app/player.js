const Speaker = require('speaker')
const speakers = new Speaker()

const ytdl    = require('ytdl-core')
const ffmpeg = require('fluent-ffmpeg')
const ws = require("ws")

const WS_PORT = 1231
const WS_HOST = "localhost"

const WS_URL = "ws://"+WS_HOST+":"+WS_PORT.toString()


const urlInput = document.getElementById("music-url")
const currentTitle = document.getElementById("current-title")

// connect to websocket on startup

const wsConnection = new WebSocket(WS_URL)

wsConnection.onopen =  function open (){
    console.log("websocket connection alive now") 
}

wsConnection.onmessage =  function incoming(data){
    parsedData = JSON.parse(data.data)
    console.log(parsedData)
    switch (parsedData.type) {
        case "play":
            playMusic(parsedData.url)
            break;
    }
}

// function accessed by user when they press the play button
function submitSong(){
    if (wsConnection.readyState === ws.OPEN){
        message = {
            type: "play",
            url: urlInput.value
        }
        messageString = JSON.stringify(message)
        wsConnection.send(messageString)
    }else{
        alert("connection not open")
    }
}

function playMusic(url){
    audioInfo = ytdl.getInfo(url).then((result) =>{
        currentTitle.innerHTML = result.title
    })
    audioStream = ytdl(url, {
        quality: "highestaudio",
        filter:"audioonly"
    })

    ffmpeg(audioStream)
        .format("wav")
        .pipe(speakers)
}

module.exports={submitSong}