import logger from './logger'
import heapdump from './heapdump'
import notify from './notify'

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

  let message = signInResArray.join("\n")
  logger.info("执行结果:\n" + message)

  await notify.sendNotify(message)
}
