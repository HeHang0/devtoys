import hljs from 'highlight.js';
import jsyaml from 'js-yaml';
import * as sqlFormatter from 'sql-formatter';
import xmlFormatter from 'xml-formatter';
const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

export function formatCode(
  language: string,
  code: string,
  tabSize?: number,
  insertSpaces?: boolean
): string {
  if (!code || typeof code !== 'string') return '';
  if (!tabSize) tabSize = 4;
  try {
    switch (language) {
      case 'json':
        return JSON.stringify(JSON.parse(code), null, tabSize);
      case 'yaml':
        return jsyaml.dump(jsyaml.load(code), { indent: tabSize });
      case 'sql':
        return sqlFormatter.format(code, { tabWidth: tabSize });
      case 'xml':
        return xmlFormatter(code);
    }
  } catch (error) {
    console.error('format code err', error);
  }
  return code;
}

export function uglifyCode(language: string, code: string): string {
  if (!code || typeof code !== 'string') '';
  try {
    switch (language) {
      case 'json':
        return minify(code);
      // case "sql":
      //     return sqlFormatter.format(code)
      case 'xml':
        return xmlFormatter.minify(code, {
          collapseContent: true
        });
    }
  } catch (error) {
    console.error('uglify code err', error);
  }
  return code;
}

export function highlightCode(code: string, language: string) {
  const highlightedCode = hljs.highlightAuto(
    code,
    language ? [language] : undefined
  );
  return `<pre><code class="hljs ${highlightedCode.language}">${highlightedCode.value}</code></pre>`;
}

export function encodeBase64(text: string) {
  const encodedData = textEncoder.encode(text);
  return btoa(String.fromCharCode.apply(null, Array.from(encodedData)));
}

export function decodeBase64(text: string) {
  const decodedData = atob(text);
  const uint8Array = new Uint8Array(decodedData.length);
  for (let i = 0; i < decodedData.length; i++) {
    uint8Array[i] = decodedData.charCodeAt(i);
  }

  const decodedString = textDecoder.decode(uint8Array);
  return decodedString;
}

export function escapeString(input: string) {
  return input.replace(/[\\'"\r\n]/g, function (match) {
    switch (match) {
      case '\\':
        return '\\\\';
      case "'":
        return "\\'";
      case '"':
        return '\\"';
      case '\r':
        return '\\r';
      case '\n':
        return '\\n';
      default:
        return match;
    }
  });
}

export function unescapeString(input: string) {
  return input
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\'/g, "'")
    .replace(/\\"/g, '"');
}

export enum CapitalizationType {
  SentenceCase = 'Sentence case',
  LowerCase = 'lower case',
  UpperCaseInspect = 'UPPER CASE',
  TitleCase = 'Title Case',
  CamelCase = 'camelCase',
  PascalCase = 'PascalCase',
  SnakeCase = 'snake_case',
  ConstantCase = 'CONSTANT_CASE',
  KebabCase = 'kebab-case',
  CobolCase = 'COBOL-CASE',
  TrailCase = 'Trail-Case',
  AlterNatingCase = 'aLtErNaTiNg cAsE',
  InverseCase = 'InVeRsE CaSe'
}

export function capitalizationText(
  text: string,
  capitalizationType: CapitalizationType
) {
  switch (capitalizationType) {
    case CapitalizationType.SentenceCase:
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    case CapitalizationType.LowerCase:
      return text.toLowerCase();
    case CapitalizationType.UpperCaseInspect:
      return text.toUpperCase();
    case CapitalizationType.TitleCase:
      return text
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    case CapitalizationType.CamelCase:
      return text
        .split(' ')
        .map((word, index) =>
          index === 0
            ? word.toLowerCase()
            : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join('');
    case CapitalizationType.PascalCase:
      return text
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join('');
    case CapitalizationType.SnakeCase:
      return text.toLowerCase().replace(/ /g, '_');
    case CapitalizationType.ConstantCase:
      return text.toUpperCase().replace(/ /g, '_');
    case CapitalizationType.KebabCase:
      return text.toLowerCase().replace(/ /g, '-');
    case CapitalizationType.CobolCase:
      return text.toUpperCase().replace(/ /g, '-');
    case CapitalizationType.TrailCase:
      return text
        .split(' ')
        .map(
          word =>
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() + '-'
        )
        .join('')
        .slice(0, -1);
    case CapitalizationType.AlterNatingCase:
      return text
        .split('')
        .map((char, index) =>
          index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
        )
        .join('');
    case CapitalizationType.InverseCase:
      return text
        .split('')
        .map((char, index) =>
          index % 2 !== 0 ? char.toLowerCase() : char.toUpperCase()
        )
        .join('');
    default:
      return text;
  }
}

function minify(json: string) {
  var tokenizer = /"|(\/\*)|(\*\/)|(\/\/)|\n|\r|\[|]/g,
    in_string = false,
    in_multiline_comment = false,
    in_singleline_comment = false,
    tmp,
    tmp2,
    new_str = [],
    ns = 0,
    from = 0,
    lc,
    rc,
    prevFrom;

  tokenizer.lastIndex = 0;

  while ((tmp = tokenizer.exec(json))) {
    lc = RegExp.leftContext;
    rc = RegExp.rightContext;
    if (!in_multiline_comment && !in_singleline_comment) {
      tmp2 = lc.substring(from);
      if (!in_string) {
        tmp2 = tmp2.replace(/(\n|\r|\s)*/g, '');
      }
      new_str[ns++] = tmp2;
    }
    prevFrom = from;
    from = tokenizer.lastIndex;

    // found a " character, and we're not currently in
    // a comment? check for previous `\` escaping immediately
    // leftward adjacent to this match
    if (tmp[0] === '"' && !in_multiline_comment && !in_singleline_comment) {
      // limit left-context matching to only go back
      // to the position of the last token match
      //
      // see: https://github.com/getify/JSON.minify/issues/64
      // lc.lastIndex = prevFrom;

      // perform leftward adjacent escaping match
      tmp2 = lc.match(/(\\)*$/);
      // start of string with ", or unescaped " character found to end string?
      if (!in_string || !tmp2 || tmp2[0].length % 2 === 0) {
        in_string = !in_string;
      }
      from--; // include " character in next catch
      rc = json.substring(from);
    } else if (
      tmp[0] === '/*' &&
      !in_string &&
      !in_multiline_comment &&
      !in_singleline_comment
    ) {
      in_multiline_comment = true;
    } else if (
      tmp[0] === '*/' &&
      !in_string &&
      in_multiline_comment &&
      !in_singleline_comment
    ) {
      in_multiline_comment = false;
    } else if (
      tmp[0] === '//' &&
      !in_string &&
      !in_multiline_comment &&
      !in_singleline_comment
    ) {
      in_singleline_comment = true;
    } else if (
      (tmp[0] === '\n' || tmp[0] === '\r') &&
      !in_string &&
      !in_multiline_comment &&
      in_singleline_comment
    ) {
      in_singleline_comment = false;
    } else if (
      !in_multiline_comment &&
      !in_singleline_comment &&
      !/\n|\r|\s/.test(tmp[0])
    ) {
      new_str[ns++] = tmp[0];
    }
  }
  new_str[ns++] = rc;
  return new_str.join('');
}
