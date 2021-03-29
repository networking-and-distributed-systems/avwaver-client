const { loginSequence, registerSequence } = require("./session");

const socketio=require('socket.io-client');
const { createSignature } = require("./enc");
async function connectSequence({publicKey,privateKey,passphrase})
{
    var io=socketio('http://localhost:8080/',{
        auth:{
            username:'yniks'
        }
    })
    await new Promise((res,rej)=>{
        io.on('auth-request',({payload},ack)=>{
            var sign=createSignature(payload,{key:privateKey,passphrase})
            console.log("Connected + Authenticated")
            ack(sign)
            res()
        })
    })
    return {io,privateKey,publicKey}
}
module.exports={connectSequence}