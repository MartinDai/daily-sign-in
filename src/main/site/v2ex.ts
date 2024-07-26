import logger from '../utils/logger'
import user_agent from '../utils/user_agent'
import message from '../utils/message'

const v2exCookie = process.env.V2EX_COOKIE

const DOMAIN = "https://www.v2ex.com"
const DAILY_PAGE_URL = DOMAIN + "/mission/daily"

const HEAD = "## V2EX"

async function signIn(): Promise<string> {
    let v2exRes
    try {
        v2exRes = await doSignIn()
    } catch (err) {
        logger.error("执行V2EX签到异常:%s", err)
        v2exRes = ['执行签到发生异常']
    }

    if (v2exRes.length == 0) {
        return ""
    }

    return message.buildMarkdown(HEAD, v2exRes)
}

async function doSignIn(): Promise<Array<string>> {
    if (!v2exCookie) {
        return [];
    }

    logger.info("开始执行V2EX签到")
    const userAgent = user_agent.getRandomPcUserAgent()
    let response = await fetch(DAILY_PAGE_URL, {
        method: 'GET',
        headers: {
            'User-Agent': userAgent,
            'Cookie': v2exCookie,
            'Referer': DOMAIN
        }
    })

    let status = response.status
    if (status == 200) {
        let result = await response.text()
        let receivedArray = result.match("每日登录奖励已领取")
        if (receivedArray != null && receivedArray.length != 0) {
            return ["签到结果：失败，原因：今日已领取过登录奖励"]
        }

        let onceArray = result.match("once=(.+?)'")
        if (onceArray == null || onceArray.length == 0) {
            return ["签到结果：失败，原因：未匹配到once"]
        }

        response = await fetch(DAILY_PAGE_URL + "/redeem?once=" + onceArray[1], {
            method: 'GET',
            headers: {
                'User-Agent': userAgent,
                'Cookie': v2exCookie,
                'Referer': DAILY_PAGE_URL
            }
        })
        result = await response.text()
        receivedArray = result.match("每日登录奖励已领取")
        if (receivedArray == null || receivedArray.length == 0) {
            logger.info("V2EX签到响应:" + result)
            return ["签到结果：失败，原因：参考日志"]
        }
        let continuityArray = result.match("已连续登录 (.+?) 天")
        return ["签到结果：成功", continuityArray[0]]
    } else {
        return ["签到结果：失败，原因：Response Status=" + status]
    }
}

export default {signIn}