import hljs from 'highlight.js';
import jsyaml from 'js-yaml';
import * as sqlFormatter from 'sql-formatter';
import xmlFormatter from 'xml-formatter';
import {
  Parser as NodeSqlParser,
  type AST,
  type Create
} from 'node-sql-parser';
const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();
const nodeSqlParser = new NodeSqlParser();

export const formattableLanguage = ['json', 'yaml', 'sql', 'xml'];

export interface StructBody {
  name: string;
  comment?: string;
  type:
    | 'string'
    | 'number'
    | 'bigint'
    | 'boolean'
    | 'object'
    | 'function'
    | 'date';
}

export interface Struct {
  name: string;
  body: StructBody[];
}

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

export function parseJsonStruct(text: string): Struct {
  try {
    const jsObject = JSON.parse(text);
    const columns: StructBody[] = [];
    Object.keys(jsObject).map(m => {
      const type: any = typeof jsObject[m];
      columns.push({
        name: m,
        type: type
      });
    });
    return { name: '', body: columns };
  } catch {}
  return { name: '', body: [] };
}

export function parseSqlStruct(text: string): Struct {
  const parserObj = nodeSqlParser.astify(text) as AST[];
  if (Array.isArray(parserObj) && parserObj.length > 0) {
    const sqlAst = parserObj[0] as Create;
    const name = (sqlAst.table && sqlAst.table[0].table) || '';
    const columns: StructBody[] = [];
    sqlAst.create_definitions?.map(m => {
      if (!m.column || !m.column.column) {
        return;
      }
      let type: any = 'string';
      switch (m.definition.dataType.toLowerCase()) {
        case 'bigint':
          type = 'bigint';
          break;
        case 'datetime':
        case 'date':
        case 'time':
          type = 'date';
          break;
        case 'varchar':
        case 'char':
          type = 'string';
          break;
        case 'int':
        case 'smallint':
        case 'integer':
        case 'float':
        case 'double':
        case 'bit':
          type = 'number';
          break;
        case 'bool':
        case 'boolean':
          type = 'boolean';
          break;
      }
      columns.push({
        name: m.column.column,
        comment: (m.comment && m.comment.value && m.comment.value.value) || '',
        type: type
      });
    });
    return {
      name,
      body: columns
    };
  }
  return { name: '', body: [] };
}

export function parseGolangText(jsObject: Struct) {
  let result = '';
  jsObject.body.map(m => {
    let goType = '';
    switch (m.type) {
      case 'number':
        goType = 'int';
        break;
      case 'string':
        goType = 'string';
        break;
      case 'boolean':
        goType = 'bool';
        break;
      case 'bigint':
        goType = 'int64';
        break;
      case 'date':
        goType = '*time.Time';
        break;
      case 'object':
        goType = 'Struct';
        break;
      case 'function':
        goType = 'func()';
        break;
      default:
        goType = '';
        break;
    }
    if (goType) {
      result += `    ${
        m.name.charAt(0).toUpperCase() + m.name.slice(1)
      } ${goType} \`json:"${m.name}"\``;
      if (m.comment) result += ' //' + m.comment;
      result += '\n';
    }
  });
  return `type ${jsObject.name || 'UnNamed'} struct {\n${result}}`;
}

export function parseJavaText(jsObject: Struct) {
  let result = '';
  jsObject.body.map(m => {
    let javaType = '';
    switch (m.type) {
      case 'number':
        javaType = 'int';
        break;
      case 'string':
        javaType = 'String';
        break;
      case 'boolean':
        javaType = 'boolean';
        break;
      case 'date':
        javaType = 'Date';
        break;
      case 'bigint':
        javaType = 'long';
        break;
      case 'object':
        javaType = 'Object';
        break;
      case 'function':
        javaType = 'void';
        break;
      default:
        javaType = '';
        break;
    }
    if (javaType) {
      result += `    private ${javaType} ${m.name};`;
      if (m.comment) result += ' //' + m.comment;
      result += '\n';
    }
  });
  return `public class ${jsObject.name || 'UnNamed'} {\n${result}}`;
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

export function highlightCode(code: string, language: string, pure?: boolean) {
  const highlightedCode = hljs.highlightAuto(
    code,
    language ? [language] : undefined
  );
  if (pure) {
    return {
      language: highlightedCode.language,
      value: highlightedCode.value
    };
  }
  // return highlightedCode.value;
  return `<pre><code class="hljs ${highlightedCode.language || ''}">${
    highlightedCode.value
  }</code></pre>`;
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

export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
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
