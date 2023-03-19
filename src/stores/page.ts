import { defineStore } from "pinia"
import moment from 'moment'
import jsyaml from "js-yaml";
import he from "he";
import { parseExpression } from 'cron-parser'
import { decodeBase64, encodeBase64, formatCode } from "@/utils/formatter";
export const usePageStore = defineStore("page", {
    state: () => {
        const now = new Date()
        return {
            date: {
                unix: ~~(now.valueOf() / 1000),
                iso: now.toISOString(),
                timestamp: now.valueOf(),
                format: moment(now).format('YYYY-MM-DD HH:mm:ss'),
                now: now
            },
            number: {
                decimal: "",
                octal: "",
                hexadecimal: "",
                binary: ""
            },
            cron: {
                containSecond: true,
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
                encodeComponent: false
            },
            base64: {
                decoded: '',
                encoded: ''
            },
            jwt: {
                jwt: '',
                header: '',
                payload: ''
            }
        }
    },
    actions: {
        dataChange(date: Date) {
            this.date.unix = ~~(date.valueOf() / 1000)
            this.date.iso = date.toISOString()
            this.date.timestamp = date.valueOf()
            this.date.format = moment(date).format('YYYY-MM-DD HH:mm:ss')
            this.date.now = date
        },
        numberChange(number: number) {
            this.number.decimal = number.toString() || '0'
            this.number.octal = number.toString(8) || '0'
            this.number.hexadecimal = number.toString(16).toUpperCase() || '0'
            this.number.binary = number.toString(2) || '0'
        },
        cronChange() {
            const res = parseExpression(this.cron.expression)
            const result = []
            for (let i = 0; i < this.cron.count; i++) {
                result.push(moment(res.next().getTime()).format(this.cron.format))
            }
            this.cron.result = result.join('\n')
        },
        jsonChange(value: string) {
            try {
                this.json2yaml.json = value;
                this.json2yaml.yaml = value ? formatCode('yaml', jsyaml.dump(JSON.parse(value))) : '';
            } catch { }
        },
        yamlChange(value: string) {
            try {
                this.json2yaml.yaml = value;
                this.json2yaml.json = value ? formatCode('json', JSON.stringify(jsyaml.load(value))) : '';
            } catch { }
        },
        originalValueChange(value: string) {
            this.textdiff.originalValue = value;
        },
        modifiedValueChange(value: string) {
            this.textdiff.modifiedValue = value;
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
            this.url.text = this.url.encodeComponent ? encodeURIComponent(value) : encodeURI(value)
            console.log("jjjj", this.url.url, this.url.text)
        },
        urlTextChange(value: string) {
            if(value == this.url.text) return
            this.url.text = value;
            this.url.url = this.url.encodeComponent ? decodeURIComponent(value) : decodeURI(value)
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
            if(!value) value = ''
            this.jwt.jwt = value;
            const jwtArray = value.split('.')
            try {
                this.jwt.header = formatCode('json', decodeBase64(jwtArray[0]))
                this.jwt.payload = formatCode('json', decodeBase64(jwtArray[1]))
            } catch {
                this.jwt.header = ''
                this.jwt.payload = ''
            }
        }
    },
})
