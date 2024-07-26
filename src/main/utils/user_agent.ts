const PC_USER_AGENTS: Array<string> = [
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36 Edg/112.0.1722.58",
]

const MOBILE_USER_AGENTS: Array<string> = [
    "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36 Edg/112.0.1722.58",
]

function getRandomNumberByRange(start: number, end: number) {
    end <= start && (end = start + 100)
    return Math.floor(Math.random() * (end - start) + start)
}

function getRandomPcUserAgent(): string {
    return PC_USER_AGENTS[getRandomNumberByRange(0, PC_USER_AGENTS.length)]
}

function getRandomMobileUserAgent(): string {
    return MOBILE_USER_AGENTS[getRandomNumberByRange(0, MOBILE_USER_AGENTS.length)]
}

export default {getRandomPcUserAgent, getRandomMobileUserAgent}