import logger from './logger'
import heapdump from './heapdump'
import notify from './notify'

const MOBILE_USER_AGENT = "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36 Edg/112.0.1722.58"
const PC_USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36 Edg/112.0.1722.58"

const serverChanSendKey = process.env.SERVER_CHAN_SEND_KEY
const dingtalkUrl = process.env.DINGTALK_URL

const heapdumpCookie = '_ga=GA1.1.1275103011.1682753860; _bl_uid=F1l3bh9314no3a77C8dL0Uw0a9qe; serviceTicket=36a35898b2964ee08a8107369a0145bc; JSESSIONID=C73C81DACB1C53D353A28A3DEA68F6BE; _ga_T124D4ZQ7J=GS1.1.1682753859.1.1.1682753877.0.0.0'

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
  let heapdumpRes = await heapdump.signIn(PC_USER_AGENT, heapdumpCookie).catch((err) => {
    logger.error("执行heapdump签到异常:%s", err)
  });
  if (heapdumpRes) {
    signInResArray.push(heapdumpRes)
  }

  let message = signInResArray.join("\n")
  logger.info("签到结果:\n" + message)

  await sendNotify(message)
}

async function sendNotify(message: string) {
  notify.toServerChan(message, serverChanSendKey)
  notify.toDingtalk(message, dingtalkUrl)
}
