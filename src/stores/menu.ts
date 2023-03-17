interface Menu {
    key: string
    name: string
    longName?: string
    desc?: string
    children?: Menu[]
    words?: string
}
const menus: Menu[] = [
    {
        key: "",
        name: "category.all",
        longName: "tool.all.title"
    },
    {
        key: "convert",
        name: "category.converters",
        children: [
            {
                key: "json2yaml",
                name: "tool.jsonyaml.mintitle",
                longName: "tool.jsonyaml.title",
                desc: "tool.jsonyaml.description"
            },
            {
                key: "number",
                name: "tool.numbase.mintitle",
                longName: "tool.numbase.title",
                desc: "tool.numbase.description"
            },
            {
                key: "date",
                name: "tool.date.mintitle",
                longName: "tool.date.title",
                desc: "tool.date.description"
            },
            {
                key: "cron",
                name: "tool.cron.mintitle",
                longName: "tool.cron.title",
                desc: "tool.cron.description"
            }
        ],
    },
    {
        key: "codec",
        name: "category.encoders_decoders",
        children: [
            {
                key: "html",
                name: "tool.html.mintitle",
                longName: "tool.html.title",
                desc: "tool.html.description"
            },
            {
                key: "url",
                name: "tool.url.mintitle",
                longName: "tool.url.title",
                desc: "tool.url.description"
            },
            {
                key: "base64",
                name: "tool.base64.mintitle",
                longName: "tool.base64.title",
                desc: "tool.base64.description"
            },
            {
                key: "jwt",
                name: "tool.jwt.mintitle",
                longName: "tool.jwt.title",
                desc: "tool.jwt.description"
            },
        ],
    },
    {
        key: "format",
        name: "category.formatters",
        children: [
            {
                key: "json",
                name: "tool.jsonformat.mintitle",
                longName: "tool.jsonformat.title",
                desc: "tool.jsonformat.description"
            },
            {
                key: "xml",
                name: "tool.xmlformat.mintitle",
                longName: "tool.xmlformat.title",
                desc: "tool.xmlformat.description"
            },
            {
                key: "sql",
                name: "tool.sqlformat.mintitle",
                longName: "tool.sqlformat.title",
                desc: "tool.sqlformat.description"
            },
        ],
    },
    {
        key: "generate",
        name: "category.generators",
        children: [
            {
                key: "hash",
                name: "tool.hashgen.mintitle",
                longName: "tool.hashgen.title",
                desc: "tool.hashgen.description"
            },
            {
                key: "uuid",
                name: "tool.uuidgen.mintitle",
                longName: "tool.uuidgen.title",
                desc: "tool.uuidgen.description"
            },
            {
                key: "ligen",
                name: "tool.ligen.mintitle",
                longName: "tool.ligen.title",
                desc: "tool.ligen.description"
            },
            {
                key: "checksum",
                name: "tool.checksum.mintitle",
                longName: "tool.checksum.title",
                desc: "tool.checksum.description"
            },
            {
                key: "qrcode",
                name: "QR Code",
                longName: "QR Code Generator",
                desc: "Create a QR code from text"
            },
        ],
    },
    {
        key: "text",
        name: "category.text",
        children: [
            {
                key: "capitalization",
                name: "tool.textinspect.mintitle",
                longName: "tool.textinspect.title",
                desc: "tool.textinspect.description"
            },
            {
                key: "regex",
                name: "tool.regex.mintitle",
                longName: "tool.regex.title",
                desc: "tool.regex.description"
            },
            {
                key: "textdiff",
                name: "Text Diff",
                longName: "Text Diff",
                desc: "Compare two Text and display Diff"
            },
            {
                key: "hyphen",
                name: "tool.hyphenremove.mintitle",
                longName: "tool.hyphenremove.title",
                desc: "tool.hyphenremove.description"
            },
        ],
    },
    {
        key: "image",
        name: "category.graphic",
        children: [
            {
                key: "imageoptim",
                name: "tool.imageoptim.mintitle",
                longName: "tool.imageoptim.title",
                desc: "tool.imageoptim.description"
            },
            {
                key: "pdf",
                name: "tool.pdfgen.mintitle",
                longName: "tool.pdfgen.title",
                desc: "tool.pdfgen.description"
            },
            {
                key: "imageconvert",
                name: "tool.imageconvert.mintitle",
                longName: "tool.imageconvert.title",
                desc: "tool.imageconvert.description"
            },
            {
                key: "icon",
                name: "Icon Generate",
                longName: "Icon Generate",
                desc: "Create a Icon from image"
            },
            {
                key: "rqrcode",
                name: "tool.rqrcode.mintitle",
                longName: "tool.rqrcode.title",
                desc: "tool.rqrcode.description"
            },
        ],
    },
    {
        key: "media",
        name: "category.media",
        children: [
            {
                key: "color",
                name: "Color Picker",
                longName: "Color Picker ",
                desc: "Picker the color and copy components"
            },
            {
                key: "audio",
                name: "Audio Converter",
                longName: "Audio Converter ",
                desc: "Convert audio from one format to another"
            },
            {
                key: "gif",
                name: "Gif Converter",
                longName: "Gif Converter ",
                desc: "Convert a movie to an animated GIF file"
            },
            {
                key: "setting",
                name: "Settings",
                longName: "Settings",
                desc: "Setting of application"
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
        longName: mc.longName,
        desc: mc.desc,
        words: mc.name.toLowerCase() + m.key
      });
    });
});
export { menus, allMenus }
