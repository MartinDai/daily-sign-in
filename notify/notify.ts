import serverChan from './server_chan'
import dingtalk from "./dingtalk";

async function sendNotify(message: string) {
    await serverChan.send(message)
    await dingtalk.send(message)
}

export default {sendNotify}