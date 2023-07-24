import logger from '../util/logger'
import user_agent from '../util/user_agent'
import message from '../util/message'

const rightCookie = process.env.RIGHT_COOKIE

const FORUM_URL = "https://www.right.com.cn/forum/forum.php"
const HOME_URL = "https://www.right.com.cn/forum/home.php?mod=spacecp&ac=credit&showcredit=1&inajax=1&ajaxtarget=extcreditmenu_menu"
const HEAD = "## 恩山论坛"
const CREDIT_REX = /<span id="hcredit_2">(.+?)<\/span>/;

async function signIn(): Promise<string> {
    let rightRes
    try {
        rightRes = await doSignIn()
    } catch (err) {
        logger.error("执行恩山论坛签到异常:%s", err)
        rightRes = ['执行签到发生异常']
    }

    if (rightRes.length == 0) {
        return ""
    }

    return message.buildMarkdown(HEAD, rightRes)
}

async function doSignIn(): Promise<Array<string>> {
    if (!rightCookie) {
        return [];
    }

    logger.info("开始执行恩山论坛签到")
    const userAgent = user_agent.getRandomPcUserAgent()
    let response = await fetch(FORUM_URL, {
        method: 'GET',
        headers: {
            'User-Agent': userAgent,
            'Cookie': rightCookie,
        }
    })

    let status = response.status
    if (status != 200) {
        return ["登录结果：失败，原因：Response Status=" + status]
    }

    response = await fetch(HOME_URL, {
        method: 'GET',
        headers: {
            'User-Agent': userAgent,
            'Cookie': rightCookie,
        }
    })

    status = response.status
    if (status == 200) {
        let result = await response.text()
        logger.info("恩山签到响应:" + result)
        const matches = CREDIT_REX.exec(result)
        let credit
        if (matches && matches.length > 1) {
            credit = matches[1];
        } else {
            logger.error("获取恩山论坛积分失败，response:" + result)
        }

        return ["登录结果：成功", "积分：" + credit]
    } else {
        return ["登录结果：失败，原因：Response Status=" + status]
    }
}

export default {signIn}