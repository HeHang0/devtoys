import jsyaml from "js-yaml"
import * as sqlFormatter from "sql-formatter"
import xmlFormatter from "xml-formatter"
const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder()

export function formatCode(
    language: string,
    code: string,
    tabSize?: number,
    insertSpaces?: boolean
): string {
    if (!code || typeof code !== "string") return ""
    if (!tabSize) tabSize = 4
    try {
        switch (language) {
            case "json":
                return JSON.stringify(JSON.parse(code), null, tabSize)
            case "yaml":
                return jsyaml.dump(jsyaml.load(code), { indent: tabSize })
            case "sql":
                return sqlFormatter.format(code, { tabWidth: tabSize })
            case "xml":
                return xmlFormatter(code)
        }
    } catch (error) {
        console.log("format code err", error)
    }
    return code
}

export function encodeBase64(text: string) {
    const encodedData = textEncoder.encode(text)
    return btoa(String.fromCharCode.apply(null, Array.from(encodedData)))
}

export function decodeBase64(text: string) {
    const decodedData = atob(text)
    const uint8Array = new Uint8Array(decodedData.length)
    for (let i = 0; i < decodedData.length; i++) {
        uint8Array[i] = decodedData.charCodeAt(i)
    }

    const decodedString = textDecoder.decode(uint8Array)
    return decodedString
}
