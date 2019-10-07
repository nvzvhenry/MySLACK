function joinNs(endpoint){

if(nsSocket){
    //Check to see if nsSocket is actually a Socket.
    nsSocket.close();

    //Remove the EventListener before it is added again.
    document.querySelector('#user-input').removeEventListener('submit', formSubmission);
}    
nsSocket = io(`http://localhost:5000${endpoint}`);

nsSocket.on('nsRoomLoad', (nsRooms) => {
    // console.log(nsRooms);
    let roomList = document.querySelector('.room-list');
        roomList.innerHTML = "";
        nsRooms.map((room) => {
            let glyph;
            if(room.privateRoom){
                glyph = "lock";
            }
            else{
                glyph = "globe"
            }

            roomList.innerHTML += `<li class="room"><span class="glyphicon glyphicon-${glyph}"></span>${room.roomTitle}</li>` 
        })

        // Add a Click Listener to each Room
        Array.from(document.querySelectorAll('.room')).map((element) => {
            // console.log(element)
            element.addEventListener('click', (e) => {
                // console.log("Someone clicked on", e.target.innerText)
                joinRoom(e.target.innerText);
            })
        })

        // Add User to room automatically
        const topRoomName = document.querySelector('.room').innerText;
        joinRoom(topRoomName)
}) 


    nsSocket.on('messageToClients', (msg) => {
        console.log(msg);
        const newMsg = buildHTML(msg);
        document.querySelector('#messages').innerHTML += newMsg;
    })

    document.querySelector('.message-form').addEventListener('submit', formSubmission);
}

function formSubmission(event){
    event.preventDefault();
    const newMessage = document.querySelector('#user-message').value;
    console.log(newMessage);
    nsSocket.emit('userMessage', newMessage);
}

function buildHTML(msg){
    const convertedDate = new Date(msg.time).toLocaleString();
    const newHTML = `
            <li>
            <div class="user-image">
                <img src="${msg.avatar}" />
            </div>
            <div class="user-message">
                <div class="user-name-time">${msg.username}<span> ${convertedDate}</span></div>
                <div class="message-text">${msg.text}</div>
            </div>
        </li>   
                `

    return newHTML;
}