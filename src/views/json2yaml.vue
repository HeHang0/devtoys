<script setup lang="ts">
import MonacoEditor from '@/components/MonacoEditor.vue';
import { usePageStore } from '../stores/page'
import { useLanguageStore } from '../stores/language'
const page = usePageStore()
const { t } = useLanguageStore();
let changeTimeOut: any = null;
function jsonChange(value: string) {
  clearTimeout(changeTimeOut)
  changeTimeOut = setTimeout(page.jsonChange.bind(page, value), 200);
}
function yamlChange(value: string) {
  clearTimeout(changeTimeOut)
  changeTimeOut = setTimeout(page.yamlChange.bind(page, value), 200);
}
</script>

<template>
  <el-row class="dev-toys-json2yaml">
    <el-col :span="12"><MonacoEditor :value="page.json2yaml.json" language="json" @change="jsonChange"/></el-col>
    <el-col :span="12"><MonacoEditor :value="page.json2yaml.yaml" language="yaml" @change="yamlChange"/></el-col>
  </el-row>
</template>

<style lang="less" scoped>
.dev-toys-json2yaml {
  height: calc(100vh - 80px);
}
</style>
