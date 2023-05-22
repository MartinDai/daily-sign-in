import logger from "../logger";

process.env.DINGTALK_URL = 'https://oapi.dingtalk.com/robot/send?access_token=d470f2c11af3f5d0005746f0c1d7fde72e044e0b6dfb48557f17720f798fbaf0'
const dingtalkUrl = process.env.DINGTALK_URL

async function send(message: string) {
    if (!dingtalkUrl) {
        return
    }

    logger.info("send notify to Dingtalk\n" + message)
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