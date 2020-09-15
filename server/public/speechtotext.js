async function main() {

    // Imports the Google Cloud client library
    const speech = require('@google-cloud/speech');
  
    //Use the file system
    const fs = require('fs');
  
    // Creates a client
    const client = new speech.SpeechClient();
  
    // The name of the audio file to transcribe
    const fileName = './audio.mp3';
  
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
     fs.appendFile('Result.txt', word, function (err) {
      if (err) throw err;
    }); 
  
    });
  });  
  
  }
  main().catch(console.error);