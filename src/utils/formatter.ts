import jsyaml from "js-yaml";


export const formatCode = (language: string, code: string): string => {
    if(!code) return code;
    switch (language) {
        case "json":
            return JSON.stringify(JSON.parse(code), null, 4);
        case "yaml":
            return jsyaml.dump(jsyaml.load(code), { indent: 4 });
        case "sql":
            // 格式化 SQL 代码
            // ...
            return code;
        default:
            return code;
    }
};