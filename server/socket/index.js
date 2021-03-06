let currentUsers = {}

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`A socket connection to the server
    has been made: ${socket.id}`)
    socket.on('join', (data) => {
      console.log('joind a socket room', data)
      currentUsers[data.userId] = socket.id
      socket.join(data.userId); // We are using room of socket io
    });

    socket.on('new-message', message => {
      // console.log(("NEW-MESSAGE " +
      //   " RECEIVED IN SOCKET/INDEX, broadcast.emit: "), message);
      socket.broadcast.emit('new-message', message);
    });
    // **************************
    // FRIENDS LIST SOCKETS
    // **************************
    socket.on('delete-friend', data => {
      if (currentUsers[data.friendId]) {
        io.to(currentUsers[data.friendId]).emit('delete-friend', {
          friendToDeleteId: data.userId
        })
      }
    });
    socket.on('accept-request', data => {
      if (currentUsers[data.friendId]) {
        io.to(currentUsers[data.friendId]).emit('accept-request', {
          userId: data.userId
        })
      }
    });
    socket.on('decline-request', data => {
      if (currentUsers[data.friendId]) {
        io.to(currentUsers[data.friendId]).emit('decline-request', {
          userId: data.userId
        })
      }
    });
    socket.on('cancel-sent-request', data => {
      if (currentUsers[data.friendId]) {
        io.to(currentUsers[data.friendId]).emit('cancel-sent-request', {
          userId: data.userId
        })
      }
    });
    socket.on('add-sent-request', data => {
      if (currentUsers[data.friendId]) {
        io.to(currentUsers[data.friendId]).emit('add-sent-request', {
          userId: data.userId
        })
      }
    });
    // **************************
    // EVENTS SOCKETS
    // **************************
    socket.on('event-invite', data => {
      data.userIds.forEach(id => {
        if (currentUsers[id]) {
          io.to(currentUsers[id]).emit('event-invite', {
            id: data.event.id, userId: id
          })
        }
      })
    });
  })
}
