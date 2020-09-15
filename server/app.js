require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const fs = require('fs');
mongoose.connect("mongodb://localhost:27017/studentDB",{ useUnifiedTopology: true ,useNewUrlParser: true});
//var blockz = speechtotest();
const studentSchema = new mongoose.Schema({
   name: String,
   score: Number
});
const Student = mongoose.model('Student', studentSchema);
const app = express();
app.set('view engine', 'ejs');



app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));


app.get("/", function(req, res) {
  fs.readFile('./public/raw.txt', (err, data) => {
    if (err) throw err;
    console.log(data.toString());
    res.render("home", {trascript : data.toString(), name : 'יונתן הררי'} );
  });
  
  
});

app.get("/ranking", function(req, res) {
  Student.find({},function(err,students){
students.sort(function(a,b){
  return b.score-a.score;
})
    res.render("ranking",{students:students,name:"Baraa"});
});
});



app.get("/video/:postID", function(req, res){
  const postID = req.params.postID;
  Post.findById(postID, function (err, post) {
    if(err || !post)
    {
      console.log("No post was found");
    }
    else{
      res.render("post", {
        title: post.title,
        content: post.content
      });
    }
})

});



app.listen(3000, function() {
  console.log("Server started successfully");
});


async function speechtotest() {

  // Imports the Google Cloud client library
  const speech = require('@google-cloud/speech');

  //Use the file system
  const fs = require('fs');

  // Creates a client
  const client = new speech.SpeechClient();

  // The name of the audio file to transcribe
  const fileName = './public/audio.mp3';

  // Reads a local audio file and converts it to base64
  const file = fs.readFileSync(fileName);
  const audioBytes = file.toString('base64');

  // The audio file's encoding, sample rate in hertz, and BCP-47 language code
  const audio = {
    content: audioBytes,
  };
  const config = {
    enableWordTimeOffsets: true,

    encoding: 'mp3',
    sampleRateHertz: 16000,
    languageCode: 'iw-IL',
  };
  const request = {
    audio: audio,
    config: config,
  };

  // Detects speech in the audio file
  var blockz = []
  fs.writeFile('public/input.txt', '', function (err) {
   if (err) throw err;
 }); 
 fs.writeFile('public/raw.txt', '', function (err) {
  if (err) throw err;
}); 

  const [response] = await client.recognize(request);
response.results.forEach(result => {
  console.log(`Transcription: ${result.alternatives[0].transcript}`);
  result.alternatives[0].words.forEach(wordInfo => {
    // NOTE: If you have a time offset exceeding 2^32 seconds, use the
    // wordInfo.{x}Time.seconds.high to calculate seconds.
    const startSecs =
      `${wordInfo.startTime.seconds}` +
      '.' +
      wordInfo.startTime.nanos / 100000000;

    var word = `[${startSecs}] ${wordInfo.word}\n` ;
  
    //Append to file
    blockz.push({
      type: "paragraph",
      data: {
         text: word
        }
     });

   fs.appendFile('public/input.txt', word, function (err) {
    if (err) throw err;
  }); 
  fs.appendFile('public/raw.txt', wordInfo.word + " ", function (err) {
    if (err) throw err;
  }); 
  });
});  
  return blockz
}

