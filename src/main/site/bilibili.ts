import logger from '../utils/logger'
import user_agent from '../utils/user_agent'
import message from '../utils/message'
import util from '../utils/util'

const bilibiliCookie = process.env.BILIBILI_COOKIE

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
    const signInResponse = await fetch(NAV_URL, {
        method: 'GET',
        headers: {
            'User-Agent': userAgent,
            'Cookie': bilibiliCookie,
        }
    })

    let status = signInResponse.status
    if (status != 200) {
        return ["签到结果：失败，原因：Response Status=" + status]
    } else {
        let signInResult = await signInResponse.text()
        const signInJson = JSON.parse(signInResult)
        if (signInJson.code == -101) {
            return ["签到结果：失败", "原因：Cookie已过期"]
        }
    }

    await util.sleep(5000)

    const dataResponse = await fetch(NAV_URL, {
        method: 'GET',
        headers: {
            'User-Agent': userAgent,
            'Cookie': bilibiliCookie,
        }
    })

    status = dataResponse.status
    if (status == 200) {
        let result = await dataResponse.text()
        const resultJson = JSON.parse(result)
        let data = resultJson.data
        if (!data.money) {
            logger.error("获取硬币余额失败，response:" + result)
        }
        return ["签到结果：成功", "硬币余额：" + data.money]
    } else {
        return ["签到结果：失败，原因：Response Status=" + status]
    }
}

export default {signIn}