<script setup lang="ts">
import Editor from "@/components/Editor.vue";
import SettingCard from '@/components/SettingCard.vue';
import { CopyDocument, Close } from "@element-plus/icons-vue";
import { usePageStore } from "../stores/page";
import { useLanguageStore } from "../stores/language";
const page = usePageStore();
const { t } = useLanguageStore();
const copyText = () => navigator.clipboard.writeText(page.uuid.text)
function countInput() {
  if(!(page.uuid.count > 0)) page.uuid.count = 3
}
</script>

<template>
  <div class="devtoys-uuid">
    <SettingCard :title="t('Hyphens')">
      <template #icon>
        <span class="devtoys-icon">
          &#x132;
        </span>
      </template>
      <el-switch size="small" v-model="page.uuid.hyphen"/>
    </SettingCard>
    <SettingCard :title="t('UpperCase')">
      <template #icon>
        <span class="devtoys-icon">
          &#x132;
        </span>
      </template>
      <el-switch size="small" v-model="page.uuid.upper"/>
    </SettingCard>
    <div class="devtoys-uuid-generate">
      <el-button type="primary" @click="page.generateUuid">
        {{ t('Generate UUIDs') }}
      </el-button>
      <span>x</span>
      <el-input v-model="page.uuid.count" type="number" @input="countInput"/>
    </div>
    <div class="devtoys-uuid-editor">
      <Editor
        :value="page.uuid.text"
        :readonly="true"
        language="text">
        <template #operate>
          <el-button
            plain
            :icon="CopyDocument"
            @click="copyText"
            :title="t('Copy')"
            size="small"
            style="margin-left: 12px"
          />
          <el-button
            plain
            :icon="Close"
            @click="page.uuid.text=''"
            :title="t('Clear')"
            size="small"
            style="margin-left: 12px"
          />
        </template>
      </Editor>
    </div>
  </div>
</template>

<style lang="less" scoped>
.devtoys-uuid {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  // justify-content: space-between;
  flex-direction: column;

  &-editor {
    flex: 1;
    width: 100%;
    margin-top: 20px;
  }
  &-generate {
    display: flex;
    align-items: center;
    .el-input {
      flex: 1
    }
    span {
      margin: 0 20px;
    }
  }
}
</style>