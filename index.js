
r=require('./register')
var {connectSequence}=require('./connect') 
// r.registerSequence()
//     .then(({publicKey,privateKey})=>console.log(verifyKeys(publicKey,privateKey,'1 2 3 4 5 6 7 8')))
//     .then(console.log).catch(console.error)
var keys=r.loginSequence().then(connectSequence).catch(console.error);
connectSequence()
