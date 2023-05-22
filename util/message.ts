function buildMarkdown(head: string, lines: Array<string>): string {
    //为所有行加上"- "前缀，表示无序列表
    lines.forEach((line, index) => {
        lines[index] = "- " + line
    })

    return head + "\n" + lines.join("\n")
}

function buildNotifyMessage(segments: Array<string>): string {
    return segments.join("\n")
}

export default {buildMarkdown, buildNotifyMessage}