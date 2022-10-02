const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

io.on('connection', (socket) => {
  console.log('New Connection + ' + socket.id);
  // const clients = io.sockets.adapter.rooms.get('foo');
  socket.on('join', (room) => {
    socket.join(room);
  });

  socket.on('offer', (offer) => {
    console.log(offer);
    socket.to('foo').emit('offer', offer);
  });

  socket.on('answer', (answer) => {
    socket.to('foo').emit('answer', answer);
  });

  socket.on('ice', (icecandidate) => {
    console.log(icecandidate);
    socket.to('foo').emit('ice', icecandidate);
  });

  socket.on('bye', function (msg) {
    socket.broadcast.emit('out', msg);
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
