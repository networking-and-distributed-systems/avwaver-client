const inquirer=require('inquirer')
const axios=require('axios')
const https=require('https')
const chalk= require('chalk')
const { verifyKeys, getKeyPair } = require('./enc')
const ax = axios.create({
  httpsAgent: new https.Agent({  
    rejectUnauthorized: false
  })
});
function validatePassword(password) {
  return (
    typeof password == "string" &&
    /\w/.test(password) &&
    /\d/.test(password) &&
    password.length >= 8
  );
}
function validatePassPhrase(password) {
  return (
    typeof password == "string" &&password.trim() &&password.match(/ /g)?.length>2 && password.length >= 8
  );
}
const questions = [
  {
    type: "input",
    name: "username",
    message: "Create a username: ",
    transformer: function (text, answers, flags) {
      const result = chalk.cyanBright("@") + chalk.white(text);
      return result;
    },
  },
  {
    type: "password",
    message: "Enter unWave Password:",
    name: "password",
    mask: ".",
    validate: validatePassword,
  },
];
var passphraseQuestion={
  type: "password",
  message: "enter encrption secret for new keys ",
  name: "passphrase",
  mask: "*",
  validate: validatePassPhrase,
}
async function loginSequence()
{

  const {username,password}=await inquirer.prompt(questions)
  try{
    var response=await ax({
      url: "http://localhost:8080/user/login",
      method:'POST',
      headers: {
        'Content-Type': 'application/json'
    },
    data:JSON.stringify({username,password})
    })
  }catch(e)
  {
    throw e
  }
  if(response.data.secret===undefined)throw response.data
  else var {secret,pid}=response.data
  var {passphrase}=await inquirer.prompt([passphraseQuestion])
  if (!verifyKeys(pid,secret,passphrase))throw {success:false,mesg:"wrong key passphrase "}
  return {publicKey:pid,privateKey:secret,passphrase};
}
async function registerSequence() {
  /**
   * get username key
   * if username password are right,
   *  server returns private key,
   *   prompt user for private key password
   *   decrypt private key , and use to session
   * else create new username password
   *  ask for new user password
   *  prompt for key password
   *  create private key
   *  save and send to server for backup
   */
  const {username,password,passphrase}=await inquirer.prompt([...questions,passphraseQuestion])
  var keypair=await getKeyPair(passphrase)
  try{
    var {data:{secret,pid}}=await ax({
      url: "http://localhost:8080/user/register",
      method:'POST',
      headers: {
        'Content-Type': 'application/json'
    },
    data:JSON.stringify({username,password,secret:keypair.privateKey,pid:keypair.publicKey})
    })
  }catch(e)
  {
    throw e
  }
  return {publicKey:pid,privateKey:secret,passphrase};
}

module.exports={loginSequence,registerSequence}