import logger from '../utils/logger'
import user_agent from '../utils/user_agent'
import message from '../utils/message'

const NodeSeekCookie = process.env.NODE_SEEK_COOKIE

const ATTENDANCE_URL = "https://www.nodeseek.com/api/attendance?random=true"
const HEAD = "## NodeSeek"

async function signIn(): Promise<string> {
    let res
    try {
        res = await doSignIn()
    } catch (err) {
        logger.error("执行NodeSeek签到异常:%s", err)
        res = ['执行签到发生异常']
    }

    if (res.length == 0) {
        return ""
    }

    return message.buildMarkdown(HEAD, res)
}

async function doSignIn(): Promise<Array<string>> {
    if (!NodeSeekCookie) {
        return [];
    }

    logger.info("开始执行NodeSeek签到")
    const userAgent = user_agent.getRandomPcUserAgent()
    const response = await fetch(ATTENDANCE_URL, {
        method: 'POST',
        headers: {
            'User-Agent': userAgent,
            'Cookie': NodeSeekCookie,
        }
    })

    let status = response.status
    if (status != 200) {
        return ["签到结果：失败，原因：Response Status=" + status]
    } else {
        let result = await response.text()
        const resultJson = JSON.parse(result)
        if (resultJson.success) {
            const resultJson = JSON.parse(result)
            return ["签到结果：成功", "本次获得鸡腿数：" + resultJson.gain, "当前鸡腿数：" + resultJson.current]
        } else {
            return ["签到结果：失败", "原因：Cookie已过期"]
        }
    }
}

export default {signIn}