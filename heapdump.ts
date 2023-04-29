import logger from './logger'

const DOMAIN = "https://heapdump.cn"
const SIGN_IN_URL = DOMAIN + "/api/community/signin/addSignin"

class heapdump {
    signIn(userAgent: string, cookie: string): Promise<string> {
        return signIn(userAgent, cookie)
    }
}

async function signIn(userAgent: string, cookie: string): Promise<string> {
    logger.info("开始执行heapdump签到")
    const response = await fetch(SIGN_IN_URL, {
        method: 'POST',
        headers: {
            'cookie': cookie,
        },
    })

    const status = response.status
    if (status == 200) {
        const result = await response.text()
        logger.info("heapdump收到响应:" + result)
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