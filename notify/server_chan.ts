import logger from "../util/logger";

const serverChanSendKey = process.env.SERVER_CHAN_SEND_KEY

async function send(message: string) {
    if (!serverChanSendKey) {
        return
    }

    logger.info("send notify to ServerChan\n" + message)
    const response = await fetch("https://sctapi.ftqq.com/" + serverChanSendKey + ".send", {
        method: 'POST',
        body: JSON.stringify({
            title: '签到通知',
            desp: message,
        }),
        headers: {
            'content-type': 'application/json',
        },
    })

    const status = response.status
    const result = await response.text()
    logger.info("received ServerChan response status:" + status + " result:" + result)
}

export default {send}