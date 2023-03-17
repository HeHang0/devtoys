<script setup lang="ts">
import { usePageStore } from '../stores/page'
import { useLanguageStore } from '../stores/language'
import { onMounted } from 'vue';
const page = usePageStore()
const { t } = useLanguageStore();

onMounted(() => {
    page.cronChange()
})

const formatterCron = (value: string) => value.replace(/[^\s\*\d]/g, '')
</script>

<template>
    <el-form label-position="top" label-width="100px" style="max-width: 460px" class="dev-toys-date">
        <!-- <el-form-item :label="t('Cron Mode Contain Second(6 paragraphs)')">
            <el-switch v-model="page.cron.containSecond" />
        </el-form-item> -->
        <el-form-item :label="t('Number of Next Scheduled Dates')">
            <el-input v-model="page.cron.count" type="number" @input="page.cronChange"/>
        </el-form-item>
        <el-form-item :label="t('Output Formatter')">
            <el-input v-model="page.cron.format" @input="page.cronChange" />
        </el-form-item>
        <el-form-item :label="t('Cron Expression to parse')">
            <el-input v-model="page.cron.expression" :formatter="formatterCron" @input="page.cronChange" />
        </el-form-item>
        <el-form-item :label="t('Next Scheduled Dates')">
            <el-input v-model="page.cron.result" type="textarea" :autosize="{ minRows: 6 }" readonly />
        </el-form-item>
    </el-form>
</template>

<style scoped></style>
