const ytdl    = require('ytdl-core')
const Speaker = require('speaker')
const ffmpeg = require('fluent-ffmpeg')
const speakers = new Speaker()

const url = "https://www.youtube.com/watch?v=bZ7jUGCVFss"

function playMusic(){
    var audiostream = ytdl(url,{
        filter:'audioonly'
    })

    ffmpeg(audiostream)
        .format('wav')
        .pipe(speakers)
}

module.exports={playMusic}
