export function readClipboard(success: (value: string) => {}) {
    navigator.clipboard
        .readText()
        .then(r => success(r))
        .catch(() => {
            const activeElement = document.activeElement as any
            const input = document.createElement("input")
            input.style.opacity = "0"
            document.body.appendChild(input)
            input.focus()
            document.execCommand("paste")
            const value = input.value
            document.body.removeChild(input)
            activeElement && activeElement.focus && activeElement.focus()
            return value
        })
}

const TextFileType = [
    "application/json",
    "application/xml"
]

const MB10 = 1024*1024*10

export function readTextFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        if(file.size > MB10) {
            reject("文件超过10MB！");
            return;
        }
        if (!file.type.startsWith("text/") && !TextFileType.includes(file.type)) {
            reject("不支持的文件类型：" + file.type);
            return;
        }
        const reader = new FileReader()
        reader.onload = function () {
            resolve(reader.result?.toString() || '')
        }
        reader.readAsText(file)
    })
}
