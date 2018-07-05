const Speaker = require('speaker')
const speakers = new Speaker()

const ytdl    = require('ytdl-core')
const ffmpeg = require('fluent-ffmpeg')
const ws = require("ws")
const fs = require("fs")

var started;
var musicReadFile;
var paused = false; 

const WS_PORT = 1231
const WS_HOST = "localhost"

const WS_URL = "ws://"+WS_HOST+":"+WS_PORT.toString()

var audioStream;


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
            clientPlayMusic(parsedData.url)
            break;
        case "pause":
            clientPauseMusic()
            break;
        case "resume":
            clientResumeMusic()
            break;
    }
}

// function accessed by user when they press the play button
function playSong(){
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

function pauseSong(){
    if(wsConnection.readyState === ws.OPEN){
        message = {
            type: 'pause'
        }
        wsConnection.send(JSON.stringify(message))

    }else{
        alert("Not connected to server")
    }
}

function resumeSong(){
    if(wsConnection.readyState === ws.OPEN){
        message = {
            type: 'resume'
        }
        wsConnection.send(JSON.stringify(message))

    }else{
        alert("Not connected to server")
    }
}

function clientPlayMusic(url){
    audioInfo = ytdl.getInfo(url).then((result) =>{
        currentTitle.innerHTML = result.title
    })

    var musicWriteFile =fs.createWriteStream("./music")

    audioStream = ytdl(url ,{filter:"audioonly"})

    ffmpeg(audioStream)
        .format("wav")
        .pipe(musicWriteFile)


    audioStream.on("response", function(){
        console.log("download started")
    })

    playing = false
    // TODO: instead of using downloaded length use the length converted by ffmpeg
    audioStream.on('progress', function(length, download, total){
        // TODO: change buffer from 5% of the whole video to ≈10s to improve large videos
        if (!playing && download/total > 0.1){
            musicReadFile = fs.createReadStream("./music")
            musicReadFile.pipe(speakers)
            playing = true
        }
    })
}

function clientPauseMusic(){
    //FIXME: buffer underflow issue with speaker (destroy speaker?)
    if (!paused){
        musicReadFile.unpipe()
        paused = true;
    }
}

function clientResumeMusic(){
    if (paused){
        musicReadFile.pipe(speakers)
        paused = false
    }
}

module.exports={
    resumeSong,
    pauseSong,
    playSong
}