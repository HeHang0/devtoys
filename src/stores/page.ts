import { defineStore } from 'pinia';
import moment from 'moment';
import jsyaml from 'js-yaml';
import he from 'he';
import crypto from 'crypto-js';
import { parseExpression } from 'cron-parser';
import {
  capitalizationText,
  CapitalizationType,
  decodeBase64,
  encodeBase64,
  escapeString,
  formatCode,
  unescapeString
} from '@/utils/formatter';
import { storage, StorageKey } from '@/utils/storage';
import {
  ChecksumAlgorithm,
  checksumFile,
  contrast,
  guid2,
  ImageType
} from '@/utils/utils';
import { generateArticle } from '@/utils/ligen';

export enum FileReaderType {
  File = 'file',
  Camera = 'camera',
  Clipboard = 'clipboard'
}

export const usePageStore = defineStore('page', {
  state: () => {
    const now = new Date();
    return {
      fileReaderType: storage.getValue(
        StorageKey.FileReaderType,
        FileReaderType.File
      ),
      date: {
        unix: ~~(now.valueOf() / 1000),
        iso: now.toISOString(),
        timestamp: now.valueOf(),
        format: moment(now).format('YYYY-MM-DD HH:mm:ss'),
        now: now
      },
      number: {
        decimal: '',
        octal: '',
        hexadecimal: '',
        binary: ''
      },
      cron: {
        count: 5,
        format: 'yyyy-MM-DD dddd HH:mm:ss',
        expression: '* * * * * *',
        result: ''
      },
      json2yaml: {
        json: '',
        yaml: ''
      },
      textdiff: {
        originalValue: '',
        modifiedValue: ''
      },
      formatter: {
        text: ''
      },
      html: {
        html: '',
        text: ''
      },
      url: {
        url: '',
        text: '',
        encodeComponent: storage.getValue(StorageKey.UrlEncodeComponent, false)
      },
      base64: {
        decoded: '',
        encoded: ''
      },
      base64img: {
        text: '',
        image: ''
      },
      jwt: {
        jwt: '',
        header: '',
        payload: ''
      },
      hash: {
        upper: storage.getValue(StorageKey.HashUpperCase, false),
        text: '',
        md5: '',
        sha1: '',
        sha256: '',
        sha512: ''
      },
      uuid: {
        hyphen: storage.getValue(StorageKey.UuidHyphen, true),
        upper: storage.getValue(StorageKey.UuidUpperCase, false),
        count: storage.getValue(StorageKey.UuidCount, 5),
        text: ''
      },
      ligen: {
        topic: storage.getValue(StorageKey.LigenTopic, '一个开发者工具箱📦'),
        article: ''
      },
      checksum: {
        upper: storage.getValue(StorageKey.CheckSumUpperCase, false),
        algorithm: storage.getValue(
          StorageKey.CheckSumAlgorithm,
          ChecksumAlgorithm.Md5
        )
      },
      qrcode: {
        level: storage.getValue(StorageKey.QRCodeLevel, 'M'),
        text: ''
      },
      rqrcode: {
        text: ''
      },
      image: {
        quality: storage.getValue(StorageKey.ImageQuality, 1),
        convertType: storage.getValue(StorageKey.ImageType, ImageType.Png)
      },
      markdown: {
        text: '',
        previewHtmlContent: ''
      },
      color: {
        color: '#FFFFFF',
        background: '#000000',
        contrast: '1',
        opacity: 1
      },
      regex: {
        pattern: '',
        text: '',
        result: new Array<any>()
      },
      escape: {
        text: 'DevToys - A "Swiss Army knife" for developers',
        result: 'DevToys - A \\"Swiss Army knife\\" for developers',
        escape: true
      },
      capitalization: {
        input: 'DevToys - A Swiss Army knife for developers',
        output: 'Devtoys - a swiss army knife for developers',
        type: CapitalizationType.SentenceCase
      }
    };
  },
  actions: {
    dataChange(date: Date) {
      this.date.unix = ~~(date.valueOf() / 1000);
      this.date.iso = date.toISOString();
      this.date.timestamp = date.valueOf();
      this.date.format = moment(date).format('YYYY-MM-DD HH:mm:ss');
      this.date.now = date;
    },
    numberChange(number: number) {
      this.number.decimal = number.toString() || '0';
      this.number.octal = number.toString(8) || '0';
      this.number.hexadecimal = number.toString(16).toUpperCase() || '0';
      this.number.binary = number.toString(2) || '0';
    },
    cronChange() {
      const res = parseExpression(this.cron.expression);
      const result = [];
      for (let i = 0; i < this.cron.count; i++) {
        result.push(moment(res.next().getTime()).format(this.cron.format));
      }
      this.cron.result = result.join('\n');
    },
    jsonChange(value: string) {
      try {
        this.json2yaml.json = value;
        this.json2yaml.yaml = value.trim()
          ? formatCode('yaml', jsyaml.dump(JSON.parse(value)))
          : '';
      } catch {}
    },
    yamlChange(value: string) {
      try {
        this.json2yaml.yaml = value;
        this.json2yaml.json = value.trim()
          ? formatCode('json', JSON.stringify(jsyaml.load(value)))
          : '';
      } catch {}
    },
    formatterTextChange(value: string, language: string) {
      this.formatter.text = formatCode(language, value);
    },
    htmlChange(value: string) {
      this.html.html = value;
      this.html.text = he.encode(value);
    },
    textChange(value: string) {
      this.html.text = value;
      this.html.html = he.decode(value);
    },
    urlChange(value: string) {
      this.url.url = value;
      this.url.text = this.url.encodeComponent
        ? encodeURIComponent(value)
        : encodeURI(value);
      storage.setValue(StorageKey.UrlEncodeComponent, this.url.encodeComponent);
    },
    urlTextChange(value: string) {
      if (value == this.url.text) return;
      this.url.text = value;
      this.url.url = this.url.encodeComponent
        ? decodeURIComponent(value)
        : decodeURI(value);
    },
    base64DecodedChange(value: string) {
      this.base64.decoded = value;
      this.base64.encoded = encodeBase64(value);
    },
    base64EncodedChange(value: string) {
      this.base64.encoded = value;
      this.base64.decoded = decodeBase64(value);
    },
    jwtChange(value: string) {
      if (!value) value = '';
      this.jwt.jwt = value;
      const jwtArray = value.split('.');
      try {
        this.jwt.header = formatCode('json', decodeBase64(jwtArray[0]));
        this.jwt.payload = formatCode('json', decodeBase64(jwtArray[1]));
      } catch {
        this.jwt.header = '';
        this.jwt.payload = '';
      }
    },
    hashUpperChange() {
      const toCase = this.hash.upper ? 'toUpperCase' : 'toLowerCase';
      storage.setValue(StorageKey.HashUpperCase, this.hash.upper);
      this.hash.md5 = this.hash.md5[toCase]();
      this.hash.sha1 = this.hash.sha1[toCase]();
      this.hash.sha256 = this.hash.sha256[toCase]();
      this.hash.sha512 = this.hash.sha512[toCase]();
    },
    hashTextChange(value: string) {
      this.hash.text = value;
      const toCase = this.hash.upper ? 'toUpperCase' : 'toLowerCase';
      this.hash.md5 = crypto.MD5(value).toString()[toCase]();
      this.hash.sha1 = crypto.SHA1(value).toString()[toCase]();
      this.hash.sha256 = crypto.SHA256(value).toString()[toCase]();
      this.hash.sha512 = crypto.SHA512(value).toString()[toCase]();
    },
    generateUuid() {
      storage.setValue(StorageKey.UuidHyphen, this.uuid.hyphen);
      storage.setValue(StorageKey.UuidUpperCase, this.uuid.upper);
      storage.setValue(StorageKey.UuidCount, this.uuid.count);
      let text = !this.uuid.text || this.uuid.text.endsWith('\n') ? '' : '\n';
      for (let i = 0; i < this.uuid.count; i++) {
        text += guid2(this.uuid.hyphen, this.uuid.upper);
        text += '\n';
      }
      this.uuid.text += text;
    },
    generateLigen() {
      storage.setValue(StorageKey.LigenTopic, this.ligen.topic);
      this.ligen.article = generateArticle(this.ligen.topic);
    },
    checksumFile(file: File) {
      storage.setValue(StorageKey.CheckSumAlgorithm, this.checksum.algorithm);
      return checksumFile(file, this.checksum.algorithm);
    },
    checksumUpperChange() {
      storage.setValue(StorageKey.CheckSumUpperCase, this.checksum.upper);
    },
    qrcodeLevelChange() {
      storage.setValue(StorageKey.QRCodeLevel, this.qrcode.level);
    },
    fileReaderTypeChange() {
      storage.setValue(StorageKey.FileReaderType, this.fileReaderType);
    },
    colorChange(color: string, background: string) {
      this.color.color = color;
      this.color.background = background;
      const colorContrast = contrast(color, background);
      this.color.contrast = colorContrast.toFixed(2);
      const success = colorContrast >= 3 && colorContrast <= 7;
      if (success) this.color.opacity = 1;
      else if (colorContrast < 3) this.color.opacity = (colorContrast - 1) / 2;
      else if (colorContrast > 7)
        this.color.opacity = 1 - (colorContrast - 7) / 14;
      else this.color.opacity = 0;
    },
    regexChange() {
      this.regex.result.splice(0, this.regex.result.length);
      try {
        const regex = new RegExp(this.regex.pattern, 'g');
        const text = this.regex.text;
        // if (!regex.test(text)) {
        //   return;
        // }
        let lastIndex = -1;
        for (;;) {
          const r = regex.exec(text);
          if (!r || lastIndex === r.index) break;
          lastIndex = r.index;
          this.regex.result.push({
            text: r[0],
            sub: r.slice(1),
            groups: r.groups,
            index: r.index
          });
        }
      } catch {}
      if (
        this.regex.result.length === 1 &&
        !this.regex.result[0].text &&
        !this.regex.result[0].index
      ) {
        this.regex.result.splice(0, this.regex.result.length);
      }
    },
    escapeChange() {
      if (this.escape.escape) {
        this.escape.result = escapeString(this.escape.text);
      } else {
        this.escape.result = unescapeString(this.escape.text);
      }
    },
    escapeSwitch() {
      const tmp = this.escape.text;
      this.escape.text = this.escape.result;
      this.escape.result = tmp;
    },
    capitalizationChange() {
      this.capitalization.output = capitalizationText(
        this.capitalization.input,
        this.capitalization.type
      );
    },
    capitalizationTypeChange(typ: CapitalizationType) {
      this.capitalization.type = typ;
      this.capitalizationChange();
    }
  }
});
