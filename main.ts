import logger from './util/logger'
import heapdump from './site/heapdump'
import message from './util/message'
import notify from './notify/notify'
import v2ex from "./site/v2ex";
import bilibili from "./site/bilibili";
import right from "./site/right";

main()
    .then(() => {
        process.exit(0)
    })
    .catch((err) => {
        logger.error("执行签到异常:", err)
        process.exit(-1)
    })

async function main() {
    const signInResArray = []
    for (const service of [heapdump, v2ex, bilibili, right]) {
        const res = await service.signIn();
        if (res) {
            signInResArray.push(res)
        }
    }

    if (signInResArray.length === 0) {
        logger.info("没有执行结果需要通知");
        return;
    }

    const result = message.buildNotifyMessage(signInResArray)
    logger.info("执行结果:\n" + result)

    await notify.send(result)
}
