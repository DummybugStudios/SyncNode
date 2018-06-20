const ytdl    = require('ytdl-core')
const Speaker = require('speaker')
const lame    = require('lame')
const decoder  = lame.Decoder
const speaker = new Speaker()

const url = "https://www.youtube.com/watch?v=bZ7jUGCVFss" 

function playMusic(){
    ytdl(url,{
        filter:'audioonly'
    }).pipe(decoder()).pipe(speaker)
}

module.exports={playMusic}