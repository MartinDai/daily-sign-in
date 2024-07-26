import logger from "../utils/logger";

const dingtalkUrl = process.env.DINGTALK_URL

async function send(message: string) {
    if (!dingtalkUrl) {
        return
    }

    logger.info("send notify to Dingtalk")
    const response = await fetch(dingtalkUrl, {
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

export default {send}