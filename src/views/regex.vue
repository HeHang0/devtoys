<script setup lang="ts">
import { usePageStore } from '../stores/page';
import { useLanguageStore } from '../stores/language';
import Editor from '@/components/Editor.vue';
import Title from '@/components/Title.vue';
const page = usePageStore();
const { t } = useLanguageStore();
</script>

<template>
  <div class="devtoys-regex">
    <div class="devtoys-regex-item">
      <Title>
        <template #title>
          {{ t('Regular expression') }}
        </template>
      </Title>
      <el-input v-model="page.regex.pattern" @change="page.regexChange" />
    </div>
    <Editor
      class="devtoys-regex-item"
      v-model:value="page.regex.text"
      style="height: 369px"
      @delay-input="page.regexChange">
      <template #title> {{ t('Text') }} </template>
    </Editor>
    <Title v-if="page.regex.result.length > 0">
      <template #title>
        {{ t('Result') }}
      </template>
    </Title>
    <div
      v-if="page.regex.result.length > 0"
      class="devtoys-regex-result devtoys-regex-item">
      <div v-for="(item, i) in page.regex.result" :key="i">
        <p>{{ item.text }}</p>
        <p
          class="devtoys-regex-result-sub"
          v-for="(sub, n) in item.sub"
          :key="n">
          {{ sub }}
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.devtoys-regex {
  &-item {
    margin-bottom: 10px;
  }
  &-result {
    padding: 5px 10px;
    background-color: var(--el-input-bg-color, var(--el-fill-color-blank));
    border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
    box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color))
      inset;
    &-sub {
      text-indent: 2em;
    }
  }
}
</style>
