// Bring in the room class


// const Namespace =  require('../classes/Namespace');
class Namespace {
    constructor(id, nsTitle, img, endpoint){
        this.id = id;
        this.nsTitle = nsTitle;
        this.img = img;
        this.endpoint = endpoint;
        this.rooms = [];
    }

    addRoom(roomObj){
        this.rooms.push(roomObj);
    }
}

// const Room =  require('../classes/Room');
class Room{
    constructor(roomId, roomTitle, namespace, privateRoom = false){
        this.roomId = roomId;
        this.roomTitle = roomTitle;
        this.namespace = namespace;
        this.privateRoom = privateRoom;
        this.history = [];
    }

    addMessage(message) {
        this.history.push(message);
    }

    clearHistory(){
        this.history = [];
    }
}

// Set up the namespaces
let namespaces = [];
let wikiNs = new Namespace(0,'Wiki','https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/103px-Wikipedia-logo-v2.svg.png','/wiki');
let mozNs = new Namespace(1,'Mozilla','https://www.mozilla.org/media/img/logos/firefox/logo-quantum.9c5e96634f92.png','/mozilla');
let linuxNs = new Namespace(2,'Linux','https://upload.wikimedia.org/wikipedia/commons/a/af/Tux.png','/linux');


// Make the main room and add it to rooms. it will ALWAYS be 0
wikiNs.addRoom(new Room(0,'New Articles','Wiki', true));
wikiNs.addRoom(new Room(1,'Editors','Wiki'));
wikiNs.addRoom(new Room(2,'Other','Wiki'));

mozNs.addRoom(new Room(0,'Firefox','Mozilla'));
mozNs.addRoom(new Room(1,'SeaMonkey','Mozilla', true));
mozNs.addRoom(new Room(2,'SpiderMonkey','Mozilla'));
mozNs.addRoom(new Room(3,'Rust','Mozilla'));

linuxNs.addRoom(new Room(0,'Debian','Linux'));
linuxNs.addRoom(new Room(1,'Red Hat','Linux'));
linuxNs.addRoom(new Room(2,'MacOs','Linux'));
linuxNs.addRoom(new Room(3,'Kernal Development','Linux', true));

namespaces.push(wikiNs,mozNs,linuxNs);

module.exports = namespaces;