import logger from './logger'
import heapdump from './heapdump'
import notify from './notify'

const MOBILE_USER_AGENT = "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36 Edg/112.0.1722.58"
const PC_USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36 Edg/112.0.1722.58"

const serverChanSendKey = process.env.SERVER_CHAN_SEND_KEY
const dingtalkUrl = process.env.DINGTALK_URL

const heapdumpAccount = process.env.HEAPDUMP_ACCOUNT
const heapdumpPasswd = process.env.HEAPDUMP_PASSWD


main()
  .then(() => {
    process.exit(0)
  })
  .catch((err) => {
    logger.error("执行签到异常:", err)
    process.exit(-1)
  })

async function main() {
  let signInResArray = new Array();
  if (heapdumpAccount && heapdumpPasswd) {
    let heapdumpRes = await heapdump.signIn(PC_USER_AGENT, heapdumpAccount, heapdumpPasswd).catch((err) => {
      logger.error("执行heapdump签到异常:%s", err)
    });
    if (heapdumpRes) {
      signInResArray.push(heapdumpRes)
    }
  }

  let message = signInResArray.join("\n")
  logger.info("执行结果:\n" + message)

  await sendNotify(message)
}

async function sendNotify(message: string) {
  await notify.toServerChan(message, serverChanSendKey)
  await notify.toDingtalk(message, dingtalkUrl)
}
