<script setup lang="ts">
import { ref } from "vue";
import { ChecksumAlgorithm } from "@/utils/utils";
import MonacoEditor from "@/components/MonacoEditor.vue";
import SettingCard from "@/components/SettingCard.vue";
import { CopyDocument, UploadFilled } from "@element-plus/icons-vue";
import { usePageStore } from "../stores/page";
import { useLanguageStore } from "../stores/language";
const page = usePageStore();
const { t } = useLanguageStore();
const result = ref("");
const loading = ref(false);
const copyText = () => navigator.clipboard.writeText(result.value);
let currentFile: File | null = null;
function readFile(uploadFile: File | null) {
  if (!uploadFile) return;
  currentFile = uploadFile;
  loading.value = true;
  page
    .checksumFile(uploadFile)
    .then((r) => {
      result.value = page.checksum.upper ? r.toUpperCase() : r.toLowerCase();
      loading.value = false;
    })
    .catch(() => {
      loading.value = false;
    });
  return false;
}
function upperCaseChange() {
  page.checksumUpperChange()
  result.value = page.checksum.upper ? result.value.toUpperCase() : result.value.toLowerCase()
}
</script>

<template>
  <div class="dev-toys-checksum" v-loading="loading">
    <SettingCard :title="t('UpperCase')">
      <template #icon>
        <span class="dev-toys-icon"> &#x132; </span>
      </template>
      <el-switch size="small" v-model="page.checksum.upper" @change="upperCaseChange"/>
    </SettingCard>
    <SettingCard :title="t('Hash Algorithm')">
      <template #icon>
        <span class="dev-toys-icon"> &#x125; </span>
      </template>
      <el-select
        v-model="page.checksum.algorithm"
        size="small"
        @change="readFile(currentFile)"
      >
        <el-option
          :label="ChecksumAlgorithm.Md5"
          :value="ChecksumAlgorithm.Md5"
        />
        <el-option
          :label="ChecksumAlgorithm.Sha1"
          :value="ChecksumAlgorithm.Sha1"
        />
        <el-option
          :label="ChecksumAlgorithm.Sha256"
          :value="ChecksumAlgorithm.Sha256"
        />
        <el-option
          :label="ChecksumAlgorithm.Sha512"
          :value="ChecksumAlgorithm.Sha512"
        />
      </el-select>
    </SettingCard>
    <el-form
      label-position="top"
      label-width="100px"
      class="dev-toys-checksum-form"
    >
      <el-form-item :label="t('File')" class="dev-toys-checksum-form-upload">
        <el-upload
          drag
          multiple
          :show-file-list="false"
          :before-upload="readFile"
        >
          <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
          <div class="el-upload__text">
            {{ t("Drop Files Here") }} {{ t("or") }}
            <em>{{ t("Click to Upload") }}</em>
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item :label="t('Output')">
        <el-input v-model="result" readonly />
        <el-button
          plain
          :icon="CopyDocument"
          @click="copyText"
          :title="t('Copy')"
          style="margin-left: 12px"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="less" scoped>
.dev-toys-checksum {
  display: flex;
  // justify-content: space-between;
  flex-direction: column;

  &-form {
    margin-top: 20px;

    &-upload .el-form-item__content > div {
      width: 100%;
    }
  }
}
</style>
<style lang="less">
.dev-toys-checksum {
  .el-form-item__content {
    flex-wrap: nowrap;
  }
}
</style>