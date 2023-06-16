import logger from '../util/logger'
import user_agent from '../util/user_agent'
import message from '../util/message'
import util from '../util/util'

process.env.BILIBILI_COOKIE = "buvid3=296DD424-C855-1751-D1B5-3AD7E0A488E842670infoc; b_nut=1679468442; CURRENT_FNVAL=4048; _uuid=FEBDB7FF-31A4-8451-8695-3DD101031078410545186infoc; buvid_fp=d31cb64a7c477ddb4a870f42b0ca4738; rpdid=|(ku|Rm|mlRu0J'uY~mRY)RRl; CURRENT_PID=a0418d30-da9b-11ed-b656-61eb71476e2a; i-wanna-go-back=-1; home_feed_column=5; header_theme_version=CLOSE; buvid4=01B0FA0B-5289-5689-E0A9-575768CCB80D46853-023032215-Z2JRVnt%2F%2F1YtCIcKbIQbNQ%3D%3D; b_ut=5; FEED_LIVE_VERSION=V8; DedeUserID=107690085; DedeUserID__ckMd5=549d62492e39eba0; hit-new-style-dyn=1; hit-dyn-v2=1; bsource=search_bing; innersign=0; SESSDATA=572e244c%2C1702188707%2Cd2cb8%2A62; bili_jct=5f02ddeadd31b88731219f5867a411eb; sid=88cbh4j0; browser_resolution=1920-976; bp_video_offset_107690085=807295835531379000; b_lsid=7F2F72B10_188C1F860DD"
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
        return ["签到结果：成功", "硬币余额：" + data.money]
    } else {
        return ["签到结果：失败，原因：Response Status=" + status]
    }
}

export default {signIn}