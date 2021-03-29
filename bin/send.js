var message=process.argv.slice(2).join(' ')
const net = require('net');
const client=net.connect("/tmp/reciver");
client.write(message)
client.end()