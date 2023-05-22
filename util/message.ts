function buildMessage(head: string, lines: Array<string>): string {
    //为所有行加上"- "前缀，表示无序列表
    lines.forEach((line, index) => {
        lines[index] = "- " + line
    })

    return head + "\n" + lines.join("\n")
}

export default {buildMessage}