export enum StorageKey {
    Language = "language",
    ShowAside = "show-aside"
}

function setValue(key: string, value: any) {
    try {
        value = JSON.stringify(value);
    } catch { }
    localStorage.setItem("devtoys-" + key, value);
}

function getValue(key: string, defaultValue?: any): any {
    const value = localStorage.getItem("devtoys-" + key);
    if(value) {
        try {
            return JSON.parse(value as string);
        } catch { }
    }
    if(value == undefined) return defaultValue;
    return value;
}

export const storage = {
    setValue, getValue
}