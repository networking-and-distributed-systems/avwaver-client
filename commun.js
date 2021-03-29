const net = require('net');
var server=null
///singlton factory
async function StartChatServer(io)
{
    if(server)return server
    else server=net.createServer((conn)=>{
        var listenFrom=new Set()
        var from;
        function receiver(message)
        {
            if (listenFrom.has(message.from))
            conn.write(message.msg)
        }
        function sendMessage(msg,to)
        {
            io.emit('chat-message',{msg:msg.toString(),to,from:"37dfe3e4-e524-4a6e-b1d9-748103dbda42"})
        }
        console.log('reciver connected')
        conn.on('end',()=>{
            console.log('reciver disconeccted')
            io.removeListener('chat-message',receiver)
        })
        conn.on('data',function receivePeople(people){
            people=people.toString('ascii').split(" ")
            people.map(str=>str.trim()).forEach((person)=>
            {
                io.emit('listen-from',person)
                listenFrom.add(person)
                from=person
            })
            io.on('chat-message',receiver)
            conn.removeListener('data',receivePeople)
            conn.addListener('data',(msg)=>sendMessage(msg,from))
        })
    }).listen("58765",()=>console.log("server started at 58765"))
    return server
}
module.exports={StartChatServer}