import logger from './util/logger'
import heapdump from './site/heapdump'
import message from './util/message'
import notify from './notify/notify'
import v2ex from "./site/v2ex";

main()
    .then(() => {
        process.exit(0)
    })
    .catch((err) => {
        logger.error("执行签到异常:", err)
        process.exit(-1)
    })

async function main() {
    let signInResArray = [];

    //heapdump签到
    let heapdumpRes = await heapdump.signIn()
    if (heapdumpRes) {
        signInResArray.push(heapdumpRes)
    }

    //v2ex签到
    let v2exRes = await v2ex.signIn()
    if (v2exRes) {
        signInResArray.push(v2exRes)
    }

    if (signInResArray.length == 0) {
        logger.info("没有执行结果需要通知")
        return
    }

    let result = message.buildNotifyMessage(signInResArray)
    logger.info("执行结果:\n" + result)

    await notify.send(result)
}
