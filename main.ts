import logger from './util/logger'
import heapdump from './site/heapdump'
import message from './util/message'
import notify from './notify/notify'

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

    if (signInResArray.length == 0) {
        logger.info("没有执行结果需要通知")
        return
    }

    let result = message.buildNotifyMessage(signInResArray)
    logger.info("执行结果:\n" + result)

    await notify.send(result)
}
