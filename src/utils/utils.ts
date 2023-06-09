import crypto from 'crypto-js';
import exifr from 'exifr';
import type { ExifInfo } from './exif-js/exif';

export function readClipboard(success: (value: string) => {}) {
  navigator.clipboard
    .readText()
    .then(r => success(r))
    .catch(() => {
      const activeElement = document.activeElement as any;
      const input = document.createElement('input');
      input.style.opacity = '0';
      document.body.appendChild(input);
      input.focus();
      document.execCommand('paste');
      const value = input.value;
      document.body.removeChild(input);
      activeElement && activeElement.focus && activeElement.focus();
      return value;
    });
}

const TextFileType = ['application/json', 'application/xml'];

const TextFileExtRegex =
  /(.TXT|.CS|.GO|.JS|.JSON|.VUE|.SQL|.HTML|.BAT|.CSS|.MD|.BASH|.SH|.GITIGNORE|.GITATTRIBUTE|.RC|.XML|.LOG|.PY|.JAVA|.C|.CPP|.LESS|.KT|.PHP|.TS|.SVG)$/;
const MB10 = 1024 * 1024 * 10;

export const allColorNames = [
  'AliceBlue',
  'AntiqueWhite',
  'Aqua',
  'Aquamarine',
  'Azure',
  'Beige',
  'Bisque',
  'Black',
  'BlanchedAlmond',
  'Blue',
  'BlueViolet',
  'Brown',
  'BurlyWood',
  'CadetBlue',
  'Chartreuse',
  'Chocolate',
  'Coral',
  'CornflowerBlue',
  'Cornsilk',
  'Crimson',
  'Cyan',
  'DarkBlue',
  'DarkCyan',
  'DarkGoldenRod',
  'DarkGray',
  'DarkGrey',
  'DarkGreen',
  'DarkKhaki',
  'DarkMagenta',
  'DarkOliveGreen',
  'DarkOrange',
  'DarkOrchid',
  'DarkRed',
  'DarkSalmon',
  'DarkSeaGreen',
  'DarkSlateBlue',
  'DarkSlateGray',
  'DarkSlateGrey',
  'DarkTurquoise',
  'DarkViolet',
  'DeepPink',
  'DeepSkyBlue',
  'DimGray',
  'DimGrey',
  'DodgerBlue',
  'FireBrick',
  'FloralWhite',
  'ForestGreen',
  'Fuchsia',
  'Gainsboro',
  'GhostWhite',
  'Gold',
  'GoldenRod',
  'Gray',
  'Grey',
  'Green',
  'GreenYellow',
  'HoneyDew',
  'HotPink',
  'IndianRed',
  'Indigo',
  'Ivory',
  'Khaki',
  'Lavender',
  'LavenderBlush',
  'LawnGreen',
  'LemonChiffon',
  'LightBlue',
  'LightCoral',
  'LightCyan',
  'LightGoldenRodYellow',
  'LightGray',
  'LightGrey',
  'LightGreen',
  'LightPink',
  'LightSalmon',
  'LightSeaGreen',
  'LightSkyBlue',
  'LightSlateGray',
  'LightSlateGrey',
  'LightSteelBlue',
  'LightYellow',
  'Lime',
  'LimeGreen',
  'Linen',
  'Magenta',
  'Maroon',
  'MediumAquaMarine',
  'MediumBlue',
  'MediumOrchid',
  'MediumPurple',
  'MediumSeaGreen',
  'MediumSlateBlue',
  'MediumSpringGreen',
  'MediumTurquoise',
  'MediumVioletRed',
  'MidnightBlue',
  'MintCream',
  'MistyRose',
  'Moccasin',
  'NavajoWhite',
  'Navy',
  'OldLace',
  'Olive',
  'OliveDrab',
  'Orange',
  'OrangeRed',
  'Orchid',
  'PaleGoldenRod',
  'PaleGreen',
  'PaleTurquoise',
  'PaleVioletRed',
  'PapayaWhip',
  'PeachPuff',
  'Peru',
  'Pink',
  'Plum',
  'PowderBlue',
  'Purple',
  'RebeccaPurple',
  'Red',
  'RosyBrown',
  'RoyalBlue',
  'SaddleBrown',
  'Salmon',
  'SandyBrown',
  'SeaGreen',
  'SeaShell',
  'Sienna',
  'Silver',
  'SkyBlue',
  'SlateBlue',
  'SlateGray',
  'SlateGrey',
  'Snow',
  'SpringGreen',
  'SteelBlue',
  'Tan',
  'Teal',
  'Thistle',
  'Tomato',
  'Turquoise',
  'Violet',
  'Wheat',
  'White',
  'WhiteSmoke',
  'Yellow',
  'YellowGreen'
];

export function readTextFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (file.size > MB10) {
      reject('文件超过10MB！');
      return;
    }
    if (
      !file.type.startsWith('text/') &&
      !TextFileType.includes(file.type) &&
      !TextFileExtRegex.test(file.name.toUpperCase())
    ) {
      reject('不支持的文件类型：' + file.type);
      return;
    }
    const reader = new FileReader();
    reader.onload = function () {
      resolve(reader.result?.toString() || '');
    };
    reader.readAsText(file);
  });
}

export function readFileFromEntry(entry: any): Promise<File[]> {
  return new Promise(resolve => {
    const files: File[] = [];
    var reader = entry.createReader();
    reader.readEntries(function (entries: any) {
      let fileCount = 0;
      let readCount = 0;
      for (var j = 0; j < entries.length; j++) {
        var fileEntry = entries[j];
        if (fileEntry.isFile) {
          fileCount++;
          // 如果是文件，可以通过fileEntry.file方法来读取文件内容
          fileEntry.file(function (file: File) {
            readCount++;
            file && file instanceof File && files.push(file);
            if (readCount >= fileCount) {
              resolve(files);
            }
          });
        }
      }
    });
  });
}

export function downloadTextAsFile(text: string, fileName?: string) {
  var blob = new Blob([text], { type: 'text/plain' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = fileName || 'file.txt';
  a.click();
  a.remove();
}

export function printHtml(html: string) {
  var printWindow = window.open('', '', 'width=800,height=600');
  if (!printWindow) return;
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.onload = function () {
    if (!printWindow) return;
    printWindow.focus();
    printWindow.print();
    setTimeout(printWindow.close, 5000);
  };
}

export function setFontFamily(font: string[]) {
  let fontStyle = document.getElementById('devtoys-font-family');
  if (fontStyle) fontStyle.remove();
  if (typeof font === 'string') font = [font];
  if (font) {
    let index = font.indexOf('');
    if (index >= 0) font.splice(index, 1);
  }
  if (!font || font.length <= 0) return [];
  fontStyle = document.createElement('style');
  fontStyle.id = 'devtoys-font-family';
  fontStyle.innerHTML = `html>body, input, input::placeholder{font-family: ${font
    .map(m => (m.includes(' ') ? `"${m}"` : m))
    .join(', ')};}`;
  document.head.appendChild(fontStyle);
  return font;
}

export function parseUrl(url: string) {
  let parser = document.createElement('a');
  parser.href = url;

  const result = {
    protocol: parser.protocol,
    host: parser.host,
    pathname: parser.pathname,
    params: [] as {
      key: string;
      value: string;
    }[]
  };

  let queryStr = parser.search.substring(1);
  let params = queryStr.split('&');
  parser.remove();
  for (let param of params) {
    if (!param) continue;
    let [key, value] = param.split('=');
    result.params.push({
      key: decodeURIComponent(key),
      value: decodeURIComponent(value)
    });
  }

  return result;
}

export function guid2(haveHyphen?: boolean, upperCase?: boolean) {
  const hyphen = haveHyphen ? '-' : '';
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  const hyphenArray = [S4(), S4(), S4(), S4()];
  const result = [S4(), S4(), hyphenArray.join(hyphen), S4(), S4(), S4()].join(
    ''
  );
  return upperCase ? result.toUpperCase() : result;
}

export enum ChecksumAlgorithm {
  Md5 = 'MD5',
  Sha1 = 'SHA1',
  Sha256 = 'SHA256',
  Sha512 = 'SHA512'
}

export function checksumFile(
  file: File,
  algorithm: ChecksumAlgorithm
): Promise<string> {
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
    let md5 = algo.create();
    let reader = new FileReader();
    let step = 1024 * 1024;
    let total = file.size;
    let cuLoaded = 0;
    let time = 1;
    reader.onerror = function () {
      reject();
    };
    reader.onload = function (e) {
      let wordArray = crypto.lib.WordArray.create(reader.result as any);
      md5.update(wordArray);
      cuLoaded += e.loaded;
      if (cuLoaded < total) {
        readBlob(cuLoaded);
      } else {
        cuLoaded = total;
        resolve(md5.finalize().toString());
      }
      time++;
    };
    function readBlob(start: number) {
      let blob = file.slice(start, start + step);
      reader.readAsArrayBuffer(blob);
    }
    readBlob(0);
  });
}

export function elementScrollClick(id: string, click?: boolean) {
  const menuEle = document.getElementById(id);
  if (!menuEle) return;
  click && menuEle.click();
  const intoView =
    (menuEle as any).scrollIntoViewIfNeeded || menuEle.scrollIntoView;
  intoView.bind(menuEle)();
}

const luminance = (r: number, g: number, b: number) =>
  0.2126 * (r / 255) + 0.7152 * (g / 255) + 0.0722 * (b / 255);

export function contrast(color1: string, color2: string) {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  if (!rgb1 || !rgb2) return 1;
  var lum1 = luminance(rgb1.r, rgb1.g, rgb1.b);
  var lum2 = luminance(rgb2.r, rgb2.g, rgb2.b);
  var brightest = Math.max(lum1, lum2);
  var darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

function hexToRgb(hexColor: string) {
  if (hexColor.startsWith('#')) {
    hexColor = hexColor.substring(1);
  }
  if (hexColor.length !== 6 && hexColor.length !== 8) {
    return null;
  }
  let r = parseInt(hexColor.substring(0, 2), 16);
  let g = parseInt(hexColor.substring(2, 4), 16);
  let b = parseInt(hexColor.substring(4, 6), 16);
  let a = 1;
  if (hexColor.substring(6, 8)) {
    a = parseInt(hexColor.substring(6, 8), 16);
  }
  r = (1 - a) * 255 + a * r;
  g = (1 - a) * 255 + a * g;
  b = (1 - a) * 255 + a * b;

  return {
    r: r >= 0 && r <= 255 ? r : 0,
    g: g >= 0 && g <= 255 ? g : 0,
    b: g >= 0 && g <= 255 ? g : 0
  };
}

export enum ImageType {
  Png = 'png',
  Jpg = 'jpeg',
  Gif = 'gif',
  Bmp = 'bmp',
  Webp = 'webp'
}

export function convertImage(
  img: HTMLImageElement,
  type: ImageType,
  quality: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    // 计算图像的新尺寸
    let newWidth = img.naturalWidth;
    let newHeight = img.naturalHeight;
    canvas.width = newWidth;
    canvas.height = newHeight;
    // 在画布上绘制图像并转换为Blob URL
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      canvas.toBlob(
        blob => {
          resolve((blob && URL.createObjectURL(blob)) || '');
          canvas.remove();
        },
        'image/' + type,
        quality
      );
    } else {
      reject();
    }
  });
}

export function convertImageToDataUrl(img: HTMLImageElement): Promise<string> {
  const canvas = document.createElement('canvas');
  // 计算图像的新尺寸
  let newWidth = img.width;
  let newHeight = img.height;
  canvas.width = newWidth;
  canvas.height = newHeight;
  // 在画布上绘制图像并转换为Data URL
  const ctx = canvas.getContext('2d');
  return new Promise(resolve => {
    // 调用 requestAnimationFrame() 以确保在下一帧中执行 toDataURL() 方法
    window.requestAnimationFrame(() => {
      if (ctx) {
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
        resolve(canvas.toDataURL());
        canvas.remove();
      } else {
        resolve('');
      }
    });
  });
}

export function readExifFromFile(file: File): Promise<ExifInfo | null> {
  return new Promise(resolve => {
    exifr
      .parse(file, {
        tiff: true,
        exif: true,
        gps: true,
        ifd1: true,
        icc: true,
        mergeOutput: true,
        reviveValues: false
      })
      .then(output => {
        output.rotation = 0;
        if (
          typeof output.Orientation === 'string' &&
          /[\d]+/.test(output.Orientation)
        ) {
          output.rotation = parseInt(
            (/[\d]+/.exec(output.Orientation) as any)[0]
          );
        }
        exifr
          .thumbnailUrl(file)
          .then(url => {
            output.thumbnailUrl = url;
          })
          .finally(() => {
            resolve(output);
          });
      })
      .catch(() => {
        resolve(null);
      });
    // exif.getData(file, function () {
    //   const that: any = this;
    //   resolve(that.exifdata);
    // });
  });
}

export function readThumbnailFromFile(
  file: File,
  maxWidth?: number,
  maxHeight?: number
): Promise<string> {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = function (ev: ProgressEvent<FileReader>) {
      if (!ev.target || typeof ev.target.result !== 'string') {
        resolve('');
        return;
      }
      const img = new Image();
      img.onload = function () {
        let width = img.width;
        let height = img.height;
        const MAX_WIDTH = maxWidth || 100;
        const MAX_HEIGHT = maxHeight || 100;

        // 如果图片的宽度或高度大于最大值，则按比例缩放
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }

        // 创建一个 Canvas 对象并在其中绘制缩略图
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx && ctx.drawImage(img, 0, 0, width, height);

        // 将 Canvas 转换为 base64 编码的图片
        const thumbnail = canvas.toDataURL('image/jpeg', 0.8);
        canvas.remove();
        img.remove();
        resolve(thumbnail);
      };
      img.onerror = function () {
        resolve('');
      };
      img.src = ev.target.result;
    };
    reader.onerror = function () {
      resolve('');
    };
    reader.readAsDataURL(file);
  });
}

export const KeyCode2Android: any = {
  '8': 67,
  '9': 61,
  '12': 3,
  '13': 66,
  '16': 42,
  '17': 57,
  '18': 56,
  '19': 130,
  '20': 62,
  '21': 278,
  '22': 279,
  '23': 280,
  '24': 281,
  '25': 282,
  '26': 283,
  '27': 111,
  '28': 285,
  '29': 286,
  '30': 287,
  '31': 288,
  '32': 62,
  '33': 92,
  '34': 222,
  '35': 77,
  '36': 74,
  '37': 21,
  '38': 19,
  '39': 22,
  '40': 20,
  '41': 23,
  '42': 56,
  '43': 81,
  '44': 55,
  '45': 69,
  '46': 56,
  '47': 76,
  '48': 7,
  '49': 8,
  '50': 9,
  '51': 10,
  '52': 11,
  '53': 12,
  '54': 13,
  '55': 14,
  '56': 15,
  '57': 16,
  '58': 243,
  '59': 243,
  '60': 224,
  '61': 81,
  '62': 319,
  '63': 72,
  '64': 68,
  '65': 29,
  '66': 30,
  '67': 31,
  '68': 32,
  '69': 33,
  '70': 34,
  '71': 35,
  '72': 36,
  '73': 37,
  '74': 38,
  '75': 39,
  '76': 40,
  '77': 41,
  '78': 42,
  '79': 43,
  '80': 44,
  '81': 45,
  '82': 46,
  '83': 47,
  '84': 48,
  '85': 49,
  '86': 50,
  '87': 51,
  '88': 52,
  '89': 53,
  '90': 54,
  '91': 129,
  '92': 73,
  '93': 130,
  '94': 75,
  '95': 69,
  '96': 7,
  '97': 29,
  '98': 30,
  '99': 31,
  '100': 32,
  '101': 33,
  '102': 34,
  '103': 35,
  '104': 36,
  '105': 37,
  '106': 38,
  '107': 39,
  '108': 40,
  '109': 41,
  '110': 42,
  '111': 43,
  '112': 44,
  '113': 45,
  '114': 46,
  '115': 47,
  '116': 48,
  '117': 49,
  '118': 50,
  '119': 51,
  '120': 52,
  '121': 53,
  '122': 54,
  '123': 124,
  '124': 73,
  '125': 125,
  '126': 71,
  '127': 112,
  '144': 69,
  '145': 70,
  '186': 243,
  '187': 81,
  '188': 55,
  '189': 69,
  '190': 56,
  '191': 76,
  '192': 68,
  '219': 71,
  '220': 73,
  '221': 72,
  '222': 222
};

export const KeyCode2IOS: any = {
  '3': 9,
  '8': 51,
  '9': 48,
  '12': 3,
  '13': 40,
  '16': 57,
  '17': 56,
  '18': 58,
  '19': 55,
  '20': 59,
  '21': 146,
  '22': 147,
  '23': 148,
  '24': 149,
  '25': 150,
  '26': 151,
  '27': 53,
  '28': 153,
  '29': 154,
  '30': 155,
  '31': 156,
  '32': 49,
  '33': 232,
  '34': 233,
  '35': 234,
  '36': 235,
  '37': 21,
  '38': 22,
  '39': 23,
  '40': 255,
  '41': 56,
  '42': 54,
  '43': 78,
  '44': 44,
  '45': 27,
  '46': 76,
  '47': 223,
  '48': 29,
  '49': 18,
  '50': 19,
  '51': 20,
  '52': 21,
  '53': 23,
  '54': 22,
  '55': 26,
  '56': 28,
  '57': 25,
  '58': 227,
  '59': 61,
  '60': 74,
  '61': 60,
  '62': 75,
  '63': 72,
  '64': 224,
  '65': 97,
  '66': 98,
  '67': 99,
  '68': 100,
  '69': 101,
  '70': 102,
  '71': 103,
  '72': 104,
  '73': 105,
  '74': 106,
  '75': 107,
  '76': 108,
  '77': 109,
  '78': 110,
  '79': 111,
  '80': 112,
  '81': 113,
  '82': 114,
  '83': 115,
  '84': 116,
  '85': 117,
  '86': 118,
  '87': 119,
  '88': 120,
  '89': 121,
  '90': 122,
  '91': 227,
  '92': 230,
  '93': 228,
  '94': 237,
  '95': 42,
  '96': 53,
  '97': 29,
  '98': 18,
  '99': 19,
  '100': 20,
  '101': 21,
  '102': 23,
  '103': 22,
  '104': 26,
  '105': 28,
  '106': 25,
  '107': 227,
  '108': 56,
  '109': 71,
  '110': 78,
  '111': 74,
  '112': 69,
  '113': 77,
  '114': 65,
  '115': 72,
  '116': 73,
  '117': 234,
  '118': 233,
  '119': 67,
  '120': 68,
  '121': 79,
  '122': 80,
  '123': 26,
  '124': 43,
  '125': 47,
  '126': 127,
  '127': 227,
  '128': 25,
  '129': 26,
  '130': 27,
  '131': 28,
  '132': 29,
  '133': 30,
  '134': 31,
  '135': 32,
  '136': 33,
  '137': 34,
  '138': 35,
  '139': 36,
  '140': 37,
  '141': 38,
  '142': 39,
  '143': 40,
  '144': 41,
  '145': 42,
  '146': 43,
  '147': 44,
  '148': 45,
  '149': 46,
  '150': 47,
  '151': 48,
  '152': 49,
  '153': 50,
  '154': 51,
  '155': 52,
  '156': 53,
  '157': 54,
  '158': 55,
  '159': 56,
  '160': 57,
  '161': 58,
  '162': 59,
  '163': 60,
  '164': 61,
  '165': 62,
  '166': 63,
  '167': 64,
  '168': 65,
  '169': 66,
  '170': 67,
  '171': 68,
  '172': 69,
  '173': 70,
  '174': 71,
  '175': 72,
  '176': 73,
  '177': 74,
  '178': 75,
  '179': 76,
  '180': 77,
  '181': 230,
  '182': 231,
  '183': 232,
  '184': 233,
  '185': 234,
  '186': 59,
  '187': 61,
  '188': 44,
  '189': 45,
  '190': 46,
  '191': 47,
  '192': 96,
  '219': 91,
  '220': 92,
  '221': 93,
  '222': 39
};

export const hljsCSS = `<style type="text/css">
pre code.hljs {
  display: block;
  overflow-x: auto;
  background: #fafafa;
}
code.hljs {
  padding: 3px 5px;
  font-family: Courier;
}
.hljs {
  color: #383a42;
  border-radius: 4px;
}
.hljs-comment,
.hljs-quote {
  color: #a0a1a7;
  font-style: italic;
}
.hljs-doctag,
.hljs-formula,
.hljs-keyword {
  color: #a626a4;
}
.hljs-deletion,
.hljs-name,
.hljs-section,
.hljs-selector-tag,
.hljs-subst {
  color: #e45649;
}
.hljs-literal {
  color: #0184bb;
}
.hljs-addition,
.hljs-attribute,
.hljs-meta .hljs-string,
.hljs-regexp,
.hljs-string {
  color: #50a14f;
}
.hljs-attr,
.hljs-number,
.hljs-selector-attr,
.hljs-selector-class,
.hljs-selector-pseudo,
.hljs-template-variable,
.hljs-type,
.hljs-variable {
  color: #986801;
}
.hljs-bullet,
.hljs-link,
.hljs-meta,
.hljs-selector-id,
.hljs-symbol,
.hljs-title {
  color: #4078f2;
}
.hljs-built_in,
.hljs-class .hljs-title,
.hljs-title.class_ {
  color: #c18401;
}
.hljs-emphasis {
  font-style: italic;
}
.hljs-strong {
  font-weight: 700;
}
.hljs-link {
  text-decoration: underline;
}
</style>`;
