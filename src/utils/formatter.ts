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
        console.error("format code err", error)
    }
    return code
}

export function uglifyCode(language: string, code: string): string {
    if (!code || typeof code !== "string") "";
    try {
        switch (language) {
            case "json":
                return minify(code)
            // case "sql":
            //     return sqlFormatter.format(code)
            case "xml":
                return xmlFormatter.minify(code, {
                    collapseContent: true
                })
        }
    } catch (error) {
        console.error("uglify code err", error)
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

var minify = function (json: string) {

    var tokenizer = /"|(\/\*)|(\*\/)|(\/\/)|\n|\r|\[|]/g,
        in_string = false,
        in_multiline_comment = false,
        in_singleline_comment = false,
        tmp, tmp2, new_str = [], ns = 0, from = 0, lc, rc,
        prevFrom
    ;

    tokenizer.lastIndex = 0;

    while ( tmp = tokenizer.exec(json) ) {
        lc = RegExp.leftContext;
        rc = RegExp.rightContext;
        if (!in_multiline_comment && !in_singleline_comment) {
            tmp2 = lc.substring(from);
            if (!in_string) {
                tmp2 = tmp2.replace(/(\n|\r|\s)*/g,"");
            }
            new_str[ns++] = tmp2;
        }
        prevFrom = from;
        from = tokenizer.lastIndex;

        // found a " character, and we're not currently in
        // a comment? check for previous `\` escaping immediately
        // leftward adjacent to this match
        if (tmp[0] === "\"" && !in_multiline_comment && !in_singleline_comment) {
            // limit left-context matching to only go back
            // to the position of the last token match
            //
            // see: https://github.com/getify/JSON.minify/issues/64
            // lc.lastIndex = prevFrom;

            // perform leftward adjacent escaping match
            tmp2 = lc.match(/(\\)*$/);
            // start of string with ", or unescaped " character found to end string?
            if (!in_string || !tmp2 || (tmp2[0].length % 2) === 0) {
                in_string = !in_string;
            }
            from--; // include " character in next catch
            rc = json.substring(from);
        }
        else if (tmp[0] === "/*" && !in_string && !in_multiline_comment && !in_singleline_comment) {
            in_multiline_comment = true;
        }
        else if (tmp[0] === "*/" && !in_string && in_multiline_comment && !in_singleline_comment) {
            in_multiline_comment = false;
        }
        else if (tmp[0] === "//" && !in_string && !in_multiline_comment && !in_singleline_comment) {
            in_singleline_comment = true;
        }
        else if ((tmp[0] === "\n" || tmp[0] === "\r") && !in_string && !in_multiline_comment && in_singleline_comment) {
            in_singleline_comment = false;
        }
        else if (!in_multiline_comment && !in_singleline_comment && !(/\n|\r|\s/.test(tmp[0]))) {
            new_str[ns++] = tmp[0];
        }
    }
    new_str[ns++] = rc;
    return new_str.join("");
};