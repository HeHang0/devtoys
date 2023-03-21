<script setup lang="ts">
import { ref } from "vue";
import QRCode from 'qrcode'
import Editor from "@/components/Editor.vue";
import SettingCard from "@/components/SettingCard.vue";
import { Share, Operation } from "@element-plus/icons-vue";
import { usePageStore } from "../stores/page";
import { useLanguageStore } from "../stores/language";
const page = usePageStore();
const imageUrl = ref('')
const { t } = useLanguageStore();
let changeTimeOut: any = null;
function qrcodeGenerate() {
  const option: QRCode.QRCodeToDataURLOptions = {
    errorCorrectionLevel: page.qrcode.level as QRCode.QRCodeErrorCorrectionLevel
  }
  QRCode.toDataURL(page.qrcode.text, option, (e, url) => {
      imageUrl.value = url;
  })
}
function qrcodeChange(value: string) {
  clearTimeout(changeTimeOut);
  if(!value) {
    imageUrl.value = "";
    return;
  }
  changeTimeOut = setTimeout(qrcodeGenerate, 400);
}
function exportPicture() {
  if(!imageUrl.value) return;
  var alink = document.createElement("a");
  alink.href = imageUrl.value;
  alink.download = "qrcode.png";
  alink.click();
  alink.remove()
}
</script>

<template>
  <div class="dev-toys-qrcode">
    <SettingCard :title="t('Correction Level')">
      <template #icon>
        <el-icon><Operation /></el-icon>
      </template>
      <el-select v-model="page.qrcode.level" size="small" @change="page.qrcodeLevelChange">
        <el-option :label="t('High')" value="H" />
        <el-option :label="t('Default')" value="Q" />
        <el-option :label="t('Medium')" value="M" />
        <el-option :label="t('Low')" value="L" />
      </el-select>
    </SettingCard>
    <div class="dev-toys-qrcode-editor">
      <Editor
        v-model:value="page.qrcode.text"
        language="text"
        @delayInput="qrcodeChange"
      >
        <template #title> {{ t("Text") }} </template>
      </Editor>
    </div>
    <Title>
      <template #title>
        {{ t('QR Code') }}
      </template>
        <el-button
          plain
          :icon="Share"
          @click="exportPicture"
          size="small"
          :title="t('Export')"
          style="margin-left: 12px"
        />
    </Title>
    <div class="dev-toys-qrcode-image">
      <img v-if="imageUrl" :src="imageUrl"/>
    </div>
  </div>
</template>

<style lang="less" scoped>
.dev-toys-qrcode {
  display: flex;
  // justify-content: space-between;
  flex-direction: column;

  &-editor {
    height: 234px;
    width: 100%;
  }

  &-image {
    width: 100%;
    img {
      max-width: 369px;
    }
  }

  &-form {
    margin-top: 20px;
  }
}
</style>