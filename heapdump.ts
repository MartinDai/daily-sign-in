import logger from './logger'

const DOMAIN = "https://heapdump.cn"
const LOGIN_URL = DOMAIN + "/api/login/authentication/v1/login"
const SIGN_IN_URL = DOMAIN + "/api/community/signin/addSignin"

class heapdump {
    signIn(userAgent: string, account: string, passwd: string): Promise<string> {
        return signIn(userAgent, account, passwd)
    }
}

async function signIn(userAgent: string, account: string, passwd: string): Promise<string> {
    logger.info("开始执行heapdump签到")
    let data = { "account": account, "passwd": passwd }
    let response = await fetch(LOGIN_URL, {
        method: 'POST',
        headers: {
            'user-agent': userAgent,
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
            return "## heapdump\n- 登录结果：失败，原因：" + resultJson.message
        }
    } else {
        return "## heapdump\n- 登录结果：失败，原因：Response Status=" + status
    }

    // 获取 cookie
    const cookie = response.headers.get('set-cookie')

    // 清理一下 cookie 的格式，只保留基础的键值对
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
            return "## heapdump\n- 签到结果：成功"
        } else {
            return "## heapdump\n- 签到结果：失败，原因：" + resultJson.message
        }
    } else if (status == 401) {
        return "## heapdump\n- 签到结果：失败，原因：Cookie已过期"
    } else {
        return "## heapdump\n- 签到结果：失败，原因：Response Status=" + status
    }
}

function instance() {
    return new heapdump();
}

export default instance();