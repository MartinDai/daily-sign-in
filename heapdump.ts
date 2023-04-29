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

    const result = await response.json()
    const status = result.status
    if (status) {
        return "## heapdump\n- 签到结果：成功"
    } else {
        return "## heapdump\n- 签到结果：失败，原因：" + result.message
    }
}

function instance() {
    return new heapdump();
}

export default instance();