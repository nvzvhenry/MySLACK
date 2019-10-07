                //DECLARATION
const express = require('express');
const app = express();

let namespaces = require('./data/namespaces');
    // console.log(namespaces[0]);

const expressServer = app.listen(5000, () => {
    console.log('App currently running on port *5000')
})
app.use(express.static(__dirname + '/public'));

const io = require('socket.io')(expressServer);


                    //SLACK


//ENTRY POINT
// io.on is the same as io.of('/').on
io.on('connection', (socket) => {

    console.log(socket.handshake);

    //Create a Namespace array to send back data img and enpoint for each NS
    let nsData = namespaces.map((ns) => {
        return {
            img: ns.img,
            endpoint: ns.endpoint
        }
    })
    // console.log(nsData)

    //Send the nsData to the Client using the socket not the io because
    // we want only this Scoket to receive it
    socket.emit('nsList', nsData);
})





//Loop through Each Namespace and listen for a Connection
namespaces.map((namespace) => {
    // console.log(namespace.endpoint);

    // const thisNS = io.of(namespace.endpoint);
    io.of(namespace.endpoint).on('connection', (nsSocket) => {
        //Get the Username from the Client Query and
        //Receive it in the Socket Handshake
        const username = nsSocket.handshake.query.username;
        // console.log(username)
        // console.log(socket.id)
        // console.log(`${nsSocket.id} has joined ${namespace.endpoint}`);

        // A Socket has connected to one of the Chat Group namespaces
        // Send the Namespace group info back
        nsSocket.emit('nsRoomLoad', namespace.rooms);


        //RECEIVE THE roomName and JOIN the Room.
        nsSocket.on('joinRoom', (roomToJoin) => {
            // console.log(roomToJoin)
            
            //Leaves the Present Room and update the Number of Users Connected.
            const roomToLeave = Object.keys(nsSocket.rooms)[1];
            nsSocket.leave(roomToLeave);
            updateRoomToJoin(namespace, roomToLeave);


            //Joins a Room and Update History and Numbers of Users Connected.
            nsSocket.join(roomToJoin);
            console.log(nsSocket.rooms);
            // io.of('/wiki').in(roomToJoin).clients((error, clients) => {
            //     numberOfUsersCallback(clients.length);
            // })
            const nsRoom = namespace.rooms.find((room) => {
                return room.roomTitle === roomToJoin;
            })
            nsSocket.emit('historyUpdate', nsRoom.history);
            updateRoomToJoin(namespace, roomToJoin);
            
        })


        // Send and Receive messages back and forth
        nsSocket.on('userMessage', (newMessage) => {
            const fullMsg = {
                text: newMessage,
                time: Date.now(),
                username: username,
                avatar: 'https://via.placeholder.com/30'
            }
            // console.log(fullMsg)

            //Send this newMessage to all the Sockets connected to the
            //the present Room.
                // console.log('The rooms are', nsSocket.rooms)

            const roomTitle = Object.keys(nsSocket.rooms)[1];
            // console.log(roomTitle);

            
            //We need to find the Room object for this particular room.
            const nsRoom = namespace.rooms.find((room) => {
                return room.roomTitle === roomTitle;
            })
            // console.log(nsRoom)
            nsRoom.addMessage(fullMsg);
            io.of(namespace.endpoint).to(roomTitle).emit('messageToClients', fullMsg)


        })
    })
})


function updateRoomToJoin(namespace, roomToJoin){
    //Send the Number of Users in a particular Room to ALL Sockets Connected!
    io.of(namespace.endpoint).in(roomToJoin).clients((error, clients) => {
        // console.log(clients.length);
        io.of(namespace.endpoint).in(roomToJoin).emit('updateMembers', clients.length);
    })
}
