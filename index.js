
const session=require('./session')
var {connectSequence}=require('./connect'); 
const { StartChatServer } = require('./commun');
// r.registerSequence()
//     .then(({publicKey,privateKey})=>console.log(verifyKeys(publicKey,privateKey,'1 2 3 4 5 6 7 8')))
//     .then(console.log).catch(console.error)
async function main()
{
    var {io}=await session.loginSequence().then(connectSequence).catch(console.error);
    const server=await StartChatServer(io)
    global.io=io
}
main()