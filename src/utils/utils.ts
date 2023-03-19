import crypto from "crypto-js"

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

const TextFileType = ["application/json", "application/xml"]

const MB10 = 1024 * 1024 * 10

export function readTextFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        if (file.size > MB10) {
            reject("文件超过10MB！")
            return
        }
        if (
            !file.type.startsWith("text/") &&
            !TextFileType.includes(file.type)
        ) {
            reject("不支持的文件类型：" + file.type)
            return
        }
        const reader = new FileReader()
        reader.onload = function () {
            resolve(reader.result?.toString() || "")
        }
        reader.readAsText(file)
    })
}

export function setFontFamily(font: string[]) {
    let fontStyle = document.getElementById("dev-toys-font-family")
    if (fontStyle) fontStyle.remove()
    if (typeof font === "string") font = [font]
    if (font) {
        let index = font.indexOf("")
        if (index >= 0) font.splice(index, 1)
    }
    if (!font || font.length <= 0) return []
    fontStyle = document.createElement("style")
    fontStyle.id = "dev-toys-font-family"
    fontStyle.innerHTML = `html>body, input, input::placeholder{font-family: ${font
        .map(m => (m.includes(" ") ? `"${m}"` : m))
        .join(", ")};}`
    document.head.appendChild(fontStyle)
    return font
}

export function guid2(haveHyphen?: boolean, upperCase?: boolean) {
    const hyphen = haveHyphen ? "-" : ""
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
    }
    const hyphenArray = [S4(), S4(), S4(), S4()]
    const result = [
        S4(),
        S4(),
        hyphenArray.join(hyphen),
        S4(),
        S4(),
        S4(),
    ].join("")
    return upperCase ? result.toUpperCase() : result
}

export enum ChecksumAlgorithm {
    Md5 = "MD5",
    Sha1 = "SHA1",
    Sha256 = "SHA256",
    Sha512 = "SHA512",
}

export function checksumFile(file: File, algorithm: ChecksumAlgorithm): Promise<string> {
    return new Promise((resolve, reject) => {
        let algo;
        switch (algorithm) {
            case ChecksumAlgorithm.Sha1:
                algo = crypto.algo.SHA1;
                break;
            case ChecksumAlgorithm.Sha256:
                algo = crypto.algo.SHA256;
                break;
            case ChecksumAlgorithm.Sha512:
                algo = crypto.algo.SHA512;
                break;
        
            default:
                algo = crypto.algo.MD5;
                break;
        }
        let md5 = algo.create()
        let reader = new FileReader()
        let step = 1024 * 1024
        let total = file.size
        let cuLoaded = 0
        let time = 1
        reader.onerror = function () {
            reject()
        }
        reader.onload = function (e) {
            let wordArray = crypto.lib.WordArray.create(reader.result as any)
            md5.update(wordArray)
            cuLoaded += e.loaded
            if (cuLoaded < total) {
                readBlob(cuLoaded)
            } else {
                cuLoaded = total
                resolve(md5.finalize().toString())
            }
            time++
        }
        function readBlob(start: number) {
            let blob = file.slice(start, start + step)
            reader.readAsArrayBuffer(blob)
        }
        readBlob(0)
    })
}
