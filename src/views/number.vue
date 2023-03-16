<script setup lang="ts">
import { usePageStore } from '../stores/page'
const page = usePageStore()
const maxInt = 2**53
function tryParseInt(num: string, radix?: number, defautValue?: number) {
  try {
    let result = parseInt(num.replace(/[,\s]/g, ''), radix) || defautValue || 0
    return result > maxInt ? maxInt : result;
  } catch {
    return defautValue || 0
  }
}
function onDecimalChange() {
  page.numberChange(tryParseInt(page.number.decimal));
}
function onHexChange() {
  page.numberChange(tryParseInt(page.number.hexadecimal,16))
}
function onOctalChange() {
  page.numberChange(tryParseInt(page.number.octal,8))
}
function onBinarayChange() {
  page.numberChange(tryParseInt(page.number.binary,2))
}
const formatterDecimal = (value: string) => value.replace(/[^0-9]/g, '')
const formatterHex = (value: string) => value.replace(/[^0-9A-Fa-f]/g, '')
const formatterOctal = (value: string) => value.replace(/[^0-7]/g, '')
const formatterBinary = (value: string) => value.replace(/[^0-1]/g, '')
</script>

<template>
  <el-form label-position="top" label-width="100px" style="max-width: 460px" class="dev-toys-date">
    <el-form-item label="十进制">
      <el-input v-model="page.number.decimal" :formatter="formatterDecimal" @input="onDecimalChange" />
    </el-form-item>
    <el-form-item label="十六进制">
      <el-input v-model="page.number.hexadecimal" :formatter="formatterHex" @input="onHexChange" />
    </el-form-item>
    <el-form-item label="八进制">
      <el-input v-model="page.number.octal" :formatter="formatterOctal" @input="onOctalChange" />
    </el-form-item>
    <el-form-item label="二进制">
      <el-input v-model="page.number.binary" :formatter="formatterBinary" @input="onBinarayChange" />
    </el-form-item>
  </el-form>
</template>

<style>
.dev-toys-date .el-input__wrapper {
  width: 100%;
}

.dev-toys-date .el-input__suffix {
  display: none;
}
</style>
