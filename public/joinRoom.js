function joinRoom(roomName) {
    //Send the roomName to the Server.
    nsSocket.emit('joinRoom', roomName);

    nsSocket.on('historyUpdate', (history) => {
        const messagesUl = document.querySelector('#messages');
        messagesUl.innerHTML = "";
        history.map((msg) => {
            console.log(msg)
            const newMsg = buildHTML(msg);
            const currentMsg = messagesUl.innerHTML;
            messagesUl.innerHTML = currentMsg + newMsg;
        })
        //To make the message start from the bottom on reload.
        messagesUl.scrollTo(0,messagesUl.scrollHeight)
    })

    nsSocket.on('updateMembers', (members) => {
        document.querySelector('.curr-room-num-users').innerHTML = `${members} <span class="glyphicon glyphicon-user"></span>`;
        document.querySelector('.curr-room-text').innerText = `${roomName}`
    })

    
    //For the Search Responsiveness!
    let searchBox = document.querySelector('#search-box');
    searchBox.addEventListener('input', (e) =>{
        let messages = Array.from(document.getElementsByClassName('message-text'));
        messages.map((msg) => {
            if(msg.innerText.toLowerCase().indexOf(e.target.value.toLowerCase()) === -1){
                msg.style.display = "none";
            } else {
                msg.style.display = "block";
            }
        })
    })
}