<script setup lang="ts">
import MonacoEditor from '@/components/MonacoEditor.vue';
import { usePageStore } from '../stores/page'
import { useLanguageStore } from '../stores/language'
const page = usePageStore()
const { t } = useLanguageStore();
</script>

<template>
  <el-row class="dev-toys-json2yaml">
    <el-col :span="12"><MonacoEditor :value="page.json2yaml.json" language="json" @change="page.jsonChange"/></el-col>
    <el-col :span="12"><MonacoEditor :value="page.json2yaml.yaml" language="yaml" @change="page.yamlChange"/></el-col>
  </el-row>
</template>

<style lang="less" scoped>
.dev-toys-json2yaml {
  height: calc(100vh - 80px);
}
</style>
