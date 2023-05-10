import logger from './logger'

const serverChanSendKey = process.env.SERVER_CHAN_SEND_KEY
const dingtalkUrl = process.env.DINGTALK_URL

async function sendNotify(message: string) {
    if (serverChanSendKey) {
        await toServerChan(message, serverChanSendKey)
    }

    if (dingtalkUrl) {
        await toDingtalk(message, dingtalkUrl)
    }
}

async function toServerChan(message: string, sendKey: string) {
    logger.info("send notify to ServerChan\n" + message)

    const response = await fetch("https://sctapi.ftqq.com/" + sendKey + ".send", {
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

async function toDingtalk(message: string, url: string) {
    logger.info("send notify to Dingtalk\n" + message)
    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            msgtype: 'markdown',
            markdown: {
                title: "签到通知",
                text: message
            },
        }),
        headers: {
            'content-type': 'application/json',
        },
    })

    const status = response.status
    const result = await response.text()
    logger.info("received Dingtalk response status:" + status + " result:" + result)
}

export default {sendNotify}