import jsyaml from "js-yaml";
import * as sqlFormatter from "sql-formatter";
import xmlFormatter from "xml-formatter";

export const formatCode = (language: string, code: string, tabSize?: number, insertSpaces?: boolean): string => {
    if(!code || typeof code !== 'string') return '';
    if(!tabSize) tabSize = 4
    try {
        switch (language) {
            case "json":
                return JSON.stringify(JSON.parse(code), null, tabSize);
            case "yaml":
                return jsyaml.dump(jsyaml.load(code), { indent: tabSize });
            case "sql":
                return sqlFormatter.format(code, {tabWidth: tabSize});
            case "xml":
                return xmlFormatter(code);
        }
    } catch (error) { console.log('format code err', error) }
    return code;
};