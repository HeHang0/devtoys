<script setup lang="ts">
import Editor from '@/components/Editor.vue';
import { usePageStore } from '../stores/page';
import { useLanguageStore } from '../stores/language';
import { CapitalizationType } from '@/utils/formatter';
const page = usePageStore();
const { t } = useLanguageStore();
const capitalizationTypes = Object.keys(CapitalizationType);
console.log('哈哈哈', Object(CapitalizationType), page.capitalization.type);
</script>

<template>
  <div class="devtoys-capitalization">
    <div class="devtoys-capitalization-types">
      <el-button
        v-for="typ in capitalizationTypes"
        :key="typ"
        plain
        :class="
          page.capitalization.type === Object(CapitalizationType)[typ]
            ? 'focus'
            : ''
        "
        @click="page.capitalizationTypeChange(Object(CapitalizationType)[typ])">
        {{ t(typ) }} ({{ Object(CapitalizationType)[typ] }})
      </el-button>
    </div>
    <div class="devtoys-capitalization-editor">
      <Editor
        v-model:value="page.capitalization.input"
        @delayInput="page.capitalizationChange">
        <template #title> {{ t('Input') }} </template>
      </Editor>
      <Editor :value="page.capitalization.output" :readonly="true">
        <template #title> {{ t('Output') }} </template>
      </Editor>
    </div>
  </div>
</template>

<style lang="less" scoped>
.devtoys-capitalization {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;

  &-types {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    button {
      margin: 0 0 12px 0;
      &.focus {
        color: var(--el-button-hover-text-color);
        border-color: var(--el-button-hover-border-color);
        background-color: var(--el-button-hover-bg-color);
        outline: 0;
      }
    }
  }

  &-editor {
    width: 100%;
    display: flex;
    justify-content: space-between;
    & > div {
      width: calc(50% - 5px);
      height: 100%;
    }
  }

  @media (max-width: 850px) {
    &-editor {
      flex-direction: column;
      & > div {
        height: 369px;
        width: 100%;
      }
    }
  }
}
</style>
