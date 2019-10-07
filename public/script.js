const username = prompt("What is your USERNAME? ")
//  const socket = io('http://localhost:5000');
const socket = io('http://localhost:5000', {
    query: {
        username
    }
});

 let nsSocket = "";

 //Listen for the nsList from the Main Namespace.
socket.on('nsList', (nsData) => {
     console.log("The list of the Namespaces has arrived!!!");

     const namespacesDiv = document.querySelector('.namespaces');
        namespacesDiv.innerHTML = "";
        nsData.map((ns) => {
            namespacesDiv.innerHTML += `<div class="namespace" ns=${ns.endpoint}><img src=${ns.img} /></div>`
        })


        //Add a clickListener for each NS
        // console.log(document.querySelectorAll('.namespace'));
        Array.from((document.querySelectorAll('.namespace'))).map((element) => {
            element.addEventListener('click', (e) => {
                const nsEndpoint = element.getAttribute('ns');
                console.log(`${nsEndpoint} is the Endpoint I should head to NOW~`);
                joinNs(nsEndpoint);
            })
        })

        joinNs('/wiki');
})

 
//  08188310192
