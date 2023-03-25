<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { useLanguageStore } from '../stores/language';
import { KeyCode2Android, KeyCode2IOS } from '@/utils/utils';
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
    <el-form
      label-position="top"
      label-width="100px"
      class="devtoys-keycode-input">
      <el-form-item :label="t('Keys')">
        <el-input
          v-model="inputKeycode"
          @change="inputKeycode = ''"
          readonly
          @keydown.prevent="keyDown" />
      </el-form-item>
      <el-form-item label="Html">
        <el-button plain>
          {{ keyCode }}
        </el-button>
      </el-form-item>
      <el-form-item label="Android">
        <el-button plain>
          {{ KeyCode2Android[keyCode] || '' }}
        </el-button>
      </el-form-item>
      <el-form-item label="IOS">
        <el-button plain>
          {{ KeyCode2IOS[keyCode] || '' }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="less" scoped>
.devtoys-keycode {
  &-input {
    button {
      width: 120px;
    }
  }
}
</style>
