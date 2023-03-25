<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { useLanguageStore } from '../stores/language';
const { t } = useLanguageStore();
const inputKeycode = ref('');
const keyCode: Ref<string | number> = ref('');

function keyDown(e: KeyboardEvent) {
  inputKeycode.value = `${e.key} | ${e.code}`;
  keyCode.value = e.keyCode;
}
</script>

<template>
  <div class="devtoys-keycode">
    <div class="devtoys-keycode-input">
      <span>{{ t('Keys') }}&nbsp;&nbsp;</span>
      <el-input
        v-model="inputKeycode"
        @change="inputKeycode = ''"
        readonly
        @keydown.prevent="keyDown" />
      <el-button plain>
        {{ keyCode }}
      </el-button>
    </div>
    <div class="devtoys-keycode-editor"></div>
  </div>
</template>

<style lang="less" scoped>
.devtoys-keycode {
  &-input {
    display: flex;
    align-items: center;
    & > .el-input {
      flex: 1;
    }
    button {
      margin-left: 20px;
      width: 84px;
    }
  }
}
</style>
