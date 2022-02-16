const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

io.on('connection', (socket) => {
  var clientsInRoom = io.sockets.adapter.rooms.get('foo');

  console.log('New Connection + ' + socket.id);
  console.log(clientsInRoom);
  // convenience function to log server messages on the client
  function log() {
    var array = ['Message from server:'];
    array.push.apply(array, arguments);
    socket.emit('log', array);
  }

  socket.on('message', function (message) {
    log('Client said: ', message);
    console.log('Wthhh !!!! ' + message);
    // for a real app, would be room-only (not broadcast)
    socket.broadcast.emit('message', message);
  });

  socket.on('create or join', function (room) {
    console.log('Received request to create or join room ' + room);

    // var clientsInRoom = io.sockets.adapter.rooms[room];
    // console.log(typeof clientsInRoom);
    // console.log(clientsInRoom);
    // var numClients = clientsInRoom.length;
    console.log(clientsInRoom);
    var numClients = clientsInRoom ? clientsInRoom.size : 0;
    log('Room ' + room + ' now has ' + numClients + ' client(s)');
    console.log('Room ' + room + ' now has ' + numClients + ' client(s)');
    if (numClients === 0) {
      socket.join('foo');
      log('Client ID ' + socket.id + ' created room ' + room);
      socket.emit('created', room, socket.id);
    } else if (numClients === 1) {
      log('Client ID ' + socket.id + ' joined room ' + room);
      io.in(room).emit('join', room);
      socket.join('foo');
      socket.emit('joined', room, socket.id);
      io.in(room).emit('ready');
    } else {
      // max two clients
      socket.emit('full', room);
    }
  });

  socket.on('ipaddr', function () {
    var ifaces = os.networkInterfaces();
    for (var dev in ifaces) {
      ifaces[dev].forEach(function (details) {
        if (details.family === 'IPv4' && details.address !== '127.0.0.1') {
          socket.emit('ipaddr', details.address);
        }
      });
    }
  });

  socket.on('bye', function () {
    console.log('received bye');
  });

  socket.on('disconnect', () => {
    var nOc = clientsInRoom ? clientsInRoom.size : 0;
    console.log('Number of Cliets onDisconnect are ' + nOc);
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
