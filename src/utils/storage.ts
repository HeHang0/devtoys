export enum StorageKey {
    Language = "language",
    ShowAside = "show-aside",
    RememberRouter = "remember-router",
    LastRouter = "last-router"
}

function setValue<T>(key: string, value: T) {
    let result = `${value}`
    try {
        result = JSON.stringify(value);
    } catch { }
    localStorage.setItem("devtoys-" + key, result);
}

function getValue<T>(key: string, defaultValue?: T): T {
    const value = localStorage.getItem("devtoys-" + key) as any;
    if(value) {
        try {
            return JSON.parse(value as string);
        } catch { }
    }
    if(value == undefined && defaultValue) return defaultValue;
    return value;
}

function removeKey(key: string): any {
    localStorage.removeItem("devtoys-" + key);
}

export const storage = {
    setValue, getValue, removeKey
}