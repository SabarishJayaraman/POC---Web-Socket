 import { WebSocketServer } from 'ws'
 import express from 'express'

const app = express()
const port = 3000
const wss = new WebSocketServer({ port: 8080 });
var UserId = 1000;

// Ping endpoint
app.get('/test', (req, res) => {
  res.send('Hello World!')
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// Web socket endpoint
wss.on('connection', function connection(ws) {
  var Id = UserId++;
  var IntervalList = [];

  console.log('connected User: %s', Id);
  ws.send('Connection Estabilished');  
  
  ws.on('error', (e)=>{
    console.log(e);
  });

  // on receiving message
  ws.on('message', function message(data) {
    console.log('received Message from User %s: %s', Id, data);
    
    // for each message type - create separatee interval to send updates to the user
    if(data == 'Live-Updates'){
      var loadData = setInterval(() => {
        var data = new Date().getTime();
        console.log('sending Message to User %s: %d', Id, data);
        ws.send("Live-Updates event for User " + Id + " : " + new Date().getTime());
      }, 5000)
      IntervalList.push(loadData);
    }
    else if(data == 'Flight-Tracker'){
      var loadData = setInterval(() => {
        var data = new Date().getTime();
        console.log('sending Message to User %s: %d', Id, data);
        ws.send("Flight-Tracker event for User " + Id + " : " + new Date().getTime());
      }, 5000)
      IntervalList.push(loadData);
    }
  });

  // on closing connection - clear the interval
  ws.on('close', function close() {
    IntervalList.forEach(element => {
      clearInterval(element);  
    });
    console.log('disconnected User: %s', Id);
  });
});