const net = require('net');
const client=net.connect("/tmp/reciver");
var message=process.argv.slice(2).join(" ")
client.setDefaultEncoding('ascii').write(message)
client.end()
var hash=Buffer.from(message).toString("base64")
const reciver=net.connect("/tmp/"+hash)
reciver.on('data',data=>console.log(data))
reciver.on('end',_=>process.exit())