export enum StorageKey {
    Language = "language",
    ShowAside = "show-aside",
    RememberRouter = "remember-router",
    LastRouter = "last-router",
    AppTheme = "app-theme",
    FontFamily = "font-family",
    FavoriteRouters = "favorite-routers",
    UrlEncodeComponent = "url-encode-component",
    HashUpperCase = "hash-upper-case",
    UuidHyphen = "uuid-hyphen",
    UuidUpperCase = "uuid-upper-case",
    UuidCount = "uuid-count",
    LigenTopic = "ligen-topic",
    CheckSumUpperCase = "checksum-upper-case",
    CheckSumAlgorithm = "checksum-algorithm",
    QRCodeLevel = "qrcode-level",
    QRCodeReaderType = "qrcode-reader-type",
    RouterHistory = "router-history"
}

function setValue<T>(key: string, value: T) {
    let result = `${value}`
    try {
        result = JSON.stringify(value);
    } catch { }
    localStorage.setItem("devtoys-" + key, result);
}

function getValue<T>(key: string, defaultValue?: T, type?: string): T {
    const value = localStorage.getItem("devtoys-" + key) as any;
    let result = value;
    if(value) {
        try {
            result = JSON.parse(value as string);
        } catch { }
    }
    if((value == undefined && defaultValue) || (type && typeof result !== type)) result = defaultValue;
    return value;
}

function removeKey(key: string): any {
    localStorage.removeItem("devtoys-" + key);
}

export const storage = {
    setValue, getValue, removeKey
}