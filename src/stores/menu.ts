interface Menu {
    key: string
    name: string
    children?: Menu[]
    words?: string
}
const menus: Menu[] = [
    {
        key: "",
        name: "首页",
    },
    {
        key: "convert",
        name: "转换类",
        children: [
            {
                key: "json2yaml",
                name: "JSON <> Yaml",
            },
            {
                key: "number",
                name: "数字类型转换",
            },
            {
                key: "date",
                name: "日期",
            },
        ],
    },
    {
        key: "codec",
        name: "编码解码类",
        children: [
            {
                key: "html",
                name: "HTML",
            },
            {
                key: "url",
                name: "URL",
            },
            {
                key: "base64",
                name: "Base64",
            },
            {
                key: "jwt",
                name: "Jwt",
            },
        ],
    },
    {
        key: "format",
        name: "格式类",
        children: [
            {
                key: "json",
                name: "JSON",
            },
            {
                key: "xml",
                name: "XML",
            },
            {
                key: "sql",
                name: "SQL Formatter",
            },
        ],
    },
    {
        key: "generate",
        name: "生成类",
        children: [
            {
                key: "hash",
                name: "Hash",
            },
            {
                key: "uuid",
                name: "UUID",
            },
            {
                key: "dummytext",
                name: "哑元文本",
            },
            {
                key: "check",
                name: "校验测试器",
            },
            {
                key: "qrcode",
                name: "二维码生成",
            },
        ],
    },
    {
        key: "text",
        name: "文本类",
        children: [
            {
                key: "capitalization",
                name: "检查 & 大小写转换器",
            },
            {
                key: "regex",
                name: "正则表达式",
            },
            {
                key: "textdiff",
                name: "文本对比",
            },
            {
                key: "hyphen",
                name: "连字符去除",
            },
        ],
    },
    {
        key: "image",
        name: "图像类",
        children: [
            {
                key: "png",
                name: "PNG / JPEG 压缩器",
            },
            {
                key: "pdf",
                name: "pdf生成器",
            },
            {
                key: "format-conversion",
                name: "格式转换",
            },
            {
                key: "icon",
                name: "ICON生成",
            },
            {
                key: "rqrcode",
                name: "二维码读取",
            },
        ],
    },
    {
        key: "media",
        name: "媒体类",
        children: [
            {
                key: "color",
                name: "颜色选择",
            },
            {
                key: "audio",
                name: "音频转换",
            },
            {
                key: "gif",
                name: "Gif转换",
            },
            {
                key: "setting",
                name: "设置",
            },
        ],
    },
]
const allMenus: Menu[] = [];
menus.map((m) => {
  Array.isArray(m.children) &&
    m.children.map((mc) => {
      allMenus.push({
        name: mc.name,
        key: mc.key,
        words: mc.name.toLowerCase() + m.key
      });
    });
});
export { menus, allMenus }
