const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

io.on('connection', (socket) => {
  var clientsInRoom = io.sockets.adapter.rooms.get('foo');

  console.log('New Connection + ' + socket.id);
  // convenience function to log server messages on the client

  socket.on('create or join', function (room) {
    console.log('Received request to create or join room ' + room);

    console.log(clientsInRoom);
    var numClients = clientsInRoom ? clientsInRoom.size : 0;
    log('Room ' + room + ' now has ' + numClients + ' client(s)');
    console.log('Room ' + room + ' now has ' + numClients + ' client(s)');
    if (numClients === 0) {
      socket.join('foo');
      socket.emit('created', room, socket.id);
    } else if (numClients === 1) {
      socket.join('foo');
      socket.emit('second', room, socket.id);
    } else {
      socket.join('foo');
      socket.emit('third', room, socket.id);
    }

    socket.on('ice', (icecandidate) => {
      console.log(icecandidate);
      socket.to('foo').emit('ice', icecandidate);
    });
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

  socket.on('bye', function (msg) {
    socket.broadcast.emit('out', msg);
    console.log('received bye' + msg);
  });

  socket.on('disconnect', () => {
    var nOc = clientsInRoom ? clientsInRoom.size : 0;
    console.log('Number of Cliets onDisconnect are ' + nOc);
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
