<script setup lang="ts">
import { usePageStore } from '../stores/page'
import { useLanguageStore } from '../stores/language'
const { t } = useLanguageStore()
const page = usePageStore()
function toNow() {
  page.dataChange(new Date());
}
function onDateChange() {
  page.dataChange(new Date(page.date.format))
}
function onUnixChange() {
  page.dataChange(new Date(page.date.unix * 1000))
}
function onTimestampChange() {
  page.dataChange(new Date(parseInt(page.date.timestamp as any)))
}
</script>

<template>
  <el-form label-position="top" label-width="100px" style="max-width: 460px" class="dev-toys-date">
    <el-form-item :label="t('Date')">
      <!-- <el-input v-model="page.date.format" readonly style="flex: 1;margin-right: 10px"/> -->
      <el-date-picker v-model="page.date.format" type="datetime" style="flex: 1;margin-right: 10px"
        :default-time="page.date.now" @change="onDateChange"/>
      <el-button type="primary" plain @click="toNow">Now</el-button>
    </el-form-item>
    <el-form-item :label="t('Unix Time')">
      <el-input v-model="page.date.unix" type="number" @input="onUnixChange" />
    </el-form-item>
    <el-form-item :label="t('ISO 8601')">
      <el-input v-model="page.date.iso" />
    </el-form-item>
    <el-form-item label="Timestamp">
      <el-input v-model="page.date.timestamp" type="number" @input="onTimestampChange" />
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
