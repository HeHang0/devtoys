import { defineStore } from "pinia"
import moment from 'moment'
import { parseExpression } from 'cron-parser'
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
        }
    },
})
