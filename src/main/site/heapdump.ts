import logger from '../utils/logger'
import user_agent from '../utils/user_agent'
import message from '../utils/message'

const heapdumpAccount = process.env.HEAPDUMP_ACCOUNT
const heapdumpPassword = process.env.HEAPDUMP_PASSWD

const DOMAIN = "https://heapdump.cn"
const LOGIN_URL = DOMAIN + "/api/login/authentication/v1/login"
const SIGN_IN_URL = DOMAIN + "/api/community/signin/addSignin"

const HEAD = "## heapdump"

async function signIn(): Promise<string> {
    let heapdumpRes
    try {
        heapdumpRes = await doSignIn()
    } catch (err) {
        logger.error("执行heapdump签到异常:%s", err)
        heapdumpRes = ['执行签到发生异常']
    }

    if (heapdumpRes.length == 0) {
        return ""
    }

    return message.buildMarkdown(HEAD, heapdumpRes)
}

async function doSignIn(): Promise<Array<string>> {
    if (!heapdumpAccount || !heapdumpPassword) {
        return [];
    }

    let userAgent = user_agent.getRandomPcUserAgent()
    logger.info("开始执行heapdump签到")
    let data = {"account": heapdumpAccount, "passwd": heapdumpPassword}
    let response = await fetch(LOGIN_URL, {
        method: 'POST',
        headers: {
            'User-Agent': userAgent,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    })

    let status = response.status
    if (status == 200) {
        const result = await response.text()
        logger.info("heapdump收到登录响应:" + result)
        const resultJson = JSON.parse(result)
        if (resultJson.code != 0) {
            return ["登录结果：失败，原因：" + resultJson.message]
        }
    } else {
        return ["登录结果：失败，原因：Response Status=" + status]
    }

    // 获取 cookie
    const cookie = response.headers.get('set-cookie')

    // 清理一下 cookie 的格式，只保留基础的键值对
    // @ts-ignore
    const real_cookie = cookie
        .replace(/Path=(.+?);\s/gi, '')
        .replace(/Max-Age=(.+?);\s/gi, '')
        .replace(/Expires=(.+?);\s/gi, '')
        .replace(/Domain=(.+?);\s/gi, '')
        .replace(/Secure;\s/gi, '')
        .replace(/HttpOnly(,?)(\s?)/gi, '')
        .trim()

    response = await fetch(SIGN_IN_URL, {
        method: 'POST',
        headers: {
            'user-agent': userAgent,
            'cookie': real_cookie,
        }
    })
    status = response.status
    if (status == 200) {
        const result = await response.text()
        logger.info("heapdump收到签到响应:" + result)
        const resultJson = JSON.parse(result)
        if (resultJson.status) {
            return ["签到结果：成功"]
        } else {
            return ["签到结果：失败，原因：" + resultJson.message]
        }
    } else if (status == 401) {
        return ["签到结果：失败，原因：Cookie已过期"]
    } else {
        return ["签到结果：失败，原因：Response Status=" + status]
    }
}

export default {signIn}