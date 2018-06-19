
var youtubeStream = require("youtube-audio-stream");
var lame = require('lame');
var Speaker = require('speaker');
var decoder = lame.Decoder

const url = "https://www.youtube.com/watch?v=bZ7jUGCVFss" 

function playMusic(){
   youtubeStream(url).pipe(decoder()).pipe(new Speaker())
}

module.exports={playMusic}