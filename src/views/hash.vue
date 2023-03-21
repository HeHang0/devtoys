<script setup lang="ts">
import Editor from "@/components/Editor.vue";
import SettingCard from '@/components/SettingCard.vue';
import { CopyDocument } from "@element-plus/icons-vue";
import { usePageStore } from "../stores/page";
import { useLanguageStore } from "../stores/language";
const page = usePageStore();
const { t } = useLanguageStore();
const copyText = (text: string) => navigator.clipboard.writeText(text)
</script>

<template>
  <div class="dev-toys-hash">
    <SettingCard :title="t('UpperCase')">
      <template #icon>
        <span class="dev-toys-icon">
          &#x132;
        </span>
      </template>
      <el-switch size="small" v-model="page.hash.upper" @change="page.hashUpperChange"/>
    </SettingCard>
    <div class="dev-toys-hash-editor">
      <Editor
        :value="page.hash.text"
        language="text"
        @delayInput="page.hashTextChange">
        <template #title> {{t('Text')}} </template>
      </Editor>
    </div>
    <el-form label-position="top" label-width="100px" class="dev-toys-hash-form">
      <el-form-item label="MD5">
        <el-input v-model="page.hash.md5" readonly />
        <el-button
          plain
          :icon="CopyDocument"
          @click="copyText(page.hash.md5)"
          :title="t('Copy')"
          style="margin-left: 12px"
        />
      </el-form-item>
      <el-form-item label="SHA1">
        <el-input v-model="page.hash.sha1" readonly />
        <el-button
          plain
          :icon="CopyDocument"
          @click="copyText(page.hash.md5)"
          :title="t('Copy')"
          style="margin-left: 12px"
        />
      </el-form-item>
      <el-form-item label="SHA256">
        <el-input v-model="page.hash.sha256" readonly />
        <el-button
          plain
          :icon="CopyDocument"
          @click="copyText(page.hash.md5)"
          :title="t('Copy')"
          style="margin-left: 12px"
        />
      </el-form-item>
      <el-form-item label="SHA512">
        <el-input v-model="page.hash.sha512" readonly />
        <el-button
          plain
          :icon="CopyDocument"
          @click="copyText(page.hash.md5)"
          :title="t('Copy')"
          style="margin-left: 12px"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="less" scoped>
.dev-toys-hash {
  display: flex;
  // justify-content: space-between;
  flex-direction: column;

  &-editor {
    height: 234px;
    width: 100%;
  }

  &-form {
    margin-top: 20px;
  }
}
</style>
<style lang="less">
.dev-toys-hash {
  .el-form-item__content {
    flex-wrap: nowrap;
  }
}
</style>