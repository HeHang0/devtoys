interface Menu {
  key: string;
  name: string;
  longName?: string;
  desc?: string;
  children?: Menu[];
  page?: string;
  icon?: string;
  hide?: boolean;
}
const menus: Menu[] = [
  {
    key: '',
    name: 'category.all',
    longName: 'tool.all.title',
    icon: '\u0117'
  },
  {
    key: 'convert',
    name: 'category.converters',
    icon: '\u0103',
    children: [
      {
        key: 'json2yaml',
        name: 'tool.jsonyaml.mintitle',
        longName: 'tool.jsonyaml.title',
        desc: 'tool.jsonyaml.description',
        icon: '\u0109'
      },
      {
        key: 'number',
        name: 'tool.numbase.mintitle',
        longName: 'tool.numbase.title',
        desc: 'tool.numbase.description',
        icon: '\u0119'
      },
      {
        key: 'date',
        name: 'tool.date.mintitle',
        longName: 'tool.date.title',
        desc: 'tool.date.description',
        icon: '\u0118'
      },
      {
        key: 'cron',
        name: 'tool.cron.mintitle',
        longName: 'tool.cron.title',
        desc: 'tool.cron.description',
        icon: '\u0104'
      },
      {
        key: 'api',
        name: 'tool.api.mintitle',
        longName: 'tool.api.title',
        desc: 'tool.api.description',
        icon: '\u0116'
      }
    ]
  },
  {
    key: 'codec',
    name: 'category.encoders_decoders',
    icon: '\u0105',
    children: [
      {
        key: 'html',
        name: 'tool.html.mintitle',
        longName: 'tool.html.title',
        desc: 'tool.html.description',
        icon: '\u0107'
      },
      {
        key: 'url',
        name: 'tool.url.mintitle',
        longName: 'tool.url.title',
        desc: 'tool.url.description',
        icon: '\u0121'
      },
      {
        key: 'base64',
        name: 'tool.base64.mintitle',
        longName: 'tool.base64.title',
        desc: 'tool.base64.description',
        icon: '\u0100'
      },
      {
        key: 'base64img',
        name: 'tool.base64img.mintitle',
        longName: 'tool.base64img.title',
        desc: 'tool.base64img.description',
        icon: '\u0102'
      },
      {
        key: 'jwt',
        name: 'tool.jwt.mintitle',
        longName: 'tool.jwt.title',
        desc: 'tool.jwt.description',
        icon: '\u0110'
      },
      {
        key: 'keycode',
        name: 'tool.keycode.mintitle',
        longName: 'tool.keycode.title',
        desc: 'tool.keycode.description',
        icon: '\u0119'
      }
    ]
  },
  {
    key: 'format',
    name: 'category.formatters',
    icon: '\u0123',
    children: [
      {
        key: 'json',
        name: 'tool.jsonformat.mintitle',
        longName: 'tool.jsonformat.title',
        desc: 'tool.jsonformat.description',
        page: 'formatter',
        icon: '\u0108'
      },
      {
        key: 'xml',
        name: 'tool.xmlformat.mintitle',
        longName: 'tool.xmlformat.title',
        desc: 'tool.xmlformat.description',
        page: 'formatter',
        icon: '\u0114'
      },
      {
        key: 'sql',
        name: 'tool.sqlformat.mintitle',
        longName: 'tool.sqlformat.title',
        desc: 'tool.sqlformat.description',
        page: 'formatter',
        icon: '\u0122'
      }
    ]
  },
  {
    key: 'generate',
    name: 'category.generators',
    icon: '\u0126',
    children: [
      {
        key: 'hash',
        name: 'tool.hashgen.mintitle',
        longName: 'tool.hashgen.title',
        desc: 'tool.hashgen.description',
        icon: '\u0125'
      },
      {
        key: 'uuid',
        name: 'tool.uuidgen.mintitle',
        longName: 'tool.uuidgen.title',
        desc: 'tool.uuidgen.description',
        icon: '\u0106'
      },
      {
        key: 'ligen',
        name: 'tool.ligen.mintitle',
        longName: 'tool.ligen.title',
        desc: 'tool.ligen.description',
        icon: '\u0111'
      },
      {
        key: 'checksum',
        name: 'tool.checksum.mintitle',
        longName: 'tool.checksum.title',
        desc: 'tool.checksum.description',
        icon: '\u0124'
      },
      {
        key: 'qrcode',
        name: 'QR Code',
        longName: 'QR Code Generator',
        desc: 'Create a QR code from text',
        icon: '\u0110'
      },
      {
        key: 'struct',
        name: 'Struct',
        longName: 'Struct Generator',
        desc: 'Convert json,sql,golang,java struct',
        icon: '\u0122'
      }
    ]
  },
  {
    key: 'text',
    name: 'category.text',
    icon: '\u0132',
    children: [
      {
        key: 'capitalization',
        name: 'tool.textinspect.mintitle',
        longName: 'tool.textinspect.title',
        desc: 'tool.textinspect.description',
        icon: '\u0130'
      },
      {
        key: 'escape',
        name: 'tool.escape.mintitle',
        longName: 'tool.escape.title',
        desc: 'tool.escape.description',
        icon: '\u0122'
      },
      {
        key: 'regex',
        name: 'tool.regex.mintitle',
        longName: 'tool.regex.title',
        desc: 'tool.regex.description',
        icon: '\u0113'
      },
      {
        key: 'textdiff',
        name: 'Text Diff',
        longName: 'Text Diff',
        desc: 'Compare two Text and display Diff',
        icon: '\u0115'
      },
      //   {
      //     key: 'hyphen',
      //     name: 'tool.hyphenremove.mintitle',
      //     longName: 'tool.hyphenremove.title',
      //     desc: 'tool.hyphenremove.description',
      //     icon: '\u0122'
      //   },
      {
        key: 'markdown',
        name: 'tool.markdown.mintitle',
        longName: 'tool.markdown.title',
        desc: 'tool.markdown.description',
        icon: '\u0112'
      }
    ]
  },
  {
    key: 'image',
    name: 'category.graphic',
    icon: '\u0129',
    children: [
      //   {
      //     key: 'imageoptim',
      //     name: 'tool.imageoptim.mintitle',
      //     longName: 'tool.imageoptim.title',
      //     desc: 'tool.imageoptim.description',
      //     icon: '\u0128'
      //   },
      //   {
      //     key: 'pdf',
      //     name: 'tool.pdfgen.mintitle',
      //     longName: 'tool.pdfgen.title',
      //     desc: 'tool.pdfgen.description',
      //     icon: '\u0128'
      //   },
      {
        key: 'imageconvert',
        name: 'tool.imageconvert.mintitle',
        longName: 'tool.imageconvert.title',
        desc: 'tool.imageconvert.description',
        icon: '\u0128'
      },
      {
        key: 'photos',
        name: 'tool.photos.mintitle',
        longName: 'tool.photos.title',
        desc: 'tool.photos.description',
        icon: '\u0128',
        hide: !Boolean(window.showDirectoryPicker)
      },
      //   {
      //     key: 'icon',
      //     name: 'Icon Generate',
      //     longName: 'Icon Generate',
      //     desc: 'Create a Icon from image',
      //     icon: '\u0128'
      //   },
      {
        key: 'rqrcode',
        name: 'tool.rqrcode.mintitle',
        longName: 'tool.rqrcode.title',
        desc: 'tool.rqrcode.description',
        icon: '\u0110'
      }
    ]
  },
  {
    key: 'media',
    name: 'category.media',
    icon: '\u0120',
    children: [
      {
        key: 'color',
        name: 'Color Picker',
        longName: 'Color Picker ',
        desc: 'Picker the color and copy components',
        icon: '\u0134'
      }
      //   {
      //     key: 'audio',
      //     name: 'Audio Converter',
      //     longName: 'Audio Converter ',
      //     desc: 'Convert audio from one format to another',
      //     icon: '\u0120'
      //   },
      //   {
      //     key: 'gif',
      //     name: 'Gif Converter',
      //     longName: 'Gif Converter ',
      //     desc: 'Convert a movie to an animated GIF file',
      //     icon: '\u0120'
      //   }
    ]
  },
  {
    key: 'settings',
    name: 'Settings',
    longName: 'Settings',
    desc: 'Setting of application',
    icon: '\u0133'
  }
];
const allMenus: Menu[] = [];
menus.map(m => {
  Array.isArray(m.children) &&
    m.children.map(mc => {
      !mc.hide &&
        allMenus.push({
          name: mc.name,
          key: mc.key,
          icon: mc.icon,
          longName: mc.longName,
          desc: mc.desc
        });
    });
});
export { menus, allMenus };
