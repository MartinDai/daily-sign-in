import { send } from 'process'
import logger from './logger'

class notify {
    async toServerChan(message: string, sendKey: string) {
        return toServerChan(message, sendKey)
    }
    async toDingtalk(message: string, url: string) {
        return toDingtalk(message, url)
    }
}

async function toServerChan(message: string, sendKey: string) {
    if (!sendKey) {
        return
    }
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
    logger.info("send notify to ServerChan response status:" + status + " result:" + result)
}

async function toDingtalk(message: string, url: string) {
    if (!url) {
        return
    }
    logger.info("send notify to Dingtalk\n" + message)
    await fetch(url, {
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
}

function instance() {
    return new notify()
}

export default instance();