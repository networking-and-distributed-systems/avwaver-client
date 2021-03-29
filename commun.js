const { connectSequence } = require("./connect");

async function getPID(username)
{
    if (username in pids)return pids[username]
    else return new Promise((res,rej)=>{

    })
}

