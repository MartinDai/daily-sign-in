import logger from '../util/logger'
import user_agent from '../util/user_agent'
import message from '../util/message'

const bilibiliCookie = process.env.BILIBILI_COOKIE

const HEART_BEAT_URL = "https://api.bilibili.com/x/click-interface/web/heartbeat"
const NAV_URL = "https://api.bilibili.com/x/web-interface/nav"
const HEAD = "## B站"

async function signIn(): Promise<string> {
    let bilibiliRes
    try {
        bilibiliRes = await doSignIn()
    } catch (err) {
        logger.error("执行B站签到异常:%s", err)
        bilibiliRes = ['执行签到发生异常']
    }

    if (bilibiliRes.length == 0) {
        return ""
    }

    return message.buildMarkdown(HEAD, bilibiliRes)
}

async function doSignIn(): Promise<Array<string>> {
    if (!bilibiliCookie) {
        return [];
    }

    logger.info("开始执行B站签到")
    const userAgent = user_agent.getRandomPcUserAgent()
    let response = await fetch(HEART_BEAT_URL, {
        method: 'POST',
        headers: {
            'Content-Type': "application/x-www-form-urlencoded",
            'User-Agent': userAgent,
            'Cookie': bilibiliCookie,
        }
    })

    let status = response.status
    if (status != 200) {
        return ["签到结果：失败，原因：Response Status=" + status]
    }

    response = await fetch(NAV_URL, {
        method: 'GET',
        headers: {
            'User-Agent': userAgent,
            'Cookie': bilibiliCookie,
        }
    })

    status = response.status
    if (status == 200) {
        let result = await response.text()
        const resultJson = JSON.parse(result)
        let data = resultJson.data
        let money = data.money
        return ["签到结果：成功", "硬币余额：" + money]
    } else {
        return ["签到结果：失败，原因：Response Status=" + status]
    }
}

export default {signIn}