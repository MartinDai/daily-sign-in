import { chromium } from 'playwright'
import logger from './logger'

const DOMAIN = "https://www.v2ex.com"
const DAILY_PAGE_URL = DOMAIN + "/mission/daily"

class v2ex {
    signIn(userAgent: string, cookie: string): Promise<string> {
        return signIn(userAgent, cookie)
    }
}

async function signIn(userAgent: string, cookie: string): Promise<string> {
    logger.info("开始执行v2ex签到")
    const browser = await chromium.launch()
    const page = await browser.newPage({
        userAgent,
    })
    page.setExtraHTTPHeaders({ "cookie": cookie })

    // 打开日常任务页面，等待加载完成
    await page.goto(DAILY_PAGE_URL,
        {
            waitUntil: 'domcontentloaded'
        }
    )

    //找到签到按钮并点击
    const signInButtonSelector = 'input[value="领取 X 铜币"]'
    const signInbBtnArray = await page.locator(signInButtonSelector).all()
    if (signInbBtnArray.length == 0) {
        return "## V2EX\n- 签到结果：已经签到过了"
    }

    const onclick = await signInbBtnArray[0].getAttribute("onclick")
    if (!onclick) {
        return "## V2EX\n- 签到结果：失败，未找到签到按钮"
    }

    const path = onclick.substring(onclick.indexOf('=') + 3, onclick.length - 2)
    //请求签到页面
    const response = await page.goto('https://www.v2ex.com' + path,
        {
            referer: DAILY_PAGE_URL,
            waitUntil: 'domcontentloaded'
        }
    )

    const body = await response.text()
    const balanceSelector = '.balance_area'
    const moneyArray = await page.locator(balanceSelector).all()
    let balance = ""
    if (signInbBtnArray.length > 0) {
        const valArray = await signInbBtnArray[0].allTextContents()
        if (valArray.length > 0) {
            balance = "\n- 当前拥有铜币数:" + valArray[0]
        }
    }

    return "## V2EX\n- 签到结果：成功" + balance
}

function instance() {
    return new v2ex();
}

export default instance();