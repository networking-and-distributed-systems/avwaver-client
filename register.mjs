import inquirer from "inquirer";
import https from 'https'
import chalkPipe from "chalk-pipe";
import axios from "axios";
import { generateKeyPair } from "crypto";
import { promisify } from "util";
var generateKeyPairPromise=promisify(generateKeyPair)

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
const questions = [
  {
    type: "input",
    name: "username",
    message: "Create a username: ",
    transformer: function (text, answers, flags) {
      const result = chalkPipe("pink")("@") + chalkPipe("white")(text);
      return result;
    },
  },
  {
    type: "password",
    message: "Create a Passphrase:",
    name: "password",
    mask: ".",
    validate: validatePassword,
  },
];

export default async function register() {
  var answers = await inquirer.prompt(questions);
  var keypair=await generateKeyPairPromise('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
      cipher: 'aes-256-cbc',
      passphrase: answers.password
    }
  });
  var response = await ax({
    url: "https://localhost:8080/user",
    method:'POST',
    headers: {
      'Content-Type': 'application/json'
   },
   data:JSON.stringify({username:'niki',secret:Buffer.from(keypair.privateKey).toString('base64'),pid:Buffer.from(keypair.publicKey).toString('base64')})
  });
  return response
}

