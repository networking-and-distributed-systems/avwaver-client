const crypto = require("crypto")
const { promisify } = require("util")
const  generateKeyPair  = promisify(crypto.generateKeyPair)

function verifysignature(text,sign,publicKeybase64)
{
  const verifier = crypto.createVerify('RSA-SHA256')
  verifier.update(text, 'ascii')
  const publicKeyBuf = Buffer.from(publicKeybase64, 'base64')
  const signatureBuf = Buffer.from(sign, 'base64')
  return verifier.verify(publicKeyBuf,signatureBuf)
}
function verifyKeys(pubkeybase64,privateKeybase64,passphrase)
{
    const txt=Math.random().toString().slice(2);
    try{
        var signs=createSignature(txt,{key:privateKeybase64,passphrase})
        return verifysignature(txt,signs,pubkeybase64)
    }
    catch(e)
    {
        console.error(e,'keys could not be varified')
        return false
    }
        
}
function createSignature(text,privateKeyBase64Locked)
{
  let sign = crypto.createSign('RSA-SHA256')
  sign.update(text,'ascii')
  return sign.sign({key:Buffer.from(privateKeyBase64Locked.key,'base64'),passphrase:privateKeyBase64Locked.passphrase}, 'base64')
}
async function getKeyPair(p) {
  var keypair=await generateKeyPair('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
      cipher: 'aes-256-cbc',
      passphrase: p
    }
  });
 
  return Object.fromEntries(Object.entries(keypair).map(([key,value])=>[key,Buffer.from(value,'ascii').toString('base64')]))
}
module.exports={createSignature,verifysignature,getKeyPair,verifyKeys}