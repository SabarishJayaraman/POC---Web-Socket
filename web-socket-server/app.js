import { WebSocketServer } from 'ws'
import express from 'express'
import { Worker, parentPort } from 'worker_threads';

const app = express()
const port = 3000
var liveUpdatesEvent = [];
var flightTrackerEvent = [];
var UserId = 1000; // User Id to keep track of connected users

// Open web socket server at port 8080
const wss = new WebSocketServer({ port: 8080 });

// Ping endpoint to test the web server
app.get('/test', (req, res) => {
  res.send('Hello World!')
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
//main();


// Web socket - on connection request
wss.on('connection', function connection(ws) {

  // assign a Id to the user
  var Id = UserId++;

  // send connection estabilished message to the user
  ws.send('Connection Estabilished');
  console.log('connected User: %s', Id);

  // on error
  ws.on('error', (e) => {
    console.log(e);
  });

  // on receiving message
  ws.on('message', function message(data) {
    console.log('received Message from User %s: %s', Id, data);

    // for each message type - create separate interval to send updates to the user
    if (data == 'Live-Updates') {
      liveUpdatesEvent.push(ws);
    }
    else if (data == 'Flight-Tracker') {
      flightTrackerEvent.push(ws);
    }
  });

  // on closing connection - clear the interval
  ws.on('close', function close() {
    console.log('disconnected User: %s', Id);
  });
});

// start a separate worker thread to read from the event hub
const worker = new Worker('./event-hub-worker.js');

// send message to the connected users
worker.on('message', (event) => {
  // send message to the connected users based on the partition key
  if (event.partitionKey == "Live-Updates") {
    for (var i = 0; i < liveUpdatesEvent.length; i++) {
      if (liveUpdatesEvent[i].readyState !== 1) {
        // remove the disconnected user from the list
        liveUpdatesEvent.splice(i, 1);
        i--;
        continue;
      }
      liveUpdatesEvent[i].send("Message for Live-Updates is -" + event.body);
    }
  }
  else if (event.partitionKey == "Flight-Tracker") {
    for (var i = 0; i < flightTrackerEvent.length; i++) {
      if (flightTrackerEvent[i].readyState !== 1) {
        // remove the disconnected user from the list
        flightTrackerEvent.splice(i, 1);
        i--;
        continue;
      }
      flightTrackerEvent[i].send("Message for Flight-Tracker is -" + event.body);
    }
  }
  else {
    console.log("Unknown partition key: " + event.partitionKey);
  }
});