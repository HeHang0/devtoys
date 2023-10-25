export enum StorageKey {
  Language = 'language',
  ShowAside = 'show-aside',
  RememberRouter = 'remember-router',
  ImageProxy = 'image-proxy',
  AppTheme = 'app-theme',
  FontFamily = 'font-family',
  FavoriteRouters = 'favorite-routers',
  UrlEncodeComponent = 'url-encode-component',
  HashUpperCase = 'hash-upper-case',
  UuidHyphen = 'uuid-hyphen',
  UuidUpperCase = 'uuid-upper-case',
  UuidCount = 'uuid-count',
  LigenTopic = 'ligen-topic',
  CheckSumUpperCase = 'checksum-upper-case',
  CheckSumAlgorithm = 'checksum-algorithm',
  QRCodeLevel = 'qrcode-level',
  QRCodeReaderType = 'qrcode-reader-type',
  ImageReaderType = 'image-reader-type',
  FileReaderType = 'file-reader-type',
  ImageType = 'image-type',
  TextReplaceType = 'text-replace-type',
  ImageQuality = 'image-quality',
  RouterHistory = 'router-history',
  EditorType = 'editor-type',
  EditorWrap = 'editor-wrap',
  SplitSize = 'split-size'
}

function setValue<T>(key: string, value: T) {
  let result = `${value}`;
  try {
    result = JSON.stringify(value);
  } catch {}
  localStorage.setItem('devtoys-' + key, result);
}

function getValue<T>(key: string, defaultValue?: T, type?: string): T {
  const value = localStorage.getItem('devtoys-' + key) as any;
  let result = value;
  if (value) {
    try {
      result = JSON.parse(value as string);
    } catch {}
  }
  if ((value == undefined && defaultValue) || (type && typeof result !== type))
    result = defaultValue;
  return result;
}

function removeKey(key: string): any {
  localStorage.removeItem('devtoys-' + key);
}

export const storage = {
  setValue,
  getValue,
  removeKey
};
